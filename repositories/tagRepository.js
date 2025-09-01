const pool = require('../db');

class TagRepository {
    // Tüm etiketleri getir
    async getAllTags() {
        const query = `
            SELECT t.*, COUNT(bt.blog_id) as blog_count
            FROM tags t
            LEFT JOIN blog_tags bt ON t.id = bt.tag_id
            GROUP BY t.id
            ORDER BY t.name ASC
        `;
        
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // ID ile etiket getir
    async getTagById(id) {
        const query = 'SELECT * FROM tags WHERE id = $1';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // İsim ile etiket getir
    async getTagByName(name) {
        const query = 'SELECT * FROM tags WHERE name = $1';
        
        try {
            const result = await pool.query(query, [name]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Yeni etiket oluştur
    async createTag(tagData) {
        const { name, description, color } = tagData;
        const query = `
            INSERT INTO tags (name, description, color)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [name, description, color]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Etiket güncelle
    async updateTag(id, updateData) {
        const { name, description, color } = updateData;
        const query = `
            UPDATE tags 
            SET name = $1, description = $2, color = $3
            WHERE id = $4
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [name, description, color, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Etiket sil
    async deleteTag(id) {
        const query = 'DELETE FROM tags WHERE id = $1 RETURNING *';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Blog'a etiket ekle
    async addTagToBlog(blogId, tagId) {
        const query = `
            INSERT INTO blog_tags (blog_id, tag_id)
            VALUES ($1, $2)
            ON CONFLICT (blog_id, tag_id) DO NOTHING
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [blogId, tagId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Blog'dan etiket kaldır
    async removeTagFromBlog(blogId, tagId) {
        const query = 'DELETE FROM blog_tags WHERE blog_id = $1 AND tag_id = $2 RETURNING *';
        
        try {
            const result = await pool.query(query, [blogId, tagId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Blog'un etiketlerini getir
    async getBlogTags(blogId) {
        const query = `
            SELECT t.*
            FROM tags t
            JOIN blog_tags bt ON t.id = bt.tag_id
            WHERE bt.blog_id = $1
            ORDER BY t.name ASC
        `;
        
        try {
            const result = await pool.query(query, [blogId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Etiket'e göre blog'ları getir
    async getBlogsByTag(tagId, limit = 20, offset = 0) {
        const query = `
            SELECT b.*, u.username as author_name, c.name as category_name,
                   COUNT(br.id) as like_count, COUNT(br2.id) as dislike_count
            FROM blogs b
            JOIN blog_tags bt ON b.id = bt.blog_id
            LEFT JOIN users u ON b.author_id = u.id
            LEFT JOIN categories c ON b.category_id = c.id
            LEFT JOIN blog_reactions br ON b.id = br.blog_id AND br.reaction_type = 'like'
            LEFT JOIN blog_reactions br2 ON b.id = br2.blog_id AND br2.reaction_type = 'dislike'
            WHERE bt.tag_id = $1
            GROUP BY b.id, u.username, c.name
            ORDER BY b.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        
        try {
            const result = await pool.query(query, [tagId, limit, offset]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Popüler etiketleri getir
    async getPopularTags(limit = 10) {
        const query = `
            SELECT t.*, COUNT(bt.blog_id) as blog_count
            FROM tags t
            LEFT JOIN blog_tags bt ON t.id = bt.tag_id
            GROUP BY t.id
            ORDER BY blog_count DESC, t.name ASC
            LIMIT $1
        `;
        
        try {
            const result = await pool.query(query, [limit]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TagRepository();
