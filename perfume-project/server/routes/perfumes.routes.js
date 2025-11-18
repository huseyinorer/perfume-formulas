import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Get all perfumes with pagination, search, and sorting
router.get('/', async (req, res, next) => {
    try {
        const {
            limit = 10,
            page = 1,
            sortBy = 'brand',
            sortOrder = 'asc',
            search = ''
        } = req.query;

        const pool = req.app.get('pool');
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const offset = (pageNumber - 1) * limitNumber;
        const searchPattern = `%${search.toLowerCase()}%`;

        // Get user_id from token if available
        let user_id = null;
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id;
            } catch (err) {
                // Token invalid or expired - continue without user_id
            }
        }

        const query = `
      SELECT 
        p.perfume_id as id,
        p.brand_id,
        b.brand_name as brand,
        p.perfume_name as name,
        p.type,
        translate_text(p.pyramid_note) AS pyramid_note,
        translate_text(p.top_notes) AS top_notes,
        translate_text(p.middle_notes) AS middle_notes,
        translate_text(p.base_notes) AS base_notes,
        translate_text(p.olfactive_family) AS olfactive_family,
        u.usage_info as recommended_usage,
        COUNT(pf.id) as "formulaCount",
        CASE 
          WHEN f.id IS NOT NULL THEN true
          ELSE false
        END as "is_favorite"
      FROM "Perfumes" p
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "CreativeFormulasUsageInfo" u ON p.perfume_id = u.perfume_id
      LEFT JOIN "PerfumeFormulas" pf ON p.perfume_id = pf.perfume_id
      LEFT JOIN "Favorites" f ON p.perfume_id = f.perfume_id 
        AND f.user_id = $5
      WHERE 
        LOWER(b.brand_name) LIKE $1 
        OR LOWER(p.perfume_name) LIKE $1
      GROUP BY 
        p.perfume_id,
        b.brand_name,
        p.perfume_name,
        p.type,
        p.pyramid_note,
        p.top_notes,
        p.middle_notes,
        p.base_notes,
        p.olfactive_family,
        u.usage_info,
        f.id
      ORDER BY 
        CASE WHEN LOWER(b.brand_name) LIKE $1 THEN 0 ELSE 1 END,
        COUNT(pf.id) DESC,
        CASE 
          WHEN $2 = 'brand' THEN b.brand_name 
          WHEN $2 = 'name' THEN p.perfume_name 
        END ${sortOrder},
        b.brand_name ASC,
        p.perfume_name ASC
      LIMIT $3 OFFSET $4
    `;

        const result = await pool.query(query, [
            searchPattern,
            sortBy,
            limitNumber,
            offset,
            user_id || null
        ]);

        const countQuery = `
      SELECT COUNT(DISTINCT p.perfume_id)
      FROM "Perfumes" p
      JOIN "Brands" b ON p.brand_id = b.brand_id
      WHERE LOWER(b.brand_name) LIKE $1 OR LOWER(p.perfume_name) LIKE $1
    `;
        const countResult = await pool.query(countQuery, [searchPattern]);

        res.json({
            data: result.rows,
            total: parseInt(countResult.rows[0].count),
            page: pageNumber,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limitNumber)
        });
    } catch (error) {
        next(error);
    }
});

// Get single perfume
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = req.app.get('pool');

        const result = await pool.query(
            `SELECT 
        p.*,
        b.brand_name,
        u.usage_info as recommended_usage
       FROM "Perfumes" p
       JOIN "Brands" b ON p.brand_id = b.brand_id
       LEFT JOIN "CreativeFormulasUsageInfo" u ON p.perfume_id = u.perfume_id
       WHERE p.perfume_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Perfume not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Get perfume details
router.get('/:id/details', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = req.app.get('pool');

        const result = await pool.query(
            `SELECT 
       p.perfume_id as id,
       b.brand_name as brand,
       p.perfume_name as name,
       p.type,
       translate_text(p.pyramid_note) AS pyramid_note,
       translate_text(p.top_notes) AS top_notes,
       translate_text(p.middle_notes) AS middle_notes,
       translate_text(p.base_notes) AS base_notes,
       translate_text(p.olfactive_family) AS olfactive_family,
       u.usage_info as recommended_usage
     FROM "Perfumes" p
     JOIN "Brands" b ON p.brand_id = b.brand_id
     LEFT JOIN "CreativeFormulasUsageInfo" u ON p.perfume_id = u.perfume_id
     WHERE p.perfume_id = $1`,
            [id]
        );

        res.json(result.rows[0] || null);
    } catch (error) {
        next(error);
    }
});

// Get formulas for a perfume (with ratings)
router.get('/:id/formulas', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = req.app.get('pool');

        const result = await pool.query(`
      SELECT
      pf.*,
      COALESCE(AVG(fr.rating), 0) as "averageRating",
      COUNT(fr.id) as "reviewCount"
    FROM "PerfumeFormulas" pf
    LEFT JOIN "FormulaRatings" fr ON pf.id = fr.formula_id
    WHERE pf.perfume_id = $1
    GROUP BY pf.id
    ORDER BY 
      CASE WHEN pf."created_at" IS NULL THEN 0 ELSE 1 END DESC,
      pf."created_at" DESC
    `, [id]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Search perfumes
router.get('/search', async (req, res, next) => {
    try {
        const { query } = req.query;
        const pool = req.app.get('pool');

        const result = await pool.query(
            `SELECT 
       p.perfume_id as id,
       b.brand_name as brand,
       p.perfume_name as name
     FROM "Perfumes" p
     JOIN "Brands" b ON p.brand_id = b.brand_id
     WHERE 
       LOWER(b.brand_name) LIKE $1 OR 
       LOWER(p.perfume_name) LIKE $1
     ORDER BY b.brand_name, p.perfume_name
     LIMIT 10`,
            [`%${query.toLowerCase()}%`]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// CREATE - Add new perfume (requires auth)
router.post('/', async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            brand_id,
            perfume_name,
            type,
            pyramid_note,
            top_notes,
            middle_notes,
            base_notes,
            olfactive_family
        } = req.body;

        if (!brand_id || !perfume_name) {
            return res.status(400).json({ error: 'Brand and perfume name are required' });
        }

        const brandCheck = await client.query(
            'SELECT brand_id FROM "Brands" WHERE brand_id = $1',
            [brand_id]
        );

        if (brandCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Brand not found' });
        }

        const result = await client.query(
            `INSERT INTO "Perfumes" 
       (brand_id, perfume_name, type, pyramid_note, top_notes, middle_notes, base_notes, olfactive_family)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [brand_id, perfume_name, type, pyramid_note, top_notes, middle_notes, base_notes, olfactive_family]
        );

        await client.query('COMMIT');
        res.status(201).json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.constraint === 'unique_brand_perfume') {
            res.status(400).json({ error: 'This perfume already exists for this brand' });
        } else {
            next(error);
        }
    } finally {
        client.release();
    }
});

// UPDATE - Update perfume (requires auth)
router.put('/:id', async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const {
            brand_id,
            perfume_name,
            type,
            pyramid_note,
            top_notes,
            middle_notes,
            base_notes,
            olfactive_family
        } = req.body;

        const existingPerfume = await client.query(
            'SELECT perfume_id FROM "Perfumes" WHERE perfume_id = $1',
            [id]
        );

        if (existingPerfume.rows.length === 0) {
            return res.status(404).json({ error: 'Perfume not found' });
        }

        const result = await client.query(
            `UPDATE "Perfumes" 
       SET brand_id = $1, 
           perfume_name = $2, 
           type = $3, 
           pyramid_note = $4, 
           top_notes = $5, 
           middle_notes = $6, 
           base_notes = $7, 
           olfactive_family = $8
       WHERE perfume_id = $9
       RETURNING *`,
            [brand_id, perfume_name, type, pyramid_note, top_notes, middle_notes, base_notes, olfactive_family, id]
        );

        await client.query('COMMIT');
        res.json(result.rows[0]);
    } catch (error) {
        await client.query('ROLLBACK');
        if (error.constraint === 'unique_brand_perfume') {
            res.status(400).json({ error: 'This perfume already exists for this brand' });
        } else {
            next(error);
        }
    } finally {
        client.release();
    }
});

// DELETE - Delete perfume (requires auth)
router.delete('/:id', async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;

        await client.query('DELETE FROM "PerfumeFormulas" WHERE "perfume_id" = $1', [id]);
        await client.query('DELETE FROM "CreativeFormulasUsageInfo" WHERE perfume_id = $1', [id]);

        const result = await client.query(
            'DELETE FROM "Perfumes" WHERE perfume_id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Perfume not found' });
        }

        await client.query('COMMIT');
        res.json({ message: 'Perfume deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

export default router;
