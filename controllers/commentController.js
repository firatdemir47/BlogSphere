const commentService = require('../services/commentService');

const getCommentsByBlogId = async (req, res) => {
  try {
    const comments = await commentService.listComments(req.params.blogId);
    res.json({
      success: true,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const blogId = req.params.blogId;
    const authorId = req.user.userId; // JWT middleware'den gelir

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Yorum içeriği gerekli'
      });
    }

    const comment = await commentService.addComment(blogId, {
      content: content.trim(),
      authorId
    });

    res.status(201).json({
      success: true,
      message: 'Yorum başarıyla eklendi',
      data: comment
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const authorId = req.user.userId;

    const deleted = await commentService.removeComment(commentId, authorId);
    res.json({ 
      success: true,
      message: "Yorum başarıyla silindi", 
      data: deleted 
    });
  } catch (err) {
    res.status(404).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Yorum güncelleme
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const authorId = req.user.userId;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Yorum içeriği gerekli'
      });
    }

    const updatedComment = await commentService.editComment(commentId, {
      content: content.trim(),
      authorId
    });

    res.json({
      success: true,
      message: 'Yorum başarıyla güncellendi',
      data: updatedComment
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
};

// Kullanıcının yorumlarını getirme
const getCommentsByAuthor = async (req, res) => {
  try {
    const authorId = req.user.userId;
    const comments = await commentService.getCommentsByAuthor(authorId);
    
    res.json({
      success: true,
      data: comments
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
};

module.exports = { 
  getCommentsByBlogId, 
  createComment, 
  deleteComment,
  updateComment,
  getCommentsByAuthor
};
