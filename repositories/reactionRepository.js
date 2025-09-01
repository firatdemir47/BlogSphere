const pool = require('../db');

class ReactionRepository {
    // Blog'a reaction ekle/güncelle
    async addReaction(userId, blogId, reactionType) {
        const query = `
            INSERT INTO blog_reactions (user_id, blog_id, reaction_type)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, blog_id)
            DO UPDATE SET reaction_type = $3, created_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [userId, blogId, reactionType]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Blog'dan reaction kaldır
    async removeReaction(userId, blogId) {
        const query = 'DELETE FROM blog_reactions WHERE user_id = $1 AND blog_id = $2 RETURNING *';
        
        try {
            const result = await pool.query(query, [userId, blogId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının reaction'ını getir
    async getUserReaction(userId, blogId) {
        const query = 'SELECT * FROM blog_reactions WHERE user_id = $1 AND blog_id = $2';
        
        try {
            const result = await pool.query(query, [userId, blogId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Blog'un reaction sayılarını getir
    async getBlogReactionCounts(blogId) {
        const query = `
            SELECT 
                COUNT(CASE WHEN reaction_type = 'like' THEN 1 END) as like_count,
                COUNT(CASE WHEN reaction_type = 'dislike' THEN 1 END) as dislike_count
            FROM blog_reactions 
            WHERE blog_id = $1
        `;
        
        try {
            const result = await pool.query(query, [blogId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcının tüm reaction'larını getir
    async getUserReactions(userId) {
        const query = `
            SELECT br.*, b.title as blog_title, b.author_id
            FROM blog_reactions br
            JOIN blogs b ON br.blog_id = b.id
            WHERE br.user_id = $1
            ORDER BY br.created_at DESC
        `;
        
        try {
            const result = await pool.query(query, [userId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ReactionRepository();
