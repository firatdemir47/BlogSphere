const reactionService = require('../services/reactionService');

// Blog'a reaction ekle/güncelle
const addReaction = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { reactionType } = req.body;
        const userId = req.user.id;

        if (!reactionType || !['like', 'dislike'].includes(reactionType)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir reaction tipi belirtin (like/dislike)'
            });
        }

        const reaction = await reactionService.addReaction(userId, blogId, reactionType);

        res.status(200).json({
            success: true,
            message: 'Reaction başarıyla eklendi',
            data: reaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reaction eklenirken hata oluştu',
            error: error.message
        });
    }
};

// Blog'dan reaction kaldır
const removeReaction = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.id;

        const reaction = await reactionService.removeReaction(userId, blogId);

        res.status(200).json({
            success: true,
            message: 'Reaction başarıyla kaldırıldı',
            data: reaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reaction kaldırılırken hata oluştu',
            error: error.message
        });
    }
};

// Blog'un reaction detaylarını getir
const getBlogReactionDetails = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.id; // Opsiyonel kullanıcı

        const details = await reactionService.getBlogReactionDetails(blogId, userId);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reaction detayları alınırken hata oluştu',
            error: error.message
        });
    }
};

// Kullanıcının reaction'larını getir
const getUserReactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const reactions = await reactionService.getUserReactions(userId);

        res.status(200).json({
            success: true,
            data: reactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Kullanıcı reaction\'ları alınırken hata oluştu',
            error: error.message
        });
    }
};

// Reaction toggle (like -> dislike veya tam tersi)
const toggleReaction = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { reactionType } = req.body;
        const userId = req.user.id;

        if (!reactionType || !['like', 'dislike'].includes(reactionType)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir reaction tipi belirtin (like/dislike)'
            });
        }

        // Mevcut reaction'ı kontrol et
        const currentReaction = await reactionService.getUserReaction(userId, blogId);

        if (currentReaction && currentReaction.reaction_type === reactionType) {
            // Aynı reaction varsa kaldır
            await reactionService.removeReaction(userId, blogId);
            return res.status(200).json({
                success: true,
                message: 'Reaction kaldırıldı',
                action: 'removed'
            });
        } else {
            // Farklı reaction varsa güncelle, yoksa ekle
            await reactionService.addReaction(userId, blogId, reactionType);
            return res.status(200).json({
                success: true,
                message: 'Reaction güncellendi',
                action: 'updated'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Reaction toggle edilirken hata oluştu',
            error: error.message
        });
    }
};

module.exports = {
    addReaction,
    removeReaction,
    getBlogReactionDetails,
    getUserReactions,
    toggleReaction
};
