const pool = require('../db');

const getAllBlogs = async (limit = 10, offset = 0) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    ORDER BY b.created_at DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

const getBlogsCount = async () => {
  const query = 'SELECT COUNT(*) as total FROM blogs';
  const result = await pool.query(query);
  return parseInt(result.rows[0].total);
};

const getBlogById = async (id) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
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
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.category_id = $1
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query, [categoryId]);
  return result.rows;
};

// Kategori adına göre blog'ları getirme
const getBlogsByCategoryName = async (categoryName) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
    FROM blogs b
    LEFT JOIN users u ON b.author_id = u.id
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE c.name = $1
    ORDER BY b.created_at DESC
  `;
  const result = await pool.query(query, [categoryName]);
  return result.rows;
};

// Kullanıcıya göre blog'ları getirme
const getBlogsByAuthor = async (authorId) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
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
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
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
const incrementViewCount = async (blogId, userId = null, ipAddress = null) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Blog'un yazarını kontrol et - yazar kendi blogunu görüntülediğinde view count artmasın
    const blogResult = await client.query(
      "SELECT author_id FROM blogs WHERE id = $1",
      [blogId]
    );
    
    if (!blogResult.rows[0]) {
      throw new Error('Blog bulunamadı');
    }
    
    const authorId = blogResult.rows[0].author_id;
    
    // Eğer kullanıcı blog'un yazarıysa view count artırma
    if (userId && userId === authorId) {
      const currentViewCount = await client.query(
        "SELECT view_count FROM blogs WHERE id = $1",
        [blogId]
      );
      await client.query('COMMIT');
      return currentViewCount.rows[0]?.view_count || 0;
    }
    
    // Kullanıcı daha önce bu blogu görüntülemiş mi kontrol et
    let alreadyViewed = false;
    
    if (userId) {
      // Giriş yapmış kullanıcı için user_id ile kontrol
      const userViewResult = await client.query(
        "SELECT id FROM blog_views WHERE blog_id = $1 AND user_id = $2",
        [blogId, userId]
      );
      alreadyViewed = userViewResult.rows.length > 0;
    } else if (ipAddress) {
      // Anonim kullanıcı için IP adresi ile kontrol (sadece user_id NULL olan kayıtlar)
      const ipViewResult = await client.query(
        "SELECT id FROM blog_views WHERE blog_id = $1 AND ip_address = $2 AND user_id IS NULL",
        [blogId, ipAddress]
      );
      alreadyViewed = ipViewResult.rows.length > 0;
    }
    
    // Eğer daha önce görüntülenmişse view count artırma
    if (alreadyViewed) {
      const currentViewCount = await client.query(
        "SELECT view_count FROM blogs WHERE id = $1",
        [blogId]
      );
      await client.query('COMMIT');
      return currentViewCount.rows[0]?.view_count || 0;
    }
    
    // View count'u artır
    const result = await client.query(
      "UPDATE blogs SET view_count = view_count + 1 WHERE id = $1 RETURNING view_count",
      [blogId]
    );
    
    // Blog view kaydını ekle
    await client.query(
      "INSERT INTO blog_views (blog_id, user_id, ip_address) VALUES ($1, $2, $3)",
      [blogId, userId, ipAddress]
    );
    
    await client.query('COMMIT');
    return result.rows[0]?.view_count || 0;
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// En popüler blog'ları getirme (view count'a göre)
const getPopularBlogs = async (limit = 10) => {
  const query = `
    SELECT b.*, u.username as author_name, c.name as category_name,
           b.like_count, b.dislike_count, b.bookmark_count
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
  getBlogsCount,
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogsByCategory,
  getBlogsByCategoryName,
  getBlogsByAuthor,
  searchBlogs,
  incrementViewCount,
  getPopularBlogs
};
