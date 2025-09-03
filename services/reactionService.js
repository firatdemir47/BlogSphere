const reactionRepository = require('../repositories/reactionRepository');
const notificationRepository = require('../repositories/notificationRepository');

class ReactionService {
    // Blog'a reaction ekle/güncelle
    async addReaction(userId, blogId, reactionType) {
        try {
            // Geçerli reaction tipi kontrolü
            if (!['like', 'dislike'].includes(reactionType)) {
                throw new Error('Geçersiz reaction tipi');
            }

            // Mevcut reaction sayılarını kontrol et
            const currentCounts = await this.getBlogReactionCounts(blogId);
            const currentLikeCount = parseInt(currentCounts.like_count) || 0;
            const currentDislikeCount = parseInt(currentCounts.dislike_count) || 0;

            // Limit kontrolü (maksimum 50 like/dislike)
            const MAX_REACTIONS = 50;
            
            if (reactionType === 'like' && currentLikeCount >= MAX_REACTIONS) {
                throw new Error('Bu blog için maksimum like sayısına ulaşıldı (50)');
            }
            
            if (reactionType === 'dislike' && currentDislikeCount >= MAX_REACTIONS) {
                throw new Error('Bu blog için maksimum dislike sayısına ulaşıldı (50)');
            }

            // Reaction ekle/güncelle
            const reaction = await reactionRepository.addReaction(userId, blogId, reactionType);
            
            // Beğeni ise bildirim oluştur
            if (reactionType === 'like') {
                await notificationRepository.createLikeNotification(blogId, userId);
            }

            return reaction;
        } catch (error) {
            throw error;
        }
    }

    // Blog'dan reaction kaldır
    async removeReaction(userId, blogId) {
        try {
            const reaction = await reactionRepository.removeReaction(userId, blogId);
            return reaction;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının reaction'ını getir
    async getUserReaction(userId, blogId) {
        try {
            const reaction = await reactionRepository.getUserReaction(userId, blogId);
            return reaction;
        } catch (error) {
            throw error;
        }
    }

    // Blog'un reaction sayılarını getir
    async getBlogReactionCounts(blogId) {
        try {
            const counts = await reactionRepository.getBlogReactionCounts(blogId);
            return counts;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının tüm reaction'larını getir
    async getUserReactions(userId) {
        try {
            const reactions = await reactionRepository.getUserReactions(userId);
            return reactions;
        } catch (error) {
            throw error;
        }
    }

    // Blog'un detaylı reaction bilgilerini getir
    async getBlogReactionDetails(blogId, userId = null) {
        try {
            const counts = await this.getBlogReactionCounts(blogId);
            let userReaction = null;
            
            if (userId) {
                userReaction = await this.getUserReaction(userId, blogId);
            }

            return {
                likeCount: parseInt(counts.like_count) || 0,
                dislikeCount: parseInt(counts.dislike_count) || 0,
                userReaction: userReaction ? userReaction.reaction_type : null
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReactionService();
