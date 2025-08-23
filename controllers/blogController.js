const blogService = require('../services/blogService');

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.listAllBlogs();
    res.json({
      success: true,
      data: blogs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlog(req.params.id);
    res.json({
      success: true,
      data: blog
    });
  } catch (err) {
    res.status(404).json({ 
      success: false,
      error: err.message 
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const authorId = req.user.userId; // JWT middleware'den gelir

    const blog = await blogService.addBlog({
      title,
      content,
      authorId,
      categoryId
    });

    res.status(201).json({
      success: true,
      message: 'Blog başarıyla oluşturuldu',
      data: blog
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    const blogId = req.params.id;
    const authorId = req.user.userId;

    const blog = await blogService.editBlog(blogId, {
      title,
      content,
      categoryId,
      authorId
    });

    res.json({
      success: true,
      message: 'Blog başarıyla güncellendi',
      data: blog
    });
  } catch (err) {
    const status = err.message === 'Blog bulunamadı' ? 404 : 400;
    res.status(status).json({ 
      success: false,
      error: err.message 
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user.userId;

    const deleted = await blogService.removeBlog(blogId, authorId);
    res.json({ 
      success: true,
      message: "Blog başarıyla silindi", 
      data: deleted 
    });
  } catch (err) {
    res.status(404).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Kategoriye göre blog'ları getirme
const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await blogService.getBlogsByCategory(categoryId);
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Yazara göre blog'ları getirme
const getBlogsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const blogs = await blogService.getBlogsByAuthor(authorId);
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Blog arama
const searchBlogs = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Arama terimi gerekli'
      });
    }

    const blogs = await blogService.searchBlogs(q);
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

module.exports = { 
  getAllBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  searchBlogs
};
