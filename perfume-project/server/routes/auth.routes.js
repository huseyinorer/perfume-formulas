import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateLogin, validateRegister, validateChangePassword } from '../validators/auth.validator.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';

const router = express.Router();

// Hash password helper
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

// Login
router.post('/login', authLimiter, validateLogin, async (req, res, next) => {
    try {
        const { username, password } = req.validatedData;
        const pool = req.app.get('pool');

        const result = await pool.query(
            'SELECT * FROM "Users" WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                isAdmin: user.is_admin,
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Set httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            token, // Still send token for backward compatibility
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.is_admin,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Register
router.post('/register', authLimiter, validateRegister, async (req, res, next) => {
    const pool = req.app.get('pool');
    const client = await pool.connect();

    try {
        const { username, email, password } = req.validatedData;

        const existingUser = await client.query(
            'SELECT username, email FROM "Users" WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            const field = existingUser.rows[0].username === username ? 'username' : 'email';
            return res.status(400).json({ error: `This ${field} is already in use` });
        }

        const hashedPassword = await hashPassword(password);

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO "Users" (username, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, email, created_at`,
            [username, email, hashedPassword]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: result.rows[0].id,
                username: result.rows[0].username,
                email: result.rows[0].email,
                created_at: result.rows[0].created_at,
            },
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
});

// Change password
router.post('/change-password', validateChangePassword, async (req, res, next) => {
    try {
        const { userId, oldPassword, newPassword } = req.validatedData;
        const pool = req.app.get('pool');

        const user = await pool.query('SELECT * FROM "Users" WHERE id = $1', [userId]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.rows[0].password);

        if (!isOldPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        const hashedNewPassword = await hashPassword(newPassword);

        await pool.query(
            'UPDATE "Users" SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedNewPassword, userId]
        );

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
