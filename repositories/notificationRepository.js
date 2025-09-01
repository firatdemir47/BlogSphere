const pool = require('../db');

class NotificationRepository {
    // Bildirim oluştur
    async createNotification(notificationData) {
        const { userId, type, title, message, data } = notificationData;
        const query = `
            INSERT INTO notifications (user_id, type, title, message, data)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [userId, type, title, message, data]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bildirimlerini getir
    async getUserNotifications(userId, limit = 20, offset = 0) {
        const query = `
            SELECT *
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `;
        
        try {
            const result = await pool.query(query, [userId, limit, offset]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Okunmamış bildirimleri getir
    async getUnreadNotifications(userId) {
        const query = `
            SELECT *
            FROM notifications
            WHERE user_id = $1 AND is_read = FALSE
            ORDER BY created_at DESC
        `;
        
        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Bildirimi okundu olarak işaretle
    async markAsRead(notificationId) {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [notificationId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tüm bildirimleri okundu olarak işaretle
    async markAllAsRead(userId) {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE user_id = $1 AND is_read = FALSE
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Bildirim sil
    async deleteNotification(notificationId, userId) {
        const query = `
            DELETE FROM notifications
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [notificationId, userId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Okunmamış bildirim sayısını getir
    async getUnreadCount(userId) {
        const query = `
            SELECT COUNT(*) as count
            FROM notifications
            WHERE user_id = $1 AND is_read = FALSE
        `;
        
        try {
            const result = await pool.query(query, [userId]);
            return parseInt(result.rows[0].count);
        } catch (error) {
            throw error;
        }
    }

    // Blog yorum bildirimi oluştur
    async createCommentNotification(blogId, commentId, authorId) {
        // Blog yazarını bul
        const blogQuery = 'SELECT author_id FROM blogs WHERE id = $1';
        const blogResult = await pool.query(blogQuery, [blogId]);
        
        if (blogResult.rows.length === 0) return null;
        
        const blogAuthorId = blogResult.rows[0].author_id;
        
        // Yorum yapan kişi blog yazarı değilse bildirim oluştur
        if (blogAuthorId !== authorId) {
            const commentQuery = 'SELECT content FROM comments WHERE id = $1';
            const commentResult = await pool.query(commentQuery, [commentId]);
            
            if (commentResult.rows.length > 0) {
                const commentContent = commentResult.rows[0].content;
                const truncatedContent = commentContent.length > 50 
                    ? commentContent.substring(0, 50) + '...' 
                    : commentContent;
                
                return await this.createNotification({
                    userId: blogAuthorId,
                    type: 'comment',
                    title: 'Yeni Yorum',
                    message: `Blog'unuza yeni bir yorum yapıldı: "${truncatedContent}"`,
                    data: { blogId, commentId, authorId }
                });
            }
        }
        
        return null;
    }

    // Blog beğeni bildirimi oluştur
    async createLikeNotification(blogId, userId) {
        const blogQuery = 'SELECT author_id FROM blogs WHERE id = $1';
        const blogResult = await pool.query(blogQuery, [blogId]);
        
        if (blogResult.rows.length === 0) return null;
        
        const blogAuthorId = blogResult.rows[0].author_id;
        
        // Beğenen kişi blog yazarı değilse bildirim oluştur
        if (blogAuthorId !== userId) {
            return await this.createNotification({
                userId: blogAuthorId,
                type: 'like',
                title: 'Yeni Beğeni',
                message: 'Blog\'unuz beğenildi',
                data: { blogId, userId }
            });
        }
        
        return null;
    }
}

module.exports = new NotificationRepository();
