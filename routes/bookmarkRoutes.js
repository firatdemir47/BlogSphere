const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tüm route'lar authentication gerektirir
router.use(authenticateToken);

// Blog'u bookmark'a ekle
router.post('/blogs/:blogId/bookmarks', bookmarkController.addBookmark);

// Bookmark'tan kaldır
router.delete('/blogs/:blogId/bookmarks', bookmarkController.removeBookmark);

// Kullanıcının bookmark'larını getir
router.get('/users/bookmarks', bookmarkController.getUserBookmarks);

// Blog'un bookmark edilip edilmediğini kontrol et
router.get('/blogs/:blogId/bookmarks/status', bookmarkController.checkBookmarkStatus);

// Bookmark toggle (ekle/kaldır)
router.put('/blogs/:blogId/bookmarks/toggle', bookmarkController.toggleBookmark);

// Kullanıcının bookmark sayısını getir
router.get('/users/bookmarks/count', bookmarkController.getBookmarkCount);

module.exports = router;
