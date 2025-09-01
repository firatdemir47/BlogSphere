const notificationRepository = require('../repositories/notificationRepository');
const pool = require('../db');

class NotificationService {
    // Bildirim oluştur
    async createNotification(notificationData) {
        try {
            const notification = await notificationRepository.createNotification(notificationData);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının bildirimlerini getir
    async getUserNotifications(userId, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const notifications = await notificationRepository.getUserNotifications(userId, limit, offset);
            
            return {
                notifications,
                pagination: {
                    currentPage: page,
                    hasNext: notifications.length === limit,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Okunmamış bildirimleri getir
    async getUnreadNotifications(userId) {
        try {
            const notifications = await notificationRepository.getUnreadNotifications(userId);
            return notifications;
        } catch (error) {
            throw error;
        }
    }

    // Bildirimi okundu olarak işaretle
    async markAsRead(notificationId, userId) {
        try {
            const notification = await notificationRepository.markAsRead(notificationId);
            
            // Kullanıcının bildirimi değilse hata ver
            if (!notification || notification.user_id !== userId) {
                throw new Error('Bildirim bulunamadı');
            }
            
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Tüm bildirimleri okundu olarak işaretle
    async markAllAsRead(userId) {
        try {
            const notifications = await notificationRepository.markAllAsRead(userId);
            return notifications;
        } catch (error) {
            throw error;
        }
    }

    // Bildirim sil
    async deleteNotification(notificationId, userId) {
        try {
            const notification = await notificationRepository.deleteNotification(notificationId, userId);
            if (!notification) {
                throw new Error('Bildirim bulunamadı');
            }
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Okunmamış bildirim sayısını getir
    async getUnreadCount(userId) {
        try {
            const count = await notificationRepository.getUnreadCount(userId);
            return count;
        } catch (error) {
            throw error;
        }
    }

    // Blog yorum bildirimi oluştur
    async createCommentNotification(blogId, commentId, authorId) {
        try {
            const notification = await notificationRepository.createCommentNotification(blogId, commentId, authorId);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Blog beğeni bildirimi oluştur
    async createLikeNotification(blogId, userId) {
        try {
            const notification = await notificationRepository.createLikeNotification(blogId, userId);
            return notification;
        } catch (error) {
            throw error;
        }
    }

    // Bildirim türlerine göre filtreleme
    async getNotificationsByType(userId, type, page = 1, limit = 20) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT *
                FROM notifications
                WHERE user_id = $1 AND type = $2
                ORDER BY created_at DESC
                LIMIT $3 OFFSET $4
            `;
            
            const result = await pool.query(query, [userId, type, limit, offset]);
            
            return {
                notifications: result.rows,
                pagination: {
                    currentPage: page,
                    hasNext: result.rows.length === limit,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Bildirim istatistikleri
    async getNotificationStats(userId) {
        try {
            const query = `
                SELECT 
                    type,
                    COUNT(*) as count,
                    COUNT(CASE WHEN is_read = FALSE THEN 1 END) as unread_count
                FROM notifications
                WHERE user_id = $1
                GROUP BY type
                ORDER BY count DESC
            `;
            
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new NotificationService();
