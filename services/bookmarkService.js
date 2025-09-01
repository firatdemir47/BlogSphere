const bookmarkRepository = require('../repositories/bookmarkRepository');

class BookmarkService {
    // Blog'u bookmark'a ekle
    async addBookmark(userId, blogId) {
        try {
            const bookmark = await bookmarkRepository.addBookmark(userId, blogId);
            return bookmark;
        } catch (error) {
            throw error;
        }
    }

    // Bookmark'tan kaldır
    async removeBookmark(userId, blogId) {
        try {
            const bookmark = await bookmarkRepository.removeBookmark(userId, blogId);
            return bookmark;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bookmark'larını getir
    async getUserBookmarks(userId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const bookmarks = await bookmarkRepository.getUserBookmarks(userId, limit, offset);
            const totalCount = await bookmarkRepository.getUserBookmarkCount(userId);
            
            return {
                bookmarks,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNext: page * limit < totalCount,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Blog'un bookmark edilip edilmediğini kontrol et
    async isBookmarked(userId, blogId) {
        try {
            const isBookmarked = await bookmarkRepository.isBookmarked(userId, blogId);
            return isBookmarked;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bookmark sayısını getir
    async getUserBookmarkCount(userId) {
        try {
            const count = await bookmarkRepository.getUserBookmarkCount(userId);
            return count;
        } catch (error) {
            throw error;
        }
    }

    // Bookmark durumunu değiştir (toggle)
    async toggleBookmark(userId, blogId) {
        try {
            const isBookmarked = await this.isBookmarked(userId, blogId);
            
            if (isBookmarked) {
                await this.removeBookmark(userId, blogId);
                return { action: 'removed', bookmarked: false };
            } else {
                await this.addBookmark(userId, blogId);
                return { action: 'added', bookmarked: true };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BookmarkService();
