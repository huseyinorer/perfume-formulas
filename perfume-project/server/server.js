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
    const { limit = 10, page = 1, sortBy = 'brand', sortOrder = 'asc', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT cf.*, COUNT(pf.id) as "formulaCount"
      FROM "CreativeFormulas" cf
      LEFT JOIN "ParfumensFormules" pf ON cf.id = pf."parfumesId"
      WHERE LOWER(cf."brand") LIKE $1 OR LOWER(cf."name") LIKE $1
      GROUP BY cf.id
      ORDER BY 
        COUNT(pf.id) DESC,  -- Önce formül sayısına göre azalan sırada
        cf."brand" ASC,     -- Sonra marka adına göre alfabetik
        cf."name" ASC       -- Son olarak parfüm adına göre alfabetik
      LIMIT $2 OFFSET $3
    `;

    const searchPattern = `%${search.toLowerCase()}%`;
    const result = await pool.query(query, [searchPattern, limit, offset]);

    const countQuery = `
      SELECT COUNT(*) 
      FROM "CreativeFormulas" 
      WHERE LOWER("brand") LIKE $1 OR LOWER("name") LIKE $1
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
});

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

// Parfüm detaylarını getir
app.get('/api/perfumes/:id/details', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT *
      FROM "CreativeFormulas"
      WHERE id = $1
    `, [id]);
    
    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Error fetching perfume details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Formül ekle
app.post('/api/formulas', async (req, res) => {
  try {
    const { parfumesId, fragrancePercentage, alcoholPercentage, waterPercentage, restDay } = req.body;

    if (!parfumesId) {
      return res.status(400).json({ error: 'Parfüm seçilmedi' });
    }

    const result = await pool.query(
      `INSERT INTO "ParfumensFormules" ("parfumesId", "fragrancePercentage", "alcoholPercentage", "waterPercentage", "restDay")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [parfumesId, fragrancePercentage, alcoholPercentage, waterPercentage, restDay]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding formula:', error);
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
      SELECT fr.*, cf.brand, cf.name as "parfumeName"
      FROM "FormulaPendingRequests" fr
      JOIN "CreativeFormulas" cf ON fr."parfumesId" = cf.id
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

app.get('/api/perfumes/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    const result = await pool.query(`
      SELECT id, brand, name
      FROM "CreativeFormulas"
      WHERE 
        LOWER(brand) LIKE $1 OR 
        LOWER(name) LIKE $1
      ORDER BY brand, name
      LIMIT 10
    `, [`%${query.toLowerCase()}%`]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error searching perfumes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});