import express, { json } from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://huseyinorer.github.io']
}))
app.use(json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

// Auth endpoints
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password }); // Debug için

    const result = await pool.query(
      'SELECT * FROM "Users" WHERE username = $1 AND password = $2',
      [username, password]
    );

    console.log('Query result:', result.rows); // Debug için
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    
    if (user.isAdmin === false) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json({ 
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin === true
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tüm parfümleri getir
app.get('/api/perfumes', async (req, res) => {
  try {
    const { limit = 10, page = 1, sortBy = 'brandName', sortOrder = 'asc', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, COUNT(pf.id) as "formulaCount"
      FROM "Parfumes" p
      LEFT JOIN "ParfumensFormules" pf ON p.id = pf."parfumesId"
      WHERE LOWER(p."brandName") LIKE $1 OR LOWER(p."name") LIKE $1
      GROUP BY p.id
      ORDER BY 
        CASE WHEN $4 = 'brandName' THEN p."brandName"
             WHEN $4 = 'name' THEN p."name"
        END ${sortOrder === 'asc' ? 'ASC' : 'DESC'}
      LIMIT $2 OFFSET $3
    `;

    const searchPattern = `%${search.toLowerCase()}%`;
    const result = await pool.query(query, [searchPattern, limit, offset, sortBy]);

    const countQuery = `
      SELECT COUNT(*) 
      FROM "Parfumes" 
      WHERE LOWER("brandName") LIKE $1 OR LOWER("name") LIKE $1
    `;
    const countResult = await pool.query(countQuery, [searchPattern]);

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Belirli bir parfüme ait formülleri getir
app.get('/api/perfumes/:id/formulas', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM "ParfumensFormules" WHERE "parfumesId" = $1 ORDER BY id DESC',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching formulas:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Formül isteği gönder
app.post('/api/formulas/request', async (req, res) => {
  try {
    const { parfumesId, fragrancePercentage, alcoholPercentage, waterPercentage, restDay } = req.body;
    const result = await pool.query(
      `INSERT INTO "FormulaPendingRequests" 
       ("parfumesId", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [parfumesId, fragrancePercentage, alcoholPercentage, waterPercentage, restDay]
    );
    res.status(201).json({ 
      message: 'Formül isteğiniz incelemeye gönderildi', 
      request: result.rows[0] 
    });
  } catch (error) {
    console.error('Error creating formula request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bekleyen formül isteklerini getir (Admin için)
app.get('/api/formulas/pending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT fr.*, p."brandName", p."name" as "parfumeName"
      FROM "FormulaPendingRequests" fr
      JOIN "Parfumes" p ON fr."parfumesId" = p.id
      WHERE fr.status = 'PENDING'
      ORDER BY fr."createdAt" DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Formül isteğini onayla
app.post('/api/formulas/approve/:id', async (req, res) => {
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
    
    // Formülü ekle
    await client.query(
      `INSERT INTO "ParfumensFormules" 
       ("parfumesId", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay")
       VALUES ($1, $2, $3, $4, $5)`,
      [formula.parfumesId, formula.fragrancePercentage, formula.alcoholPercentage, 
       formula.waterPercentage, formula.restDay]
    );

    // İsteği güncelle
    await client.query(
      'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
      ['APPROVED', id]
    );

    await client.query('COMMIT');
    res.json({ message: 'Formül onaylandı ve eklendi' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving formula request:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// Formül isteğini reddet
app.post('/api/formulas/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
      ['REJECTED', id]
    );
    res.json({ message: 'Formül isteği reddedildi' });
  } catch (error) {
    console.error('Error rejecting formula request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Formül sil
app.delete('/api/formulas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "ParfumensFormules" WHERE id = $1', [id]);
    res.status(200).json({ message: 'Formula deleted successfully' });
  } catch (error) {
    console.error('Error deleting formula:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});