const commentService = require('../services/commentService');

const getCommentsByBlogId = async (req, res) => {
  try {
    const comments = await commentService.listComments(req.params.blogId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createComment = async (req, res) => {
  try {
    const comment = await commentService.addComment(req.params.blogId, req.body);
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const deleted = await commentService.removeComment(req.params.id);
    res.json({ message: "Yorum silindi", comment: deleted });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getCommentsByBlogId, createComment, deleteComment };
