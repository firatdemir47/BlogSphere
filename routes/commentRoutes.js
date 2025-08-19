const express = require("express");
const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/commentController");

router.get("/", commentController.getCommentsByBlogId);
router.post("/", commentController.createComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
