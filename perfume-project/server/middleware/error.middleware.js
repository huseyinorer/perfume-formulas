// Error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
    }

    // Database errors
    if (err.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Duplicate entry' });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ error: 'Referenced record not found' });
    }

    // Default error
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Not found handler
export const notFoundHandler = (req, res) => {
    res.status(404).json({ error: 'Route not found' });
};
