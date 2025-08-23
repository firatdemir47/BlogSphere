const pool = require('../db');

class CategoryRepository {
    // Kategori oluşturma
    async createCategory(categoryData) {
        const { name, description } = categoryData;
        const query = `
            INSERT INTO categories (name, description)
            VALUES ($1, $2)
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [name, description]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tüm kategorileri listeleme
    async findAll() {
        const query = 'SELECT * FROM categories ORDER BY name ASC';
        
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // ID ile kategori bulma
    async findById(id) {
        const query = 'SELECT * FROM categories WHERE id = $1';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // İsim ile kategori bulma
    async findByName(name) {
        const query = 'SELECT * FROM categories WHERE name = $1';
        
        try {
            const result = await pool.query(query, [name]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kategori güncelleme
    async updateCategory(id, updateData) {
        const { name, description } = updateData;
        const query = `
            UPDATE categories 
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [name, description, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kategori silme
    async deleteCategory(id) {
        const query = 'DELETE FROM categories WHERE id = $1 RETURNING id';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kategoriye ait blog sayısını getirme
    async getBlogCountByCategory(categoryId) {
        const query = 'SELECT COUNT(*) as blog_count FROM blogs WHERE category_id = $1';
        
        try {
            const result = await pool.query(query, [categoryId]);
            return parseInt(result.rows[0].blog_count);
        } catch (error) {
            throw error;
        }
    }

    // Kategorileri blog sayıları ile birlikte getirme
    async findAllWithBlogCount() {
        const query = `
            SELECT c.*, COUNT(b.id) as blog_count
            FROM categories c
            LEFT JOIN blogs b ON c.id = b.category_id
            GROUP BY c.id, c.name, c.description, c.created_at
            ORDER BY c.name ASC
        `;
        
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CategoryRepository();
