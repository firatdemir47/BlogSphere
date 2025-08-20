const pool = require('../db');

const getAllBlogs = async () => {
  const result = await pool.query("SELECT * FROM blog ORDER BY created_at DESC");
  return result.rows;
};

const getBlogById = async (id) => {
  const result = await pool.query("SELECT * FROM blog WHERE id=$1", [id]);
  return result.rows[0];
};

const createBlog = async ({ title, content, author }) => {
  const result = await pool.query(
    "INSERT INTO blog (title, content, author) VALUES ($1, $2, $3) RETURNING *",
    [title, content, author]
  );
  return result.rows[0];
};

const updateBlog = async (id, { title, content, author }) => {
  const result = await pool.query(
    "UPDATE blog SET title=$1, content=$2, author=$3 WHERE id=$4 RETURNING *",
    [title, content, author, id]
  );
  return result.rows[0];
};

const deleteBlog = async (id) => {
  const result = await pool.query("DELETE FROM blog WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
