const bookmarkService = require('../services/bookmarkService');

// Blog'u bookmark'a ekle
const addBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const bookmark = await bookmarkService.addBookmark(userId, blogId);

        res.status(200).json({
            success: true,
            message: 'Blog başarıyla bookmark\'a eklendi',
            data: bookmark
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark eklenirken hata oluştu',
            error: error.message
        });
    }
};

// Bookmark'tan kaldır
const removeBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const bookmark = await bookmarkService.removeBookmark(userId, blogId);

        res.status(200).json({
            success: true,
            message: 'Blog bookmark\'tan kaldırıldı',
            data: bookmark
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark kaldırılırken hata oluştu',
            error: error.message
        });
    }
};

// Kullanıcının bookmark'larını getir
const getUserBookmarks = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const result = await bookmarkService.getUserBookmarks(userId, parseInt(page), parseInt(limit));

        res.status(200).json({
            success: true,
            data: result.bookmarks,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark\'lar alınırken hata oluştu',
            error: error.message
        });
    }
};

// Blog'un bookmark edilip edilmediğini kontrol et
const checkBookmarkStatus = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const isBookmarked = await bookmarkService.isBookmarked(userId, blogId);

        res.status(200).json({
            success: true,
            data: { isBookmarked }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark durumu kontrol edilirken hata oluştu',
            error: error.message
        });
    }
};

// Bookmark toggle (ekle/kaldır)
const toggleBookmark = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const result = await bookmarkService.toggleBookmark(userId, blogId);

        res.status(200).json({
            success: true,
            message: result.action === 'added' ? 'Blog bookmark\'a eklendi' : 'Blog bookmark\'tan kaldırıldı',
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark toggle edilirken hata oluştu',
            error: error.message
        });
    }
};

// Kullanıcının bookmark sayısını getir
const getBookmarkCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await bookmarkService.getUserBookmarkCount(userId);

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bookmark sayısı alınırken hata oluştu',
            error: error.message
        });
    }
};

module.exports = {
    addBookmark,
    removeBookmark,
    getUserBookmarks,
    checkBookmarkStatus,
    toggleBookmark,
    getBookmarkCount
};
