const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

class UserService {
    // Kullanıcı kaydı
    async registerUser(userData) {
        const { username, email, password, firstName, lastName } = userData;

        // Email ve username kontrolü
        const existingEmail = await userRepository.findByEmail(email);
        if (existingEmail) {
            throw new Error('Bu email adresi zaten kullanılıyor');
        }

        const existingUsername = await userRepository.findByUsername(username);
        if (existingUsername) {
            throw new Error('Bu kullanıcı adı zaten kullanılıyor');
        }

        // Şifre hash'leme
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Kullanıcı oluşturma
        const newUser = await userRepository.createUser({
            username,
            email,
            passwordHash,
            firstName,
            lastName
        });

        // JWT token oluşturma
        const token = this.generateToken(newUser.id);

        return {
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.first_name,
                lastName: newUser.last_name
            },
            token
        };
    }

    // Kullanıcı girişi
    async loginUser(credentials) {
        const { email, password } = credentials;

        // Kullanıcıyı bul
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Geçersiz email veya şifre');
        }

        // Şifre kontrolü
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Geçersiz email veya şifre');
        }

        // JWT token oluşturma
        const token = this.generateToken(user.id);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            },
            token
        };
    }

    // Kullanıcı bilgilerini getirme
    async getUserProfile(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('Kullanıcı bulunamadı');
        }

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            createdAt: user.created_at
        };
    }

    // Kullanıcı güncelleme
    async updateUserProfile(userId, updateData) {
        const updatedUser = await userRepository.updateUser(userId, updateData);
        
        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            updatedAt: updatedUser.updated_at
        };
    }

    // JWT token oluşturma
    generateToken(userId) {
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        return jwt.sign({ userId }, secret, { expiresIn: '24h' });
    }

    // JWT token doğrulama
    verifyToken(token) {
        try {
            const secret = process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (error) {
            throw new Error('Geçersiz token');
        }
    }
}

module.exports = new UserService();
