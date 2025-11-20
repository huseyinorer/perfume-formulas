import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create stock record (requires auth)
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { perfume_id, price, stock_quantity, category } = req.body;
        const pool = req.app.get('pool');

        if (!perfume_id || !price || stock_quantity === undefined) {
            return res.status(400).json({
                error: 'perfume_id, price ve stock_quantity gerekli alanlar'
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
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Get stock list with pagination and search (requires auth)
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const {
            limit = 10,
            page = 1,
            sortBy = 'name',
            sortOrder = 'asc',
            search = ''
        } = req.query;

        const pool = req.app.get('pool');
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const offset = (pageNumber - 1) * limitNumber;
        const searchPattern = `%${search.toLowerCase()}%`;

        const query = `
      SELECT 
        s.id,
        (b.brand_name || ' - ' || p.perfume_name) AS name,
        translate_text(p.top_notes) AS top_notes,
        translate_text(p.middle_notes) AS middle_notes,
        translate_text(p.base_notes) AS base_notes,
        s.price,
        s.stock_quantity,
        s.category,
        COALESCE(SUM(m.quantity), 0) AS maturing_quantity,
        COALESCE(
          STRING_AGG(
            m.quantity || ' Adet Demlenen, Ürt. Tar: ' || TO_CHAR(m.maturation_start_date, 'DD.MM.YYYY'),
            ' / ' 
            ORDER BY m.maturation_start_date ASC
          ),
          ''
        ) AS maturing_info,
        p.perfume_id
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "PerfumeMaturation" m ON s.perfume_id = m.perfume_id
      WHERE 
        LOWER(b.brand_name) LIKE $1 
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
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

        const result = await pool.query(query, [
            searchPattern,
            sortBy,
            limitNumber,
            offset
        ]);

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
            total: parseInt(countResult.rows[0].count),
            page: pageNumber,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limitNumber),
            limit: limitNumber
        });
    } catch (error) {
        next(error);
    }
});

// Update stock (requires auth)
router.put('/:id', authenticateToken, async (req, res, next) => {
    const { id } = req.params;
    const { stock_quantity, price } = req.body;

    // En az bir değerin gönderildiğini kontrol et
    if (stock_quantity === undefined && price === undefined) {
        return res.status(400).json({ error: 'Güncellenecek veri (stok veya fiyat) gönderilmedi.' });
    }

    // Validasyonlar (Varsa kontrol et)
    if (stock_quantity !== undefined && stock_quantity !== null && (typeof stock_quantity !== 'number' || stock_quantity < 0)) {
        return res.status(400).json({ error: 'stock_quantity pozitif bir sayı olmalı' });
    }
    if (price !== undefined && price !== null && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'price pozitif bir sayı olmalı' });
    }

    try {
        const pool = req.app.get('pool');

        // Dinamik Query Oluşturma
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

        values.push(id); // ID en son parametre olacak

        const query = `UPDATE "PerfumeStock" SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Kayıt bulunamadı' });
        }

        res.json({
            message: 'Güncelleme başarılı',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Automation API endpoints (API key required)
router.get('/automation', async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'] ||
            req.headers['authorization']?.replace('Bearer ', '') ||
            req.query.api_key;

        if (!apiKey || apiKey !== process.env.AUTOMATION_API_KEY) {
            console.warn(`Unauthorized automation API access attempt from IP: ${req.ip}`);
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Valid API key required for automation endpoint'
            });
        }

        const {
            limit = 100,
            page = 1,
            sortBy = 'name',
            sortOrder = 'asc',
            search = ''
        } = req.query;

        const pool = req.app.get('pool');
        const pageNumber = parseInt(page);
        const limitNumber = Math.min(parseInt(limit), 1000);
        const offset = (pageNumber - 1) * limitNumber;
        const searchPattern = `%${search.toLowerCase()}%`;

        const query = `
      SELECT 
        s.id,
        (b.brand_name || ' - ' || p.perfume_name) AS name,
        translate_text(p.top_notes) AS top_notes,
        translate_text(p.middle_notes) AS middle_notes,
        translate_text(p.base_notes) AS base_notes,
        s.price,
        s.stock_quantity,
        s.category,
        COALESCE(SUM(m.quantity), 0) AS maturing_quantity,
        p.perfume_id
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "PerfumeMaturation" m ON s.perfume_id = m.perfume_id
      WHERE 
        LOWER(b.brand_name) LIKE $1 
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
      GROUP BY 
        s.id, b.brand_name, p.perfume_name, p.top_notes, p.middle_notes, 
        p.base_notes, s.price, s.stock_quantity, s.category, p.perfume_id
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
            total: parseInt(countResult.rows[0].count),
            page: pageNumber,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limitNumber),
            limit: limitNumber,
            maxLimit: 1000,
            timestamp: new Date().toISOString(),
            source: 'automation-api'
        });
    } catch (error) {
        next(error);
    }
});

router.put('/automation/:id', async (req, res, next) => {
    const apiKey = req.headers['x-api-key'] ||
        req.headers['authorization']?.replace('Bearer ', '') ||
        req.query.api_key;

    if (!apiKey || apiKey !== process.env.AUTOMATION_API_KEY) {
        console.warn(`Unauthorized automation API access attempt from IP: ${req.ip}`);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Valid API key required for automation endpoint'
        });
    }
    const { id } = req.params;
    const { stock_quantity, price } = req.body;

    // En az bir değerin gönderildiğini kontrol et
    if (stock_quantity === undefined && price === undefined) {
        return res.status(400).json({ error: 'Güncellenecek veri (stok veya fiyat) gönderilmedi.' });
    }

    // Validasyonlar (Varsa kontrol et)
    if (stock_quantity !== undefined && stock_quantity !== null && (typeof stock_quantity !== 'number' || stock_quantity < 0)) {
        return res.status(400).json({ error: 'stock_quantity pozitif bir sayı olmalı' });
    }
    if (price !== undefined && price !== null && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'price pozitif bir sayı olmalı' });
    }

    try {
        const pool = req.app.get('pool');

        // Dinamik Query Oluşturma
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

        values.push(id); // ID en son parametre olacak

        const query = `UPDATE "PerfumeStock" SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Kayıt bulunamadı' });
        }

        res.json({
            message: 'Güncelleme başarılı',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Maturation endpoints

// Create maturation record (requires auth)
router.post('/maturation', authenticateToken, async (req, res, next) => {
    try {
        const { perfume_id, maturation_start_date, quantity, notes } = req.body;
        const pool = req.app.get('pool');

        const perfumeCheck = await pool.query(
            'SELECT * FROM "Perfumes" WHERE perfume_id = $1',
            [perfume_id]
        );

        if (perfumeCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Parfüm bulunamadı' });
        }

        const result = await pool.query(
            `INSERT INTO "PerfumeMaturation" (perfume_id, maturation_start_date, quantity, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [
                perfume_id,
                maturation_start_date || new Date().toISOString().split('T')[0],
                quantity,
                notes
            ]
        );

        res.status(201).json({
            message: 'Demlenme kaydı oluşturuldu',
            data: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Get all maturation records (requires auth)
router.get('/maturation', authenticateToken, async (req, res, next) => {
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

// Get maturation records by perfume ID (requires auth)
router.get('/maturation/by-perfume/:id', authenticateToken, async (req, res, next) => {
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

// Complete maturation and move to stock (requires auth)
router.put('/maturation/:id/complete', authenticateToken, async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;

        const maturationResult = await client.query(
            'SELECT * FROM "PerfumeMaturation" WHERE id = $1',
            [id]
        );

        if (maturationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Demlenme kaydı bulunamadı' });
        }

        const maturationRecord = maturationResult.rows[0];
        const { perfume_id, quantity } = maturationRecord;

        const stockResult = await client.query(
            'SELECT * FROM "PerfumeStock" WHERE perfume_id = $1',
            [perfume_id]
        );

        if (stockResult.rows.length === 0) {
            return res.status(400).json({
                error: 'Bu parfüm için stok kaydı bulunamadı. Önce stok kaydı oluşturulmalı.'
            });
        }

        const currentStock = stockResult.rows[0].stock_quantity;
        const newStockQuantity = currentStock + quantity;

        await client.query(
            'UPDATE "PerfumeStock" SET stock_quantity = $1 WHERE perfume_id = $2',
            [newStockQuantity, perfume_id]
        );

        await client.query(
            'DELETE FROM "PerfumeMaturation" WHERE id = $1',
            [id]
        );

        await client.query('COMMIT');

        res.json({
            message: 'Demlenme tamamlandı ve stok güncellendi',
            data: {
                completed_maturation: maturationRecord,
                previous_stock: currentStock,
                new_stock: newStockQuantity,
                added_quantity: quantity
            }
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
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey || apiKey !== process.env.AUTOMATION_API_KEY) {
        return res.status(401).json({
            status: 'unauthorized',
            message: 'Invalid API key'
        });
    }

    res.json({
        status: 'ok',
        message: 'Automation API is healthy',
        timestamp: new Date().toISOString()
    });
});

export default router;
