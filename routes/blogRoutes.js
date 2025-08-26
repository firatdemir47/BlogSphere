const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const commentRoutes = require("./commentRoutes");
const validateBlog = require('../middlewares/validateBlog');
const validateBlogUpdate = require('../middlewares/validateBlogUpdate');
const { authenticateToken, optionalAuth } = require('../middlewares/authMiddleware');

// Public routes (authentication gerekmez)
router.get("/", optionalAuth, blogController.getAllBlogs);
router.get("/category/:categoryId", optionalAuth, blogController.getBlogsByCategory);
router.get("/author/:authorId", optionalAuth, blogController.getBlogsByAuthor);
router.get("/search", optionalAuth, blogController.searchBlogs);
router.get("/popular", optionalAuth, blogController.getPopularBlogs);
router.get("/:id", optionalAuth, blogController.getBlogById);

// Protected routes (authentication gerekir)
router.post("/", authenticateToken, validateBlog, blogController.createBlog);
router.put("/:id", authenticateToken, validateBlogUpdate, blogController.updateBlog);
router.delete("/:id", authenticateToken, blogController.deleteBlog);

// View counter artırma (public route)
router.post("/:blogId/view", blogController.incrementViewCount);

// Comment rotaları nested olarak
router.use("/:blogId/comments", commentRoutes);

module.exports = router;
