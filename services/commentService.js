const commentRepo = require('../repositories/commentRepository');
const notificationService = require('./notificationService');

const listComments = (blogId) => commentRepo.getCommentsByBlogId(blogId);

const addComment = async (blogId, data) => {
  const content = (data && typeof data.content === 'string') ? data.content.trim() : '';
  const authorId = data.authorId;

  if (!content) {
    throw new Error('Yorum içeriği boş olamaz');
  }

  if (!authorId) {
    throw new Error('Kullanıcı ID gerekli');
  }

  const comment = await commentRepo.createComment({ blogId, content, authorId });
  
  // Blog yazarına bildirim gönder
  try {
    await notificationService.createCommentNotification(blogId, comment.id, authorId);
  } catch (error) {
    console.error('Bildirim gönderilirken hata:', error);
  }

  return comment;
};

const removeComment = async (id, authorId) => {
  // Yorumun yazarı mı kontrol et
  const comment = await commentRepo.getCommentById(id);
  if (!comment) throw new Error('Yorum bulunamadı');
  
  if (comment.author_id !== authorId) {
    throw new Error('Bu yorumu silme yetkiniz yok');
  }

  const deleted = await commentRepo.deleteComment(id);
  return deleted;
};

// Yorum güncelleme
const editComment = async (id, data) => {
  const content = (data && typeof data.content === 'string') ? data.content.trim() : '';
  const authorId = data.authorId;

  if (!content) {
    throw new Error('Yorum içeriği boş olamaz');
  }

  // Yorumun yazarı mı kontrol et
  const comment = await commentRepo.getCommentById(id);
  if (!comment) throw new Error('Yorum bulunamadı');
  
  if (comment.author_id !== authorId) {
    throw new Error('Bu yorumu düzenleme yetkiniz yok');
  }

  const updated = await commentRepo.updateComment(id, { content });
  return updated;
};

// Kullanıcının yorumlarını getirme
const getCommentsByAuthor = async (authorId) => {
  return await commentRepo.getCommentsByAuthor(authorId);
};

module.exports = { 
  listComments, 
  addComment, 
  removeComment,
  editComment,
  getCommentsByAuthor
};
