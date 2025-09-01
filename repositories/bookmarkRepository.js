const pool = require('../db');

class BookmarkRepository {
    // Blog'u bookmark'a ekle
    async addBookmark(userId, blogId) {
        const query = `
            INSERT INTO bookmarks (user_id, blog_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, blog_id) DO NOTHING
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [userId, blogId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Bookmark'tan kaldır
    async removeBookmark(userId, blogId) {
        const query = 'DELETE FROM bookmarks WHERE user_id = $1 AND blog_id = $2 RETURNING *';
        
        try {
            const result = await pool.query(query, [userId, blogId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bookmark'larını getir
    async getUserBookmarks(userId, limit = 20, offset = 0) {
        const query = `
            SELECT b.*, u.username as author_name, c.name as category_name,
                   COUNT(br.id) as like_count, COUNT(br2.id) as dislike_count
            FROM bookmarks bk
            JOIN blogs b ON bk.blog_id = b.id
            LEFT JOIN users u ON b.author_id = u.id
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN blog_reactions br ON b.id = br.blog_id AND br.reaction_type = 'like'
            LEFT JOIN blog_reactions br2 ON b.id = br2.blog_id AND br2.reaction_type = 'dislike'
            WHERE bk.user_id = $1
            GROUP BY b.id, u.username, c.name
            ORDER BY bk.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        
        try {
            const result = await pool.query(query, [userId, limit, offset]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bookmark sayısını getir
    async getUserBookmarkCount(userId) {
        const query = 'SELECT COUNT(*) as count FROM bookmarks WHERE user_id = $1';
        
        try {
            const result = await pool.query(query, [userId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw error;
        }
    }

    // Blog'un bookmark edilip edilmediğini kontrol et
    async isBookmarked(userId, blogId) {
        const query = 'SELECT EXISTS(SELECT 1 FROM bookmarks WHERE user_id = $1 AND blog_id = $2) as is_bookmarked';
        
        try {
            const result = await pool.query(query, [userId, blogId]);
            return result.rows[0].is_bookmarked;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new BookmarkRepository();
