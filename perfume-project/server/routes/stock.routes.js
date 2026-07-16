import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import {
  createShopierProduct,
  getShopierProduct,
  listStoreProducts,
  updateShopierProduct,
} from '../services/storeCatalog.service.js';

const router = express.Router();

const SHOPIER_CATEGORY = {
  FEMALE: {
    id: '9d99fc7eefb60892',
    title: 'Kadın',
    imageKey: 'female',
    titleSuffix: 'kadın',
  },
  MALE: {
    id: '6aee837bc71ba3f3',
    title: 'Erkek',
    imageKey: 'male',
    titleSuffix: 'erkek',
  },
  UNISEX: {
    id: '9806ee2567a27cf4',
    title: 'Unisex',
    imageKey: 'unisex',
    titleSuffix: 'unisex',
  },
};

const SHOPIER_CATEGORY_BY_STOCK_CATEGORY = {
  kadin: SHOPIER_CATEGORY.FEMALE,
  erkek: SHOPIER_CATEGORY.MALE,
  unisex: SHOPIER_CATEGORY.UNISEX,
};

function normalizeCategoryKey(category) {
  return String(category || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace('ı', 'i');
}

function getShopierCategory(category) {
  return SHOPIER_CATEGORY_BY_STOCK_CATEGORY[normalizeCategoryKey(category)] || null;
}

function getPublicFrontendOrigin(req) {
  const origin = req.get('origin');

  if (origin) {
    return origin;
  }

  const forwardedProto = req.get('x-forwarded-proto');
  const forwardedHost = req.get('x-forwarded-host');

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto.split(',')[0]}://${forwardedHost.split(',')[0]}`;
  }

  return '';
}

function getShopierImageBaseUrl(req) {
  const baseUrl = process.env.SHOPIER_PRODUCT_IMAGE_BASE_URL;

  if (baseUrl) {
    return baseUrl.replace(/\/$/, '');
  }

  const publicFrontendOrigin = getPublicFrontendOrigin(req);

  if (!publicFrontendOrigin) {
    return '';
  }

  return `${publicFrontendOrigin.replace(/\/$/, '')}/perfume-formulas/shopier-products`;
}

function getShopierImageUrl(req, category) {
  const baseUrl = getShopierImageBaseUrl(req);

  if (!baseUrl) {
    return '';
  }

  return `${baseUrl}/${category.imageKey}.png`;
}

function isPublicMediaUrl(url) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }

    return !(
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    );
  } catch (error) {
    return false;
  }
}

function formatShopierPrice(value) {
  return Number(value || 0).toFixed(2);
}

function calculateShopierPrice(cost) {
  const numericCost = Number(cost) || 0;
  return Math.floor(((numericCost + Math.max(numericCost * 0.6, 100) + 100) / 0.94 / 10)) * 10;
}

function buildShopierDescription(stockRecord) {
  return [
    stockRecord.top_notes ? `Üst Notalar: ${stockRecord.top_notes}` : null,
    stockRecord.middle_notes ? `Orta Notalar: ${stockRecord.middle_notes}` : null,
    stockRecord.base_notes ? `Alt Notalar: ${stockRecord.base_notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');
}

function buildShopierPayload(req, stockRecord, overrides = {}) {
  const category = getShopierCategory(overrides.category || stockRecord.category);

  if (!category) {
    throw new Error('Shopier kategorisi eslestirilemedi');
  }

  const mediaUrl = overrides.mediaUrl || getShopierImageUrl(req, category);
  const title =
    overrides.title ||
    `${stockRecord.brand_name} - ${stockRecord.perfume_name} - 50 ml ${category.titleSuffix} parfüm`;

  return {
    title,
    description: overrides.description ?? buildShopierDescription(stockRecord),
    type: 'physical',
    media: [
      {
        type: 'image',
        url: mediaUrl,
        placement: 1,
      },
    ],
    priceData: {
      currency: 'TRY',
      price: formatShopierPrice(overrides.price ?? stockRecord.shopier_price),
      shippingPrice: formatShopierPrice(overrides.shippingPrice ?? 50),
      discount: Boolean(overrides.discount ?? false),
    },
    stockQuantity: Number(overrides.stockQuantity ?? stockRecord.stock_quantity),
    shippingPayer: 'sellerPays',
    categories: [{ categoryId: overrides.categoryId || category.id }],
  };
}

function getAutomationApiKey(req) {
  return (
    req.headers['x-api-key'] ||
    req.headers['authorization']?.replace('Bearer ', '') ||
    req.query.api_key
  );
}

function validateAutomationApiKey(req, res) {
  const apiKey = getAutomationApiKey(req);

  if (!apiKey || apiKey !== process.env.AUTOMATION_API_KEY) {
    console.warn(`Unauthorized automation API access attempt from IP: ${req.ip}`);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Valid API key required for automation endpoint',
    });
    return false;
  }

  return true;
}

function buildStockBaseQuery({ includeMaturingInfo = false } = {}) {
  return `
      SELECT
        s.id,
        (b.brand_name || ' - ' || p.perfume_name) AS name,
        b.brand_name,
        p.perfume_name,
        translate_text(p.top_notes) AS top_notes,
        translate_text(p.middle_notes) AS middle_notes,
        translate_text(p.base_notes) AS base_notes,
        s.price,
        s.shopier_product_id,
        s.shopier_product_name,
        s.ikas_product_id,
        s.ikas_product_name,
        FLOOR((((s.price + GREATEST(s.price * 0.50, 100) + 60) / 0.85) / 10)) * 10 AS dolap_price,
        CASE
          WHEN FLOOR((s.price + GREATEST(s.price * 0.80, 100)) / 10) * 10 < 400
            THEN 400
          ELSE FLOOR((s.price + GREATEST(s.price * 0.80, 100)) / 10) * 10
        END AS cash_price,
        FLOOR((((s.price + GREATEST(s.price * 0.60, 100) + 100) / 0.94) / 10)) * 10 AS shopier_price,
        s.stock_quantity,
        s.category,
        COALESCE(SUM(m.quantity), 0) AS maturing_quantity,
        ${
          includeMaturingInfo
            ? `
        COALESCE(
          STRING_AGG(
            m.quantity || ' Adet Demlenen, Ürt. Tar: ' || TO_CHAR(m.maturation_start_date, 'DD.MM.YYYY'),
            ' / '
            ORDER BY m.maturation_start_date ASC
          ),
          ''
        ) AS maturing_info,
        `
            : ''
        }
        p.perfume_id
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "PerfumeMaturation" m ON s.perfume_id = m.perfume_id
    `;
}

function buildStockGroupByQuery() {
  return `
      GROUP BY
        s.id,
        b.brand_name,
        p.perfume_name,
        p.top_notes,
        p.middle_notes,
        p.base_notes,
        s.price,
        s.shopier_product_id,
        s.shopier_product_name,
        s.ikas_product_id,
        s.ikas_product_name,
        s.stock_quantity,
        s.category,
        p.perfume_id
    `;
}

function validateStockUpdatePayload(res, { stock_quantity, price }) {
  if (stock_quantity === undefined && price === undefined) {
    res.status(400).json({ error: 'Güncellenecek veri (stok veya fiyat) gönderilmedi.' });
    return false;
  }

  if (
    stock_quantity !== undefined &&
    stock_quantity !== null &&
    (typeof stock_quantity !== 'number' || stock_quantity < 0)
  ) {
    res.status(400).json({ error: 'stock_quantity pozitif bir sayı olmalı' });
    return false;
  }

  if (price !== undefined && price !== null && (typeof price !== 'number' || price < 0)) {
    res.status(400).json({ error: 'price pozitif bir sayı olmalı' });
    return false;
  }

  return true;
}

async function updateStockRecord(pool, id, { stock_quantity, price }) {
  const fields = [];
  const values = [];
  let paramIndex = 1;

  if (stock_quantity !== undefined && stock_quantity !== null) {
    fields.push(`stock_quantity = $${paramIndex++}`);
    values.push(stock_quantity);
  }

  if (price !== undefined && price !== null) {
    fields.push(`price = $${paramIndex++}`);
    values.push(price);
  }

  values.push(id);

  const query = `UPDATE "PerfumeStock" SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  return pool.query(query, values);
}

async function syncShopierForStockUpdate(stockRecord, { stock_quantity, price }) {
  if (!stockRecord.shopier_product_id) {
    return {
      status: 'skipped',
      reason: 'not_linked',
    };
  }

  const nextStockQuantity =
    stock_quantity !== undefined && stock_quantity !== null
      ? Number(stock_quantity)
      : Number(stockRecord.stock_quantity);
  const nextShopierPrice = calculateShopierPrice(
    price !== undefined && price !== null ? price : stockRecord.price
  );

  const product = await updateShopierProduct(stockRecord.shopier_product_id, {
    price: formatShopierPrice(nextShopierPrice),
    stockQuantity: nextStockQuantity,
  });

  return {
    status: 'synced',
    product_id: stockRecord.shopier_product_id,
    price: formatShopierPrice(nextShopierPrice),
    stockQuantity: nextStockQuantity,
    product,
  };
}

async function updateStockRecordWithShopierSync(pool, id, updates) {
  const stockRecord = await getStockRecordForShopier(pool, id);

  if (!stockRecord) {
    return {
      result: { rowCount: 0, rows: [] },
      shopierSync: null,
    };
  }

  const shopierSync = await syncShopierForStockUpdate(stockRecord, updates);
  const result = await updateStockRecord(pool, id, updates);

  return {
    result,
    shopierSync,
  };
}

async function getStockRecordForShopier(pool, id) {
  const result = await pool.query(
    `
      ${buildStockBaseQuery()}
      WHERE s.id = $1
      ${buildStockGroupByQuery()}
    `,
    [id]
  );

  return result.rows[0] || null;
}

// Create stock record (requires admin)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { perfume_id, price, stock_quantity, category } = req.body;
    const pool = req.app.get('pool');

    if (!perfume_id || !price || stock_quantity === undefined) {
      return res.status(400).json({
        error: 'perfume_id, price ve stock_quantity gerekli alanlar',
      });
    }

    const perfumeCheck = await pool.query(
      'SELECT perfume_id FROM "Perfumes" WHERE perfume_id = $1',
      [perfume_id]
    );

    if (perfumeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parfüm bulunamadı' });
    }

    const result = await pool.query(
      `INSERT INTO "PerfumeStock" (perfume_id, price, stock_quantity, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [perfume_id, price, stock_quantity, category]
    );

    res.status(201).json({
      message: 'Stok kaydı oluşturuldu',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Get stock list with pagination and search (requires admin)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { limit = 10, page = 1, sortBy = 'name', sortOrder = 'asc', search = '' } = req.query;

    const pool = req.app.get('pool');
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const offset = (pageNumber - 1) * limitNumber;
    const searchPattern = `%${String(search).toLowerCase()}%`;

    const query = `
      ${buildStockBaseQuery({ includeMaturingInfo: true })}
      WHERE
        LOWER(b.brand_name) LIKE $1
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
      ${buildStockGroupByQuery()}
      ORDER BY
        CASE WHEN LOWER(b.brand_name) LIKE $1 THEN 0 ELSE 1 END,
        CASE
          WHEN $2 = 'name' THEN (b.brand_name || ' - ' || p.perfume_name)
          WHEN $2 = 'price' THEN s.price::text
          WHEN $2 = 'stock_quantity' THEN s.stock_quantity::text
          WHEN $2 = 'category' THEN s.category
          ELSE (b.brand_name || ' - ' || p.perfume_name)
        END ${sortOrder},
        s.id DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, [searchPattern, sortBy, limitNumber, offset]);

    const countQuery = `
      SELECT COUNT(DISTINCT s.id)
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      WHERE
        LOWER(b.brand_name) LIKE $1
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
    `;

    const countResult = await pool.query(countQuery, [searchPattern]);

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: pageNumber,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limitNumber),
      limit: limitNumber,
    });
  } catch (error) {
    next(error);
  }
});

// Update stock (requires admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  const { id } = req.params;
  const { stock_quantity, price } = req.body;

  if (!validateStockUpdatePayload(res, { stock_quantity, price })) {
    return;
  }

  try {
    const pool = req.app.get('pool');
    const { result, shopierSync } = await updateStockRecordWithShopierSync(pool, id, {
      stock_quantity,
      price,
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    res.json({
      message:
        shopierSync?.status === 'synced'
          ? 'Güncelleme başarılı, Shopier senkronize edildi'
          : 'Güncelleme başarılı',
      data: result.rows[0],
      shopier_sync: shopierSync,
    });
  } catch (error) {
    next(error);
  }
});

// Automation API endpoints (API key required)
router.get('/automation', async (req, res, next) => {
  try {
    if (!validateAutomationApiKey(req, res)) {
      return;
    }

    const { limit = 100, page = 1, sortBy = 'name', sortOrder = 'asc', search = '' } = req.query;

    const pool = req.app.get('pool');
    const pageNumber = parseInt(page, 10);
    const limitNumber = Math.min(parseInt(limit, 10), 1000);
    const offset = (pageNumber - 1) * limitNumber;
    const searchPattern = `%${String(search).toLowerCase()}%`;

    const query = `
      ${buildStockBaseQuery()}
      WHERE
        LOWER(b.brand_name) LIKE $1
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
      ${buildStockGroupByQuery()}
      ORDER BY
        CASE WHEN LOWER(b.brand_name) LIKE $1 THEN 0 ELSE 1 END,
        CASE
          WHEN $2 = 'name' THEN (b.brand_name || ' - ' || p.perfume_name)
          WHEN $2 = 'price' THEN s.price::text
          WHEN $2 = 'stock_quantity' THEN s.stock_quantity::text
          ELSE (b.brand_name || ' - ' || p.perfume_name)
        END ${sortOrder},
        s.id DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, [searchPattern, sortBy, limitNumber, offset]);

    const countQuery = `
      SELECT COUNT(DISTINCT s.id)
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      WHERE LOWER(b.brand_name) LIKE $1 OR LOWER(p.perfume_name) LIKE $1 OR LOWER(s.category) LIKE $1
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: pageNumber,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count, 10) / limitNumber),
      limit: limitNumber,
      maxLimit: 1000,
      timestamp: new Date().toISOString(),
      source: 'automation-api',
    });
  } catch (error) {
    next(error);
  }
});

router.get('/automation/search', async (req, res, next) => {
  try {
    if (!validateAutomationApiKey(req, res)) {
      return;
    }

    const rawQuery = String(req.query.q || req.query.query || '').trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);

    if (!rawQuery) {
      return res.status(400).json({
        error: 'Search query is required',
        message: 'Provide q or query parameter',
      });
    }

    const pool = req.app.get('pool');
    const normalizedQuery = rawQuery.toLowerCase().replace(/\s+/g, ' ').trim();
    const compactQuery = normalizedQuery.replace(/[\s-]+/g, '');
    const containsPattern = `%${normalizedQuery}%`;
    const prefixPattern = `${normalizedQuery}%`;
    const compactContainsPattern = `%${compactQuery}%`;
    const tokens = normalizedQuery.split(' ').filter(Boolean);
    const tokenPatterns = tokens.map((token) => `%${token}%`);

    const tokenScoreSql =
      tokens.length > 0
        ? tokenPatterns
            .map(
              (_, index) => `
                    CASE
                      WHEN LOWER(b.brand_name || ' ' || p.perfume_name) LIKE $${6 + index}
                      THEN 4
                      ELSE 0
                    END
                `
            )
            .join(' + ')
        : '0';

    const query = `
      ${buildStockBaseQuery({ includeMaturingInfo: true })}
      WHERE
        LOWER(b.brand_name || ' - ' || p.perfume_name) LIKE $1
        OR LOWER(b.brand_name || ' ' || p.perfume_name) LIKE $1
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(b.brand_name) LIKE $1
        OR REPLACE(REPLACE(LOWER(b.brand_name || p.perfume_name), ' ', ''), '-', '') LIKE $2
      ${buildStockGroupByQuery()}
      ORDER BY
        (
          CASE
            WHEN LOWER(b.brand_name || ' - ' || p.perfume_name) = $3 THEN 1000
            WHEN LOWER(b.brand_name || ' ' || p.perfume_name) = $3 THEN 975
            WHEN LOWER(p.perfume_name) = $3 THEN 950
            WHEN LOWER(b.brand_name) = $3 THEN 900
            WHEN LOWER(b.brand_name || ' - ' || p.perfume_name) LIKE $4 THEN 700
            WHEN LOWER(p.perfume_name) LIKE $4 THEN 650
            WHEN LOWER(b.brand_name) LIKE $4 THEN 600
            ELSE 0
          END
          +
          CASE
            WHEN REPLACE(REPLACE(LOWER(b.brand_name || p.perfume_name), ' ', ''), '-', '') = $5 THEN 500
            ELSE 0
          END
          +
          (${tokenScoreSql})
        ) DESC,
        LENGTH(b.brand_name || ' - ' || p.perfume_name) ASC,
        s.stock_quantity DESC,
        s.id DESC
      LIMIT ${limit}
    `;

    const params = [
      containsPattern,
      compactContainsPattern,
      normalizedQuery,
      prefixPattern,
      compactQuery,
      ...tokenPatterns,
    ];

    const result = await pool.query(query, params);

    res.json({
      query: rawQuery,
      normalized_query: normalizedQuery,
      matches: result.rows,
      count: result.rows.length,
      limit,
      source: 'automation-search',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/automation/:id', async (req, res, next) => {
  const { id } = req.params;
  const { stock_quantity, price } = req.body;

  if (!validateAutomationApiKey(req, res)) {
    return;
  }

  if (!validateStockUpdatePayload(res, { stock_quantity, price })) {
    return;
  }

  try {
    const pool = req.app.get('pool');
    const { result, shopierSync } = await updateStockRecordWithShopierSync(pool, id, {
      stock_quantity,
      price,
    });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    res.json({
      message:
        shopierSync?.status === 'synced'
          ? 'Güncelleme başarılı, Shopier senkronize edildi'
          : 'Güncelleme başarılı',
      data: result.rows[0],
      shopier_sync: shopierSync,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/store-links', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { provider = 'shopier' } = req.query;
    const pool = req.app.get('pool');

    const stockResult = await pool.query(
      `SELECT
        id,
        shopier_product_id,
        shopier_product_name,
        ikas_product_id,
        ikas_product_name
      FROM "PerfumeStock"
      WHERE id = $1`,
      [id]
    );

    if (stockResult.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    const stockRecord = stockResult.rows[0];
    const products = await listStoreProducts({ provider });

    res.json({
      provider,
      current: {
        shopier: {
          product_id: stockRecord.shopier_product_id,
          product_name: stockRecord.shopier_product_name,
        },
        ikas: {
          product_id: stockRecord.ikas_product_id,
          product_name: stockRecord.ikas_product_name,
        },
      },
      products,
      providers: [
        { id: 'shopier', label: 'Shopier', enabled: true },
        { id: 'ikas', label: 'ikas', enabled: false },
      ],
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/store-details', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');

    const stockResult = await pool.query(
      `SELECT
        id,
        shopier_product_id,
        shopier_product_name
      FROM "PerfumeStock"
      WHERE id = $1`,
      [id]
    );

    if (stockResult.rowCount === 0) {
      return res.status(404).json({ error: 'Kayit bulunamadi' });
    }

    const stockRecord = stockResult.rows[0];

    if (!stockRecord.shopier_product_id) {
      return res.json({
        provider: 'shopier',
        current: {
          product_id: null,
          product_name: null,
        },
        product: null,
      });
    }

    const product = await getShopierProduct(stockRecord.shopier_product_id);

    res.json({
      provider: 'shopier',
      current: {
        product_id: stockRecord.shopier_product_id,
        product_name: stockRecord.shopier_product_name,
      },
      product,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id/shopier-product-preview', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');
    const stockRecord = await getStockRecordForShopier(pool, id);

    if (!stockRecord) {
      return res.status(404).json({ error: 'Kayit bulunamadi' });
    }

    if (Number(stockRecord.stock_quantity) <= 0) {
      return res.status(400).json({ error: 'Stok miktari 0 olan urun Shopier e eklenemez' });
    }

    if (stockRecord.shopier_product_id) {
      return res.status(400).json({ error: 'Bu stok kaydi zaten Shopier urunu ile eslesmis' });
    }

    const category = getShopierCategory(stockRecord.category);

    if (!category) {
      return res.status(400).json({ error: 'Shopier kategorisi eslestirilemedi' });
    }

    const payload = buildShopierPayload(req, stockRecord);

    res.json({
      payload,
      category,
      imageBaseUrl: getShopierImageBaseUrl(req),
      imageBaseUrlConfigured: Boolean(getShopierImageBaseUrl(req)),
      mediaOptions: SHOPIER_CATEGORY,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/shopier-product', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');
    const stockRecord = await getStockRecordForShopier(pool, id);

    if (!stockRecord) {
      return res.status(404).json({ error: 'Kayit bulunamadi' });
    }

    if (Number(stockRecord.stock_quantity) <= 0) {
      return res.status(400).json({ error: 'Stok miktari 0 olan urun Shopier e eklenemez' });
    }

    if (stockRecord.shopier_product_id) {
      return res.status(400).json({ error: 'Bu stok kaydi zaten Shopier urunu ile eslesmis' });
    }

    const payload = buildShopierPayload(req, stockRecord, req.body || {});
    const mediaUrl = payload.media?.[0]?.url;

    if (!mediaUrl || !isPublicMediaUrl(mediaUrl)) {
      return res.status(400).json({
        error: 'Shopier icin public media URL gerekli. localhost veya local network adresi kullanilamaz.',
      });
    }

    const product = await createShopierProduct(payload);

    if (!product?.id) {
      return res.status(502).json({ error: 'Shopier urun ID donmedi' });
    }

    const updateResult = await pool.query(
      `UPDATE "PerfumeStock"
      SET shopier_product_id = $1,
          shopier_product_name = $2
      WHERE id = $3
      RETURNING id, shopier_product_id, shopier_product_name`,
      [product.id, product.name || payload.title, id]
    );

    res.status(201).json({
      message: 'Shopier urunu olusturuldu ve eslestirildi',
      product,
      data: updateResult.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/shopier-product/sync', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, price, stockQuantity } = req.body || {};
    const pool = req.app.get('pool');
    const stockRecord = await getStockRecordForShopier(pool, id);

    if (!stockRecord) {
      return res.status(404).json({ error: 'Kayit bulunamadi' });
    }

    if (!stockRecord.shopier_product_id) {
      return res.status(400).json({ error: 'Bu stok kaydi Shopier urunu ile eslesmemis' });
    }

    const updates = {
      title: title !== undefined ? String(title).trim() : undefined,
      price: price !== undefined ? formatShopierPrice(price) : formatShopierPrice(stockRecord.shopier_price),
      stockQuantity:
        stockQuantity !== undefined ? Number(stockQuantity) : Number(stockRecord.stock_quantity),
    };

    if (updates.title !== undefined && !updates.title) {
      return res.status(400).json({ error: 'Shopier urun adi bos olamaz' });
    }

    if (price !== undefined && !String(price).trim()) {
      return res.status(400).json({ error: 'Shopier fiyati bos olamaz' });
    }

    if (stockQuantity !== undefined && !String(stockQuantity).trim()) {
      return res.status(400).json({ error: 'Shopier stok adedi bos olamaz' });
    }

    if (Number.isNaN(Number(updates.price)) || Number(updates.price) < 0) {
      return res.status(400).json({ error: 'Shopier fiyati pozitif bir sayi olmali' });
    }

    if (!Number.isInteger(updates.stockQuantity) || updates.stockQuantity < 0) {
      return res.status(400).json({ error: 'Shopier stok adedi pozitif bir tam sayi olmali' });
    }

    const product = await updateShopierProduct(stockRecord.shopier_product_id, updates);
    const productName = product?.name || updates.title || stockRecord.shopier_product_name;

    if (productName !== stockRecord.shopier_product_name) {
      await pool.query('UPDATE "PerfumeStock" SET shopier_product_name = $1 WHERE id = $2', [
        productName,
        id,
      ]);
    }

    res.json({
      message: 'Shopier urunu guncellendi',
      updates,
      current: {
        product_id: stockRecord.shopier_product_id,
        product_name: productName,
      },
      product,
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/store-links', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { provider, product_id, product_name } = req.body;
    const pool = req.app.get('pool');

    if (!provider || !['shopier', 'ikas'].includes(provider)) {
      return res.status(400).json({ error: 'Geçerli bir provider gerekli' });
    }

    if (provider === 'ikas') {
      return res.status(400).json({ error: 'ikas eşleştirmesi henüz aktif değil' });
    }

    if (!product_id || !product_name) {
      return res.status(400).json({ error: 'product_id ve product_name gerekli' });
    }

    const result = await pool.query(
      `UPDATE "PerfumeStock"
      SET shopier_product_id = $1,
          shopier_product_name = $2
      WHERE id = $3
      RETURNING id, shopier_product_id, shopier_product_name`,
      [String(product_id), String(product_name), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    res.json({
      message: 'Mağaza ürünü eşleştirildi',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/store-links', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { provider = 'shopier' } = req.query;
    const pool = req.app.get('pool');

    if (provider !== 'shopier') {
      return res.status(400).json({ error: 'Sadece Shopier eslestirmesi silinebilir' });
    }

    const result = await pool.query(
      `UPDATE "PerfumeStock"
      SET shopier_product_id = NULL,
          shopier_product_name = NULL
      WHERE id = $1
      RETURNING id, shopier_product_id, shopier_product_name`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayit bulunamadi' });
    }

    res.json({
      message: 'Shopier eslestirmesi silindi',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Maturation endpoints

// Create maturation record (requires admin)
router.post('/maturation', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { perfume_id, maturation_start_date, quantity, notes } = req.body;
    const pool = req.app.get('pool');

    const perfumeCheck = await pool.query('SELECT * FROM "Perfumes" WHERE perfume_id = $1', [
      perfume_id,
    ]);

    if (perfumeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parfüm bulunamadı' });
    }

    const result = await pool.query(
      `INSERT INTO "PerfumeMaturation" (perfume_id, maturation_start_date, quantity, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [perfume_id, maturation_start_date || new Date().toISOString().split('T')[0], quantity, notes]
    );

    res.status(201).json({
      message: 'Demlenme kaydı oluşturuldu',
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

// Get all maturation records (requires admin)
router.get('/maturation', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const pool = req.app.get('pool');
    const result = await pool.query(`
      SELECT
        m.id,
        m.perfume_id,
        (b.brand_name || ' ' || p.perfume_name) AS perfume_name,
        m.maturation_start_date,
        m.quantity,
        m.notes,
        m.created_at,
        CURRENT_DATE - m.maturation_start_date AS days_maturing
      FROM "PerfumeMaturation" m
      JOIN "Perfumes" p ON m.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      ORDER BY m.maturation_start_date ASC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get maturation records by perfume ID (requires admin)
router.get(
  '/maturation/by-perfume/:id',
  authenticateToken,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const pool = req.app.get('pool');

      const result = await pool.query(
        'SELECT id, perfume_id, maturation_start_date, quantity, notes FROM "PerfumeMaturation" WHERE perfume_id = $1',
        [id]
      );

      res.json(result.rows);
    } catch (error) {
      next(error);
    }
  }
);

// Alias route for backward compatibility
router.get('/by-perfume-id/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const pool = req.app.get('pool');

    const result = await pool.query(
      'SELECT id, perfume_id, maturation_start_date, quantity, notes FROM "PerfumeMaturation" WHERE perfume_id = $1',
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Complete maturation and move to stock (requires admin)
router.put('/maturation/:id/complete', authenticateToken, requireAdmin, async (req, res, next) => {
  const pool = req.app.get('pool');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id } = req.params;

    const maturationResult = await client.query('SELECT * FROM "PerfumeMaturation" WHERE id = $1', [
      id,
    ]);

    if (maturationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Demlenme kaydı bulunamadı' });
    }

    const maturationRecord = maturationResult.rows[0];
    const { perfume_id, quantity } = maturationRecord;

    const stockResult = await client.query('SELECT * FROM "PerfumeStock" WHERE perfume_id = $1', [
      perfume_id,
    ]);

    if (stockResult.rows.length === 0) {
      return res.status(400).json({
        error: 'Bu parfüm için stok kaydı bulunamadı. Önce stok kaydı oluşturulmalı.',
      });
    }

    const currentStock = stockResult.rows[0].stock_quantity;
    const newStockQuantity = currentStock + quantity;

    await client.query('UPDATE "PerfumeStock" SET stock_quantity = $1 WHERE perfume_id = $2', [
      newStockQuantity,
      perfume_id,
    ]);

    await client.query('DELETE FROM "PerfumeMaturation" WHERE id = $1', [id]);

    await client.query('COMMIT');

    res.json({
      message: 'Demlenme tamamlandı ve stok güncellendi',
      data: {
        completed_maturation: maturationRecord,
        previous_stock: currentStock,
        new_stock: newStockQuantity,
        added_quantity: quantity,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

// Health check for automation API
router.get('/automation/health', (req, res) => {
  if (!validateAutomationApiKey(req, res)) {
    return;
  }

  res.json({
    status: 'ok',
    message: 'Automation API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
