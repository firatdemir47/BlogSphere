const commentRepo = require('../repositories/commentRepository');

const listComments = (blogId) => commentRepo.getCommentsByBlogId(blogId);

const addComment = (blogId, data) => commentRepo.createComment({ blogId, ...data });

const removeComment = async (id) => {
  const deleted = await commentRepo.deleteComment(id);
  if (!deleted) throw new Error('Yorum bulunamadı');
  return deleted;
};

module.exports = { listComments, addComment, removeComment };
