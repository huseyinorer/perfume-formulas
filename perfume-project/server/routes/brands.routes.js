import express from 'express';

const router = express.Router();

// Get all brands
router.get('/', async (req, res, next) => {
    try {
        const pool = req.app.get('pool');
        const result = await pool.query('SELECT * FROM "Brands" ORDER BY brand_name');
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

export default router;
