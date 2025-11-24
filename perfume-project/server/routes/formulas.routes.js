import express from 'express';
import { validateFormula } from '../validators/formula.validator.js';
import { formulaSubmitLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Add formula (admin only)
router.post('/', formulaSubmitLimiter, validateFormula, async (req, res, next) => {
    try {
        const {
            perfume_id,
            fragrancePercentage,
            alcoholPercentage,
            waterPercentage,
            restDay,
        } = req.validatedData;

        const pool = req.app.get('pool');
        const result = await pool.query(
            `INSERT INTO "PerfumeFormulas" 
      ("perfume_id", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay", "created_at")
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *`,
            [
                perfume_id,
                fragrancePercentage,
                alcoholPercentage,
                waterPercentage,
                restDay,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Request formula (user)
router.post('/request', formulaSubmitLimiter, validateFormula, async (req, res, next) => {
    try {
        const {
            perfume_id,
            fragrancePercentage,
            alcoholPercentage,
            waterPercentage,
            restDay,
            userId
        } = req.validatedData;

        const pool = req.app.get('pool');
        const result = await pool.query(
            `INSERT INTO "FormulaPendingRequests" 
       ("perfume_id", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay", "user_id")
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
            [
                perfume_id,
                fragrancePercentage,
                alcoholPercentage,
                waterPercentage,
                restDay,
                userId || null
            ]
        );

        res.status(201).json({
            message: 'Formül isteğiniz incelemeye gönderildi',
            request: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Get pending requests (admin only)
router.get('/pending', async (req, res, next) => {
    try {
        const pool = req.app.get('pool');
        const result = await pool.query(`
     SELECT 
       fr.*,
       b.brand_name as brand,
       p.perfume_name as "perfumeName"
     FROM "FormulaPendingRequests" fr
     JOIN "Perfumes" p ON fr.perfume_id = p.perfume_id
     JOIN "Brands" b ON p.brand_id = b.brand_id
     WHERE fr.status = 'PENDING'
     ORDER BY fr."created_at" DESC
   `);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Approve formula request (admin only)
router.post('/approve/:id', async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { id } = req.params;
        const request = await client.query(
            'SELECT * FROM "FormulaPendingRequests" WHERE id = $1',
            [id]
        );

        if (request.rows.length === 0) {
            throw new Error('İstek bulunamadı');
        }

        const formula = request.rows[0];

        await client.query(
            `INSERT INTO "PerfumeFormulas" 
      ("perfume_id", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay", "created_at")
      VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                formula.perfume_id,
                formula.fragrancePercentage,
                formula.alcoholPercentage,
                formula.waterPercentage,
                formula.restDay,
                formula.created_at
            ]
        );

        await client.query(
            'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
            ['APPROVED', id]
        );

        await client.query('COMMIT');
        res.json({ message: 'Formül onaylandı ve eklendi' });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

// Reject formula request (admin only)
router.post('/reject/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = req.app.get('pool');

        await pool.query(
            'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
            ['REJECTED', id]
        );
        res.json({ message: 'Formül isteği reddedildi' });
    } catch (error) {
        next(error);
    }
});

// Delete formula (admin only)
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = req.app.get('pool');

        await pool.query('DELETE FROM "PerfumeFormulas" WHERE id = $1', [id]);
        res.status(200).json({ message: 'Formula deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
