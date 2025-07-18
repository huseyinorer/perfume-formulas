import express, { json } from "express";
import cors from "cors";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://huseyinorer.github.io"],
  })
);
app.use(json());

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

// Auth endpoints
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Login endpoint'i güncellendi
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM "Users" WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // JWT token oluştur
    // Login endpoint'inde JWT token oluştururken
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error); // Detailed error log
    res.status(500).json({
      error: "Internal server error",
      details: error.message, // Development ortamında hata detaylarını görmek için
    });
  }
});

// Yeni kullanıcı kaydı endpoint'i
app.post("/api/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const { username, email, password } = req.body;

    // Input validasyonu
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Email format kontrolü
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Username ve email kullanımda mı kontrolü
    const existingUser = await client.query(
      'SELECT username, email FROM "Users" WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      const field =
        existingUser.rows[0].username === username ? "username" : "email";
      return res.status(400).json({ error: `This ${field} is already in use` });
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Begin transaction
    await client.query("BEGIN");

    // Yeni kullanıcı ekle
    const result = await client.query(
      `INSERT INTO "Users" (username, email, password, created_at, updated_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, username, email, created_at`,
      [username, email, hashedPassword]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        created_at: result.rows[0].created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// Şifre değiştirme endpoint'i güncellemesi
app.post("/api/change-password", async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Kullanıcıyı bul
    const user = await pool.query('SELECT * FROM "Users" WHERE id = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Eski şifreyi kontrol et
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.rows[0].password
    );

    if (!isOldPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Yeni şifreyi hashle
    const hashedNewPassword = await hashPassword(newPassword);

    // Şifreyi güncelle
    await pool.query(
      'UPDATE "Users" SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedNewPassword, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message, // Hata detayını görmek için
    });
  }
});

// Tüm parfümleri getir
app.get('/api/perfumes', async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sortBy = 'brand', 
      sortOrder = 'asc', 
      search = '' 
    } = req.query;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;
    const searchPattern = `%${search.toLowerCase()}%`;

    // Token'dan user_id'yi al (eğer varsa)
    let user_id = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decoded.id;
      } catch (err) {
        // Token geçersiz veya expire olmuş - sessizce devam et
      }
    }

    let query = `
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
      searchPattern,    // $1
      sortBy,          // $2
      limitNumber,     // $3
      offset,          // $4
      user_id || null  // $5
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
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Belirli bir parfüme ait formülleri getir (değerlendirme bilgileriyle birlikte)
app.get("/api/perfumes/:id/formulas", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Formülleri ve değerlendirme bilgilerini getir
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
    console.error("Error fetching formulas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Parfüm detaylarını getir
app.get("/api/perfumes/:id/details", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
     SELECT 
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
     WHERE p.perfume_id = $1
   `,
      [id]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("Error fetching perfume details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Formül ekle
app.post("/api/formulas", async (req, res) => {
  try {
    const {
      perfume_id,
      fragrancePercentage,
      alcoholPercentage,
      waterPercentage,
      restDay,
    } = req.body;

    if (!perfume_id) {
      return res.status(400).json({ error: "Parfüm seçilmedi" });
    }

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
    console.error("Error adding formula:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Formül isteği gönder
app.post("/api/formulas/request", async (req, res) => {
  try {
    const {
      perfume_id,
      fragrancePercentage,
      alcoholPercentage,
      waterPercentage,
      restDay,
      userId  // Yeni eklenen, opsiyonel
    } = req.body;

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
        userId || null  // userId yoksa null olacak
      ]
    );

    res.status(201).json({ 
      message: 'Formül isteğiniz incelemeye gönderildi', 
      request: result.rows[0] 
    });
  } catch (error) {
    console.error("Error creating formula request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Bekleyen formül isteklerini getir (Admin için)
app.get("/api/formulas/pending", async (req, res) => {
  try {
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
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Formül isteğini onayla
app.post("/api/formulas/approve/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { id } = req.params;
    const request = await client.query(
      'SELECT * FROM "FormulaPendingRequests" WHERE id = $1',
      [id]
    );

    if (request.rows.length === 0) {
      throw new Error("İstek bulunamadı");
    }

    const formula = request.rows[0];

    // Formülü ekle
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

    // İsteği güncelle
    await client.query(
      'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
      ["APPROVED", id]
    );

    await client.query("COMMIT");
    res.json({ message: "Formül onaylandı ve eklendi" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error approving formula request:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// Formül isteğini reddet
app.post("/api/formulas/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE "FormulaPendingRequests" SET status = $1 WHERE id = $2',
      ["REJECTED", id]
    );
    res.json({ message: "Formül isteği reddedildi" });
  } catch (error) {
    console.error("Error rejecting formula request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Formül sil
app.delete("/api/formulas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM "PerfumeFormulas" WHERE id = $1', [id]);
    res.status(200).json({ message: "Formula deleted successfully" });
  } catch (error) {
    console.error("Error deleting formula:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/perfumes/search", async (req, res) => {
  try {
    const { query } = req.query;

    const result = await pool.query(
      `
     SELECT 
       p.perfume_id as id,
       b.brand_name as brand,
       p.perfume_name as name
     FROM "Perfumes" p
     JOIN "Brands" b ON p.brand_id = b.brand_id
     WHERE 
       LOWER(b.brand_name) LIKE $1 OR 
       LOWER(p.perfume_name) LIKE $1
     ORDER BY b.brand_name, p.perfume_name
     LIMIT 10
   `,
      [`%${query.toLowerCase()}%`]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error searching perfumes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/admin/change-password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    // Mevcut şifreyi kontrol et
    const adminData = await fs.readFile("admin.json", "utf8");
    const admin = JSON.parse(adminData);

    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      admin.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(401).json({ message: "Mevcut şifre yanlış" });
    }

    // Yeni şifreyi hashle
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Yeni şifreyi kaydet
    admin.password = hashedNewPassword;
    await fs.writeFile("admin.json", JSON.stringify(admin, null, 2));

    res.json({ message: "Şifre başarıyla değiştirildi" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Şifre değiştirme işlemi başarısız" });
  }
});

// Token doğrulama middleware'i
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Burada da process.env.JWT_SECRET kullanıyoruz
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Korumalı rotalar için middleware kullan
app.get("/api/protected-route", authenticateToken, (req, res) => {
  // Sadece giriş yapmış kullanıcılar erişebilir
});

app.get("/api/admin-route", authenticateToken, (req, res) => {
  // Sadece admin kullanıcılar erişebilir
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  // Admin işlemleri
});

// Perfumes CRUD endpoints

// CREATE - Yeni parfüm ekle
app.post("/api/perfumes", authenticateToken, async (req, res) => {
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

    // Input validasyonu
    if (!brand_id || !perfume_name) {
      return res.status(400).json({ error: "Brand and perfume name are required" });
    }

    // Brand'in var olup olmadığını kontrol et
    const brandCheck = await client.query(
      'SELECT brand_id FROM "Brands" WHERE brand_id = $1',
      [brand_id]
    );

    if (brandCheck.rows.length === 0) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Parfümü ekle
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
      res.status(400).json({ error: "This perfume already exists for this brand" });
    } else {
      console.error("Error creating perfume:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } finally {
    client.release();
  }
});

// READ - Tek bir parfümü getir
app.get("/api/perfumes/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
      return res.status(404).json({ error: "Perfume not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching perfume:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE - Parfüm güncelle
app.put("/api/perfumes/:id", authenticateToken, async (req, res) => {
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

    // Parfümün var olup olmadığını kontrol et
    const existingPerfume = await client.query(
      'SELECT perfume_id FROM "Perfumes" WHERE perfume_id = $1',
      [id]
    );

    if (existingPerfume.rows.length === 0) {
      return res.status(404).json({ error: "Perfume not found" });
    }

    // Parfümü güncelle
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
      res.status(400).json({ error: "This perfume already exists for this brand" });
    } else {
      console.error("Error updating perfume:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } finally {
    client.release();
  }
});

// DELETE - Parfüm sil
app.delete("/api/perfumes/:id", authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { id } = req.params;

    // İlişkili formülleri ve usage info'yu kontrol et ve sil
    await client.query('DELETE FROM "PerfumeFormulas" WHERE "perfume_id" = $1', [id]);
    await client.query('DELETE FROM "CreativeFormulasUsageInfo" WHERE perfume_id = $1', [id]);
    
    // Parfümü sil
    const result = await client.query(
      'DELETE FROM "Perfumes" WHERE perfume_id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Perfume not found" });
    }

    await client.query('COMMIT');
    
    res.json({ message: "Perfume deleted successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error deleting perfume:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// Brands endpoint'i - authentication olmadan erişilebilir
app.get('/api/brands', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "Brands" ORDER BY brand_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Favori ekleme/çıkarma
app.post('/api/favorites/toggle', authenticateToken, async (req, res) => {
  try {
    const { perfume_id } = req.body;
    const user_id = req.user.id;

    // Önce favori var mı kontrol et
    const checkResult = await pool.query(
      'SELECT id FROM "Favorites" WHERE user_id = $1 AND perfume_id = $2',
      [user_id, perfume_id]
    );

    if (checkResult.rows.length > 0) {
      // Favori varsa kaldır
      await pool.query(
        'DELETE FROM "Favorites" WHERE user_id = $1 AND perfume_id = $2',
        [user_id, perfume_id]
      );
      res.json({ message: 'Favorilerden kaldırıldı', isFavorite: false });
    } else {
      // Favori yoksa ekle
      await pool.query(
        'INSERT INTO "Favorites" (user_id, perfume_id) VALUES ($1, $2)',
        [user_id, perfume_id]
      );
      res.json({ message: 'Favorilere eklendi', isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Favori listesi getirme
app.get('/api/favorites', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt((page - 1) * limit);

    // Toplam kayıt sayısı
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM "Favorites" WHERE user_id = $1',
      [user_id]
    );

    // Favori parfümleri getir
    const result = await pool.query(`
      SELECT 
        p.perfume_id as id,
        b.brand_id,
        b.brand_name as brand,
        p.perfume_name as name,
        p.type,
        p.olfactive_family,
        f.created_at as favorited_at,
        true as is_favorite
      FROM "Favorites" f
      JOIN "Perfumes" p ON f.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      WHERE f.user_id = $1
      ORDER BY f.created_at DESC
      LIMIT $2 OFFSET $3
    `, [user_id, limit, offset]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: result.rows,
      total,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bir formüle ait değerlendirmeleri getir
app.get('/api/formulas/:id/ratings', async (req, res) => {
  try {
    const { id } = req.params;
    
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
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching formula ratings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bir formüle yeni değerlendirme ekle (sadece giriş yapmış kullanıcılar)
app.post('/api/formulas/:id/ratings', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;
    
    // Rating aralığını kontrol et
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Değerlendirme puanı 1 ile 5 arasında olmalıdır.' });
    }
    
    // Formülün var olup olmadığını kontrol et
    const formulaCheck = await pool.query(
      'SELECT id FROM "PerfumeFormulas" WHERE id = $1',
      [id]
    );
    
    if (formulaCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Formül bulunamadı.' });
    }
    
    // Kullanıcının daha önce bu formülü değerlendirip değerlendirmediğini kontrol et
    const existingRating = await pool.query(
      'SELECT id FROM "FormulaRatings" WHERE formula_id = $1 AND user_id = $2',
      [id, user_id]
    );
    
    let result;
    if (existingRating.rows.length > 0) {
      // Mevcut değerlendirmeyi güncelle
      result = await pool.query(
        `UPDATE "FormulaRatings" 
         SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
         WHERE formula_id = $3 AND user_id = $4
         RETURNING *`,
        [rating, comment, id, user_id]
      );
      
      res.json({ 
        message: 'Değerlendirmeniz güncellendi.', 
        rating: result.rows[0] 
      });
    } else {
      // Yeni değerlendirme ekle
      result = await pool.query(
        `INSERT INTO "FormulaRatings" (formula_id, user_id, rating, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [id, user_id, rating, comment]
      );
      
      res.status(201).json({ 
        message: 'Değerlendirmeniz kaydedildi.', 
        rating: result.rows[0] 
      });
    }
  } catch (error) {
    console.error('Error adding formula rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bir değerlendirmeyi güncelle (sadece sahibi veya admin)
app.put('/api/formulas/ratings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const user_id = req.user.id;
    
    // Değerlendirmenin var olup olmadığını kontrol et
    const ratingCheck = await pool.query(
      'SELECT formula_id, user_id FROM "FormulaRatings" WHERE id = $1',
      [id]
    );
    
    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Değerlendirme bulunamadı.' });
    }
    
    // Değerlendirmenin sahibini veya admin olup olmadığını kontrol et
    const isOwner = ratingCheck.rows[0].user_id === user_id;
    const isAdmin = req.user.isAdmin === true;
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
    }
    
    // Rating puanı güncelleniyor mu kontrol et
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Değerlendirme puanı 1 ile 5 arasında olmalıdır.' });
    }
    
    // Güncelleme sorgusunu oluştur
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
    
    // Değerlendirmeyi güncelle
    const result = await pool.query(updateQuery, queryParams);
    
    res.json({ 
      message: 'Değerlendirme güncellendi.', 
      rating: result.rows[0] 
    });
  } catch (error) {
    console.error('Error updating formula rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bir değerlendirmeyi sil (sadece sahibi veya admin)
app.delete('/api/formulas/ratings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    // Değerlendirmenin var olup olmadığını kontrol et
    const ratingCheck = await pool.query(
      'SELECT formula_id, user_id FROM "FormulaRatings" WHERE id = $1',
      [id]
    );
    
    if (ratingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Değerlendirme bulunamadı.' });
    }
    
    // Değerlendirmenin sahibini veya admin olup olmadığını kontrol et
    const isOwner = ratingCheck.rows[0].user_id === user_id;
    const isAdmin = req.user.isAdmin === true;
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok.' });
    }
    
    // Değerlendirmeyi sil
    await pool.query('DELETE FROM "FormulaRatings" WHERE id = $1', [id]);
    
    res.json({ message: 'Değerlendirme silindi.' });
  } catch (error) {
    console.error('Error deleting formula rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kullanıcının bir formül için daha önce yaptığı değerlendirmeyi getir
app.get('/api/formulas/:id/user-rating', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    
    const result = await pool.query(
      'SELECT * FROM "FormulaRatings" WHERE formula_id = $1 AND user_id = $2',
      [id, user_id]
    );
    
    if (result.rows.length === 0) {
      res.json(null);
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Parfüm stok

// BONUS: POST /api/perfume-stock - Yeni stok kaydı ekle
app.post('/api/perfume-stock', async (req, res) => {
  try {
    const { perfume_id, price, stock_quantity, category } = req.body;
    
    // Input validasyonu
    if (!perfume_id || !price || stock_quantity === undefined) {
      return res.status(400).json({ 
        error: 'perfume_id, price ve stock_quantity gerekli alanlar' 
      });
    }
    
    // Parfümün var olup olmadığını kontrol et
    const perfumeCheck = await pool.query(
      'SELECT perfume_id FROM "Perfumes" WHERE perfume_id = $1',
      [perfume_id]
    );
    
    if (perfumeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parfüm bulunamadı' });
    }
    
    const result = await pool.query(
      `INSERT INTO "PerfumeStock" (perfume_id, price, stock_quantity, category)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [perfume_id, price, stock_quantity, category]
    );
    
    res.status(201).json({
      message: 'Stok kaydı oluşturuldu',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating perfume stock:', err);
    res.status(500).json({ error: 'Stok kaydı oluşturulamadı', detail: err.message });
  }
});

// GET /api/perfume-stock - Parfüm stok listesi (Pagination + Search)
app.get('/api/perfume-stock', authenticateToken, async (req, res) => {
  try {
    const { 
      limit = 10, 
      page = 1, 
      sortBy = 'name', 
      sortOrder = 'asc', 
      search = '' 
    } = req.query;
    
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;
    const searchPattern = `%${search.toLowerCase()}%`;

    // Ana sorgu
    let query = `
      SELECT 
        s.id,
        (b.brand_name || ' - ' || p.perfume_name) AS name,
        translate_text(p.top_notes) AS top_notes,
        translate_text(p.middle_notes) AS middle_notes,
        translate_text(p.base_notes) AS base_notes,
        s.price,
        s.stock_quantity,
        s.category,
        COALESCE(SUM(m.quantity), 0) AS maturing_quantity,
        COALESCE(
          STRING_AGG(
            m.quantity || ' Adet Demlenen, Ürt. Tar: ' || TO_CHAR(m.maturation_start_date, 'DD.MM.YYYY'),
            ' / ' 
            ORDER BY m.maturation_start_date ASC
          ),
          ''
        ) AS maturing_info,
        p.perfume_id
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      LEFT JOIN "PerfumeMaturation" m ON s.perfume_id = m.perfume_id
      WHERE 
        LOWER(b.brand_name) LIKE $1 
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
      GROUP BY 
        s.id, 
        b.brand_name, 
        p.perfume_name, 
        p.top_notes, 
        p.middle_notes, 
        p.base_notes, 
        s.price, 
        s.stock_quantity, 
        s.category, 
        p.perfume_id
      ORDER BY 
        CASE WHEN LOWER(b.brand_name) LIKE $1 THEN 0 ELSE 1 END,
        CASE 
          WHEN $2 = 'name' THEN (b.brand_name || ' - ' || p.perfume_name)
          WHEN $2 = 'price' THEN s.price::text
          WHEN $2 = 'stock_quantity' THEN s.stock_quantity::text
          WHEN $2 = 'maturing_quantity' THEN COALESCE(SUM(m.quantity), 0)::text
          WHEN $2 = 'category' THEN s.category
          ELSE (b.brand_name || ' - ' || p.perfume_name)
        END ${sortOrder},
        s.id DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, [
      searchPattern,    // $1
      sortBy,          // $2
      limitNumber,     // $3
      offset           // $4
    ]);

    // Toplam kayıt sayısı için ayrı sorgu
    const countQuery = `
      SELECT COUNT(DISTINCT s.id)
      FROM "PerfumeStock" s
      JOIN "Perfumes" p ON s.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      WHERE 
        LOWER(b.brand_name) LIKE $1 
        OR LOWER(p.perfume_name) LIKE $1
        OR LOWER(s.category) LIKE $1
    `;
    
    const countResult = await pool.query(countQuery, [searchPattern]);

    res.json({
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: pageNumber,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limitNumber),
      limit: limitNumber
    });
  } catch (err) {
    console.error('Error fetching perfume stock:', err);
    res.status(500).json({ error: 'Veri alınamadı', detail: err.message });
  }
});

// PUT /api/perfume-stock/:id - Stok miktarını güncelle
app.put('/api/perfume-stock/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;
  
  // Input validasyonu
  if (typeof stock_quantity !== 'number' || stock_quantity < 0) {
    return res.status(400).json({ error: 'stock_quantity pozitif bir sayı olmalı' });
  }
  
  try {
    const result = await pool.query(
      `UPDATE "PerfumeStock" SET stock_quantity = $1 WHERE id = $2 RETURNING *`,
      [stock_quantity, id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kayıt bulunamadı' });
    }
    
    res.json({ 
      message: 'Stok miktarı güncellendi',
      data: result.rows[0] 
    });
  } catch (err) {
    console.error('Error updating stock quantity:', err);
    res.status(500).json({ error: 'Güncelleme başarısız', detail: err.message });
  }
});

// PerfumeMaturation endpoints

// POST /api/perfume-maturation - Yeni demlenme kaydı oluştur
app.post('/api/perfume-maturation', authenticateToken, async (req, res) => {
  try {
    const { perfume_id, maturation_start_date, quantity, notes } = req.body;

    // Parfümün var olup olmadığını kontrol et
    const perfumeCheck = await pool.query(
      'SELECT * FROM "Perfumes" WHERE perfume_id = $1',
      [perfume_id]
    );

    if (perfumeCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Parfüm bulunamadı' });
    }
    
    // Demlenme kaydı oluştur
    const result = await pool.query(
      `INSERT INTO "PerfumeMaturation" (perfume_id, maturation_start_date, quantity, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [
        perfume_id, 
        maturation_start_date || new Date().toISOString().split('T')[0], // Default bugün
        quantity, 
        notes
      ]
    );
    
    res.status(201).json({
      message: 'Demlenme kaydı oluşturuldu',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating maturation record:', err);
    res.status(500).json({ error: 'Demlenme kaydı oluşturulamadı', detail: err.message });
  }
});

// PUT /api/perfume-maturation/:id/complete - Demlenme tamamla ve stoğa taşı
app.put('/api/perfume-maturation/:id/complete', authenticateToken, async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    
    // Demlenme kaydını getir
    const maturationResult = await client.query(
      'SELECT * FROM "PerfumeMaturation" WHERE id = $1',
      [id]
    );
    
    if (maturationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Demlenme kaydı bulunamadı' });
    }
    
    const maturationRecord = maturationResult.rows[0];
    const { perfume_id, quantity } = maturationRecord;
    
    // Stok tablosunda bu parfümün kaydını kontrol et
    const stockResult = await client.query(
      'SELECT * FROM "PerfumeStock" WHERE perfume_id = $1',
      [perfume_id]
    );
    
    if (stockResult.rows.length === 0) {
      // Stokta kayıt yoksa hata ver (önce stok kaydı oluşturulmalı)
      return res.status(400).json({ 
        error: 'Bu parfüm için stok kaydı bulunamadı. Önce stok kaydı oluşturulmalı.' 
      });
    }
    
    // Stok miktarını artır
    const currentStock = stockResult.rows[0].stock_quantity;
    const newStockQuantity = currentStock + quantity;
    
    await client.query(
      'UPDATE "PerfumeStock" SET stock_quantity = $1 WHERE perfume_id = $2',
      [newStockQuantity, perfume_id]
    );
    
    // Demlenme kaydını sil
    await client.query(
      'DELETE FROM "PerfumeMaturation" WHERE id = $1',
      [id]
    );
    
    await client.query('COMMIT');
    
    res.json({
      message: 'Demlenme tamamlandı ve stok güncellendi',
      data: {
        completed_maturation: maturationRecord,
        previous_stock: currentStock,
        new_stock: newStockQuantity,
        added_quantity: quantity
      }
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error completing maturation:', err);
    res.status(500).json({ 
      error: 'Demlenme tamamlama işlemi başarısız', 
      detail: err.message 
    });
  } finally {
    client.release();
  }
});

app.get('/api/perfume-maturation', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.perfume_id,
        (b.brand_name || ' ' || p.perfume_name) AS perfume_name,
        m.maturation_start_date,
        m.quantity,
        m.notes,
        m.created_at,
        CURRENT_DATE - m.maturation_start_date AS days_maturing
      FROM "PerfumeMaturation" m
      JOIN "Perfumes" p ON m.perfume_id = p.perfume_id
      JOIN "Brands" b ON p.brand_id = b.brand_id
      ORDER BY m.maturation_start_date ASC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching maturation records:', err);
    res.status(500).json({ error: 'Demlenme kayıtları alınamadı', detail: err.message });
  }
});

app.get('/api/perfume-maturation/by-perfume-id/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT id, perfume_id, maturation_start_date, quantity, notes FROM "PerfumeMaturation" WHERE perfume_id = $1',
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching maturation records:', err);
    res.status(500).json({ error: 'Demlenme kayıtları alınamadı', detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
