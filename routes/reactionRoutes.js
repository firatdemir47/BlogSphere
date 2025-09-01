const express = require('express');
const router = express.Router();
const reactionController = require('../controllers/reactionController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Tüm route'lar authentication gerektirir
router.use(authenticateToken);

// Blog'a reaction ekle/güncelle
router.post('/blogs/:blogId/reactions', reactionController.addReaction);

// Blog'dan reaction kaldır
router.delete('/blogs/:blogId/reactions', reactionController.removeReaction);

// Blog'un reaction detaylarını getir (opsiyonel auth)
router.get('/blogs/:blogId/reactions', reactionController.getBlogReactionDetails);

// Kullanıcının reaction'larını getir
router.get('/users/reactions', reactionController.getUserReactions);

// Reaction toggle (like -> dislike veya tam tersi)
router.put('/blogs/:blogId/reactions/toggle', reactionController.toggleReaction);

module.exports = router;
