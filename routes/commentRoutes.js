const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");
const validateComment = require("../middlewares/validateComment");

router.get("/", commentController.getCommentsByBlogId);
router.post("/", validateComment, commentController.createComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
