const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const validateComment = require("../middlewares/validateComment");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Public routes (authentication gerekmez)
router.get("/", commentController.getCommentsByBlogId);

// Protected routes (authentication gerekir)
router.post("/", authenticateToken, validateComment, commentController.createComment);
router.put("/:id", authenticateToken, validateComment, commentController.updateComment);
router.delete("/:id", authenticateToken, commentController.deleteComment);

// Kullanıcının yorumlarını getirme
router.get("/my-comments", authenticateToken, commentController.getCommentsByAuthor);

module.exports = router;
