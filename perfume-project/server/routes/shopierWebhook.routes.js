import crypto from 'crypto';
import express from 'express';

const router = express.Router();

function normalizeSignature(signature) {
  return String(signature || '').replace(/^sha256=/i, '').trim();
}

function hmacHex(value, key) {
  return crypto.createHmac('sha256', key).update(value).digest('hex');
}

function safeEqualHex(left, right) {
  const normalizedLeft = normalizeSignature(left);
  const normalizedRight = normalizeSignature(right);

  if (
    !/^[a-f0-9]+$/i.test(normalizedLeft) ||
    !/^[a-f0-9]+$/i.test(normalizedRight) ||
    normalizedLeft.length !== normalizedRight.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(normalizedLeft, 'hex'),
    Buffer.from(normalizedRight, 'hex')
  );
}

function parseWebhookPayload(req) {
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body.toString('utf8')
    : JSON.stringify(req.body || {});

  return {
    rawBody,
    data: JSON.parse(rawBody),
  };
}

function verifyShopierSignature({ rawBody, data, signature }) {
  const key = process.env.SHOPIER_WEBHOOK_TOKEN;

  if (!key) {
    throw new Error('SHOPIER_WEBHOOK_TOKEN tanimli degil');
  }

  const rawHash = hmacHex(rawBody, key);
  const normalizedHash = hmacHex(JSON.stringify(data), key);

  return safeEqualHex(rawHash, signature) || safeEqualHex(normalizedHash, signature);
}

function getLineItems(order) {
  return Array.isArray(order?.lineItems) ? order.lineItems : [];
}

function normalizeLineItem(item) {
  const productId = item?.productId ? String(item.productId) : '';
  const quantity = Number(item?.quantity || 0);

  if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
    return null;
  }

  return {
    productId,
    quantity,
  };
}

async function reduceStockForOrder(pool, order, metadata) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO "ShopierWebhookEvents" (
        shopier_webhook_id,
        shopier_order_id,
        event,
        shopier_account_id,
        payload
      )
      VALUES ($1, $2, $3, $4, $5::jsonb)
      ON CONFLICT (shopier_order_id) DO NOTHING
      RETURNING id`,
      [
        metadata.webhookId || null,
        String(order.id),
        metadata.event,
        metadata.accountId || null,
        JSON.stringify(order),
      ]
    );

    if (insertResult.rowCount === 0) {
      await client.query('COMMIT');
      return {
        duplicate: true,
        orderId: String(order.id),
        updated: [],
        unmatched: [],
      };
    }

    const updated = [];
    const unmatched = [];

    for (const item of getLineItems(order).map(normalizeLineItem).filter(Boolean)) {
      const updateResult = await client.query(
        `UPDATE "PerfumeStock"
        SET stock_quantity = GREATEST(stock_quantity - $2, 0)
        WHERE shopier_product_id = $1
        RETURNING id, shopier_product_id, shopier_product_name, stock_quantity`,
        [item.productId, item.quantity]
      );

      if (updateResult.rowCount === 0) {
        unmatched.push(item);
      } else {
        updated.push(
          ...updateResult.rows.map((row) => ({
            ...row,
            quantity_sold: item.quantity,
          }))
        );
      }
    }

    const processingResult = {
      duplicate: false,
      orderId: String(order.id),
      updated,
      unmatched,
    };

    await client.query(
      `UPDATE "ShopierWebhookEvents"
      SET processing_result = $1::jsonb,
          processed_at = NOW()
      WHERE id = $2`,
      [JSON.stringify(processingResult), insertResult.rows[0].id]
    );

    await client.query('COMMIT');
    return processingResult;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

router.post('/', async (req, res, next) => {
  try {
    const event = req.get('shopier-event');
    const signature = req.get('shopier-signature');
    const accountId = req.get('shopier-account-id');
    const webhookId = req.get('shopier-webhook-id');
    const expectedAccountId = process.env.SHOPIER_ACCOUNT_ID;
    const { rawBody, data } = parseWebhookPayload(req);

    if (expectedAccountId && accountId !== expectedAccountId) {
      return res.status(401).send('invalid account');
    }

    if (!verifyShopierSignature({ rawBody, data, signature })) {
      return res.status(401).send('invalid signature');
    }

    if (event !== 'order.created') {
      return res.status(200).json({ ok: true, ignored: true, event });
    }

    if (!data?.id) {
      return res.status(400).json({ error: 'order id missing' });
    }

    const result = await reduceStockForOrder(req.app.get('pool'), data, {
      event,
      accountId,
      webhookId,
    });

    res.status(200).json({ ok: true, ...result });
  } catch (error) {
    next(error);
  }
});

export default router;
