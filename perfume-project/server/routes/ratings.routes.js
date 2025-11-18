import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Get ratings for a formula
router.get('/:formulaId/ratings', async (req, res, next) => {
    try {
        const { formulaId } = req.params;
        const pool = req.app.get('pool');

        const result = await pool.query(`
      SELECT 
        fr.id, 
        fr.formula_id,
        fr.rating, 
        fr.comment, 
        fr.created_at, 
        fr.updated_at,
        fr.user_id,
        u.username
      FROM "FormulaRatings" fr
      JOIN "Users" u ON fr.user_id = u.id
      WHERE fr.formula_id = $1
      ORDER BY fr.created_at DESC
    `, [formulaId]);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Add or update rating for a formula (requires auth)
router.post('/:formulaId/ratings', authenticateToken, async (req, res, next) => {
    try {
        const { formulaId } = req.params;
        const { rating, comment } = req.body;
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Değerlendirme puanı 1 ile 5 arasında olmalıdır.' });
        }

        const formulaCheck = await pool.query(
            'SELECT id FROM "PerfumeFormulas" WHERE id = $1',
            [formulaId]
        );

        if (formulaCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Formül bulunamadı.' });
        }

        const existingRating = await pool.query(
            'SELECT id FROM "FormulaRatings" WHERE formula_id = $1 AND user_id = $2',
            [formulaId, user_id]
        );

        let result;
        if (existingRating.rows.length > 0) {
            result = await pool.query(
                `UPDATE "FormulaRatings" 
         SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
         WHERE formula_id = $3 AND user_id = $4
         RETURNING *`,
                [rating, comment, formulaId, user_id]
            );

            res.json({
                message: 'Değerlendirmeniz güncellendi.',
                rating: result.rows[0]
            });
        } else {
            result = await pool.query(
                `INSERT INTO "FormulaRatings" (formula_id, user_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
                [formulaId, user_id, rating, comment]
            );

            res.status(201).json({
                message: 'Değerlendirmeniz kaydedildi.',
                rating: result.rows[0]
            });
        }
    } catch (error) {
        next(error);
    }
});

// Get user's rating for a formula (requires auth)
router.get('/:formulaId/user-rating', authenticateToken, async (req, res, next) => {
    try {
        const { formulaId } = req.params;
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        const result = await pool.query(
            'SELECT * FROM "FormulaRatings" WHERE formula_id = $1 AND user_id = $2',
            [formulaId, user_id]
        );

        res.json(result.rows.length === 0 ? null : result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Update rating (requires auth - owner or admin)
router.put('/ratings/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { comment, rating } = req.body;
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        const ratingCheck = await pool.query(
            'SELECT formula_id, user_id FROM "FormulaRatings" WHERE id = $1',
            [id]
        );

        if (ratingCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Değerlendirme bulunamadı.' });
        }

        const isOwner = ratingCheck.rows[0].user_id === user_id;
        const isAdmin = req.user.isAdmin === true;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
        }

        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: 'Değerlendirme puanı 1 ile 5 arasında olmalıdır.' });
        }

        let updateQuery = 'UPDATE "FormulaRatings" SET updated_at = CURRENT_TIMESTAMP';
        const queryParams = [];
        let paramIndex = 1;

        if (comment !== undefined) {
            updateQuery += `, comment = $${paramIndex}`;
            queryParams.push(comment);
            paramIndex++;
        }

        if (rating !== undefined) {
            updateQuery += `, rating = $${paramIndex}`;
            queryParams.push(rating);
            paramIndex++;
        }

        updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
        queryParams.push(id);

        const result = await pool.query(updateQuery, queryParams);

        res.json({
            message: 'Değerlendirme güncellendi.',
            rating: result.rows[0]
        });
    } catch (error) {
        next(error);
    }
});

// Delete rating (requires auth - owner or admin)
router.delete('/ratings/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        const ratingCheck = await pool.query(
            'SELECT formula_id, user_id FROM "FormulaRatings" WHERE id = $1',
            [id]
        );

        if (ratingCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Değerlendirme bulunamadı.' });
        }

        const isOwner = ratingCheck.rows[0].user_id === user_id;
        const isAdmin = req.user.isAdmin === true;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
        }

        await pool.query('DELETE FROM "FormulaRatings" WHERE id = $1', [id]);

        res.json({ message: 'Değerlendirme silindi.' });
    } catch (error) {
        next(error);
    }
});

export default router;
