const commentRepo = require('../repositories/commentRepository');

const listComments = (blogId) => commentRepo.getCommentsByBlogId(blogId);

const addComment = (blogId, data) => {
  const userName = (data && typeof data.user_name === 'string') ? data.user_name.trim() : '';
  const content = (data && typeof data.content === 'string') ? data.content.trim() : '';

  if (!userName || !content) {
    throw new Error('Kullanıcı adı ve içerik boş olamaz');
  }

  return commentRepo.createComment({ blogId, content, user_name: userName });
};

const removeComment = async (id) => {
  const deleted = await commentRepo.deleteComment(id);
  if (!deleted) throw new Error('Yorum bulunamadı');
  return deleted;
};

module.exports = { listComments, addComment, removeComment };
