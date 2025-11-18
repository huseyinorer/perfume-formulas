import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Toggle favorite (requires auth)
router.post('/toggle', authenticateToken, async (req, res, next) => {
    try {
        const { perfume_id } = req.body;
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        // Check if already favorited
        const existing = await pool.query(
            'SELECT id FROM "Favorites" WHERE user_id = $1 AND perfume_id = $2',
            [user_id, perfume_id]
        );

        if (existing.rows.length > 0) {
            // Remove from favorites
            await pool.query(
                'DELETE FROM "Favorites" WHERE user_id = $1 AND perfume_id = $2',
                [user_id, perfume_id]
            );
            res.json({ message: 'Removed from favorites', is_favorite: false });
        } else {
            // Add to favorites
            await pool.query(
                'INSERT INTO "Favorites" (user_id, perfume_id, created_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
                [user_id, perfume_id]
            );
            res.json({ message: 'Added to favorites', is_favorite: true });
        }
    } catch (error) {
        next(error);
    }
});

// Get user favorites (requires auth)
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const pool = req.app.get('pool');

        const result = await pool.query(
            `SELECT 
        p.perfume_id as id,
        b.brand_name as brand,
        p.perfume_name as name,
        p.type,
        COUNT(pf.id) as "formulaCount",
        f.created_at as "favoritedAt"
      FROM "Favorites" f
      JOIN "Perfumes" p ON f.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "PerfumeFormulas" pf ON p.perfume_id = pf.perfume_id
      WHERE f.user_id = $1
      GROUP BY p.perfume_id, b.brand_name, p.perfume_name, p.type, f.created_at
      ORDER BY f.created_at DESC`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

export default router;
