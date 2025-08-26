const pool = require('../db');

const getAllBlogs = async () => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

const getBlogById = async (id) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const createBlog = async ({ title, content, authorId, categoryId }) => {
  const result = await pool.query(
    "INSERT INTO blogs (title, content, author_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, content, authorId, categoryId]
  );
  return result.rows[0];
};

const updateBlog = async (id, { title, content, categoryId }) => {
  const result = await pool.query(
    "UPDATE blogs SET title=$1, content=$2, category_id=$3, updated_at=CURRENT_TIMESTAMP WHERE id=$4 RETURNING *",
    [title, content, categoryId, id]
  );
  return result.rows[0];
};

const deleteBlog = async (id) => {
  const result = await pool.query("DELETE FROM blogs WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};

// Kategoriye göre blog'ları getirme
const getBlogsByCategory = async (categoryId) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.category_id = $1
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};

// Kullanıcıya göre blog'ları getirme
const getBlogsByAuthor = async (authorId) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.author_id = $1
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query, [authorId]);
  return result.rows;
};

// Blog arama
const searchBlogs = async (searchTerm) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.title ILIKE $1 OR b.content ILIKE $1
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query, [`%${searchTerm}%`]);
  return result.rows;
};

// View counter artırma
const incrementViewCount = async (blogId) => {
  const result = await pool.query(
    "UPDATE blogs SET view_count = view_count + 1 WHERE id = $1 RETURNING view_count",
    [blogId]
  );
  return result.rows[0]?.view_count || 0;
};

// En popüler blog'ları getirme (view count'a göre)
const getPopularBlogs = async (limit = 10) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.view_count DESC, b.created_at DESC
    LIMIT $1
  `;
  const result = await pool.query(query, [limit]);
  return result.rows;
};

module.exports = { 
  getAllBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  searchBlogs,
  incrementViewCount,
  getPopularBlogs
};
