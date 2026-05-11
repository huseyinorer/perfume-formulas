import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

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
        FLOOR((((s.price + GREATEST(s.price * 0.50, 100) + 60) / 0.85) / 10)) * 10 AS dolap_price,
        CASE
          WHEN FLOOR((s.price + GREATEST(s.price * 0.80, 100)) / 10) * 10 < 300
            THEN 300
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
    const result = await updateStockRecord(pool, id, { stock_quantity, price });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    res.json({
      message: 'Güncelleme başarılı',
      data: result.rows[0],
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
    const result = await updateStockRecord(pool, id, { stock_quantity, price });

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }

    res.json({
      message: 'Güncelleme başarılı',
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
