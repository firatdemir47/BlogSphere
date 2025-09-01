const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tüm route'lar authentication gerektirir
router.use(authenticateToken);

// Kullanıcının bildirimlerini getir
router.get('/users/notifications', notificationController.getUserNotifications);

// Okunmamış bildirimleri getir
router.get('/users/notifications/unread', notificationController.getUnreadNotifications);

// Okunmamış bildirim sayısını getir
router.get('/users/notifications/unread/count', notificationController.getUnreadCount);

// Bildirimi okundu olarak işaretle
router.put('/notifications/:notificationId/read', notificationController.markAsRead);

// Tüm bildirimleri okundu olarak işaretle
router.put('/users/notifications/read-all', notificationController.markAllAsRead);

// Bildirim sil
router.delete('/notifications/:notificationId', notificationController.deleteNotification);

// Bildirim türlerine göre filtreleme
router.get('/users/notifications/type/:type', notificationController.getNotificationsByType);

// Bildirim istatistikleri
router.get('/users/notifications/stats', notificationController.getNotificationStats);

module.exports = router;
