const blogService = require('../services/blogService');

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.listAllBlogs();
    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const blog = await blogService.getBlog(req.params.id);
    res.json(blog);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const createBlog = async (req, res) => {
  try {
    const blog = await blogService.addBlog(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await blogService.editBlog(req.params.id, req.body);
    res.json(blog);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const deleted = await blogService.removeBlog(req.params.id);
    res.json({ message: "Blog silindi", blog: deleted });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
