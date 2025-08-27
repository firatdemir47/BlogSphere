const pool = require('../db');

class UserRepository {
    // Kullanıcı oluşturma
    async createUser(userData) {
        const { username, email, passwordHash, firstName, lastName } = userData;
        const query = `
            INSERT INTO users (username, email, password_hash, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, first_name, last_name, created_at
        `;
        
        try {
            const result = await pool.query(query, [username, email, passwordHash, firstName, lastName]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Email ile kullanıcı bulma
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        
        try {
            const result = await pool.query(query, [email]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Username ile kullanıcı bulma
    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        
        try {
            const result = await pool.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // ID ile kullanıcı bulma
    async findById(id) {
        const query = 'SELECT id, username, email, first_name, last_name, password_hash, created_at FROM users WHERE id = $1';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Tüm kullanıcıları listeleme
    async findAll() {
        const query = 'SELECT id, username, email, first_name, last_name, created_at FROM users ORDER BY created_at DESC';
        
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcı güncelleme
    async updateUser(id, updateData) {
        const { firstName, lastName, email } = updateData;
        const query = `
            UPDATE users 
            SET first_name = $1, last_name = $2, email = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, username, email, first_name, last_name, updated_at
        `;
        
        try {
            const result = await pool.query(query, [firstName, lastName, email, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Kullanıcı silme
    async deleteUser(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Şifre güncelleme
    async updatePassword(id, newPasswordHash) {
        const query = `
            UPDATE users 
            SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING id
        `;
        
        try {
            const result = await pool.query(query, [newPasswordHash, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new UserRepository();
