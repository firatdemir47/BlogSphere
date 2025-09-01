const notificationService = require('../services/notificationService');

// Kullanıcının bildirimlerini getir
const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const result = await notificationService.getUserNotifications(userId, parseInt(page), parseInt(limit));

        res.status(200).json({
            success: true,
            data: result.notifications,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bildirimler alınırken hata oluştu',
            error: error.message
        });
    }
};

// Okunmamış bildirimleri getir
const getUnreadNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.getUnreadNotifications(userId);

        res.status(200).json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Okunmamış bildirimler alınırken hata oluştu',
            error: error.message
        });
    }
};

// Bildirimi okundu olarak işaretle
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await notificationService.markAsRead(notificationId, userId);

        res.status(200).json({
            success: true,
            message: 'Bildirim okundu olarak işaretlendi',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Bildirim işaretlenirken hata oluştu',
            error: error.message
        });
    }
};

// Tüm bildirimleri okundu olarak işaretle
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await notificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            message: 'Tüm bildirimler okundu olarak işaretlendi',
            data: notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bildirimler işaretlenirken hata oluştu',
            error: error.message
        });
    }
};

// Bildirim sil
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user.id;

        const notification = await notificationService.deleteNotification(notificationId, userId);

        res.status(200).json({
            success: true,
            message: 'Bildirim silindi',
            data: notification
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Bildirim silinirken hata oluştu',
            error: error.message
        });
    }
};

// Okunmamış bildirim sayısını getir
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await notificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: { count }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bildirim sayısı alınırken hata oluştu',
            error: error.message
        });
    }
};

// Bildirim türlerine göre filtreleme
const getNotificationsByType = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.params;
        const { page = 1, limit = 20 } = req.query;

        const result = await notificationService.getNotificationsByType(userId, type, parseInt(page), parseInt(limit));

        res.status(200).json({
            success: true,
            data: result.notifications,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bildirimler filtrelenirken hata oluştu',
            error: error.message
        });
    }
};

// Bildirim istatistikleri
const getNotificationStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const stats = await notificationService.getNotificationStats(userId);

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Bildirim istatistikleri alınırken hata oluştu',
            error: error.message
        });
    }
};

module.exports = {
    getUserNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
    getNotificationsByType,
    getNotificationStats
};
