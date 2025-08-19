const pool = require("../db");

// Tüm blogları getir
const getAllBlogs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM blog ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Bloglar getirilemedi" });
  }
};

// Tek blogu id ile getir
const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM blog WHERE id=$1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog bulunamadı" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blog getirilemedi" });
  }
};

// Yeni blog ekle
const createBlog = async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO blog (title, content, author) VALUES ($1, $2, $3) RETURNING *",
      [title, content, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blog eklenemedi" });
  }
};

// Blog güncelle
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  try {
    const result = await pool.query(
      "UPDATE blog SET title=$1, content=$2, author=$3 WHERE id=$4 RETURNING *",
      [title, content, author, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog bulunamadı" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blog güncellenemedi" });
  }
};

// Blog sil
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM blog WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Blog bulunamadı" });
    }
    res.json({ message: "Blog silindi", blog: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Blog silinemedi" });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
