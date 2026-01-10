import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes.js';
import logoutRoute from './routes/logout.route.js';
import perfumesRoutes from './routes/perfumes.routes.js';
import formulasRoutes from './routes/formulas.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import ratingsRoutes from './routes/ratings.routes.js';
import brandsRoutes from './routes/brands.routes.js';
import stockRoutes from './routes/stock.routes.js';

// Import middleware
import { authenticateToken } from './middleware/auth.middleware.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimit.middleware.js';

const { Pool } = pkg;
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

// Database connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Make pool available to routes
app.set('pool', pool);

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://huseyinorer.github.io',
      'https://huseyinorer.github.io/perfume-formulas'
    ],
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check endpoint (before rate limiting for monitoring tools)
app.get('/health', async (req, res) => {
  try {
    // Optional: Check database connection
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
    });
  }
});

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', logoutRoute);
app.use('/api/perfumes', perfumesRoutes);
app.use('/api/formulas', formulasRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/formulas', ratingsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/perfume-stock', stockRoutes);
// Alias for backward compatibility
app.use('/api/perfume-maturation', stockRoutes);

// Protected routes example (if needed)
app.get('/api/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

export default app;
