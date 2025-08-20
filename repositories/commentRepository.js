const pool = require('../db');

const getCommentsByBlogId = async (blogId) => {
  const result = await pool.query(
    "SELECT * FROM comment WHERE blog_id=$1 ORDER BY created_at ASC",
    [blogId]
  );
  return result.rows;
};

const createComment = async ({ blogId, content, user_name }) => {
  const result = await pool.query(
    "INSERT INTO comment (blog_id, content, user_name) VALUES ($1, $2, $3) RETURNING *",
    [blogId, content, user_name]
  );
  return result.rows[0];
};

const deleteComment = async (id) => {
  const result = await pool.query("DELETE FROM comment WHERE id=$1 RETURNING *", [id]);
  return result.rows[0];
};

module.exports = { getCommentsByBlogId, createComment, deleteComment };
