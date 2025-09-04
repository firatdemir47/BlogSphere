const pool = require('../db');

const getCommentsByBlogId = async (blogId) => {
  const query = `
    SELECT c.*, u.username as author_name
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.blog_id = $1 
    ORDER BY c.created_at ASC
  `;
  const result = await pool.query(query, [blogId]);
  return result.rows;
};

const createComment = async ({ blogId, content, authorId }) => {
  // Önce yorumu ekle
  const insertResult = await pool.query(
    "INSERT INTO comments (blog_id, content, author_id) VALUES ($1, $2, $3) RETURNING *",
    [blogId, content, authorId]
  );
  
  // Sonra yazar bilgisiyle birlikte getir
  const query = `
    SELECT c.*, u.username as author_name
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.id = $1
  `;
  const result = await pool.query(query, [insertResult.rows[0].id]);
  return result.rows[0];
};

const deleteComment = async (id) => {
  const result = await pool.query("DELETE FROM comments WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};

// Kullanıcının yorumlarını getirme
const getCommentsByAuthor = async (authorId) => {
  const query = `
    SELECT c.*, b.title as blog_title
    FROM comments c
    LEFT JOIN blogs b ON c.blog_id = b.id
    WHERE c.author_id = $1
    ORDER BY c.created_at DESC
  `;
  const result = await pool.query(query, [authorId]);
  return result.rows;
};

// ID ile yorum bulma
const getCommentById = async (id) => {
  const query = 'SELECT * FROM comments WHERE id = $1';
  
  try {
    const result = await pool.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Yorum güncelleme
const updateComment = async (id, { content }) => {
  const result = await pool.query(
    "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
    [content, id]
  );
  return result.rows[0];
};

module.exports = { 
  getCommentsByBlogId, 
  createComment, 
  deleteComment,
  getCommentsByAuthor,
  updateComment,
  getCommentById
};
