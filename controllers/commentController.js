const pool = require("../db");

const getCommentsByBlogId = async (req, res) => {
  const { blogId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM comment WHERE blog_id=$1 ORDER BY created_at ASC",
      [blogId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Yorumlar getirilemedi" });
  }
};

const createComment = async (req, res) => {
  const { blogId } = req.params;
  const { content, user_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO comment (blog_id, content, user_name) VALUES ($1, $2, $3) RETURNING *",
      [blogId, content, user_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Yorum eklenemedi" });
  }
};


const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM comment WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Yorum bulunamadı" });
    }
    res.json({ message: "Yorum silindi", comment: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Yorum silinemedi" });
  }
};

module.exports = { getCommentsByBlogId, createComment, deleteComment };
