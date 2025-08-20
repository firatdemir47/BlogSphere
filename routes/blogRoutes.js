const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const commentRoutes = require("./commentRoutes"); // comment route ekliyoruz
const validateBlog = require('../middlewares/validateBlog');
const validateBlogUpdate = require('../middlewares/validateBlogUpdate'); // yeni ekledik

// Blog rotaları
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", validateBlog, blogController.createBlog); // create validation eklendi
router.put("/:id", validateBlogUpdate, blogController.updateBlog); // update validation eklendi
router.delete("/:id", blogController.deleteBlog);

// Comment rotaları nested olarak
router.use("/:blogId/comments", commentRoutes);

module.exports = router;
