const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tüm etiketleri getir (public)
router.get('/', tagController.getAllTags);

// ID ile etiket getir (public)
router.get('/:id', tagController.getTagById);

// Popüler etiketleri getir (public)
router.get('/popular/list', tagController.getPopularTags);

// Etiket'e göre blog'ları getir (public)
router.get('/:tagId/blogs', tagController.getBlogsByTag);

// Blog'un etiketlerini getir (public)
router.get('/blogs/:blogId/tags', tagController.getBlogTags);

// Yeni etiket oluştur (admin only)
router.post('/', authenticateToken, tagController.createTag);

// Etiket güncelle (admin only)
router.put('/:id', authenticateToken, tagController.updateTag);

// Etiket sil (admin only)
router.delete('/:id', authenticateToken, tagController.deleteTag);

// Blog'a etiket ekle (auth required)
router.post('/blogs/:blogId/tags/:tagId', authenticateToken, tagController.addTagToBlog);

// Blog'dan etiket kaldır (auth required)
router.delete('/blogs/:blogId/tags/:tagId', authenticateToken, tagController.removeTagFromBlog);

// Blog'un tüm etiketlerini güncelle (auth required)
router.put('/blogs/:blogId/tags', authenticateToken, tagController.updateBlogTags);

module.exports = router;
