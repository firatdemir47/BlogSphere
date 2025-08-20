const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const commentRoutes = require("./commentRoutes"); // comment route ekliyoruz
const validateBlog = require('../middlewares/validateBlog');

// Blog rotaları
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", validateBlog, blogController.createBlog); // validation eklendi
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

// Comment rotaları nested olarak
router.use("/:blogId/comments", commentRoutes);

module.exports = router;
