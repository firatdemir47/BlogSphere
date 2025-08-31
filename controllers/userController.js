const userService = require('../services/userService');

class UserController {
    // Kullanıcı kaydı
    async register(req, res) {
        try {
            const { username, email, password, firstName, lastName } = req.body;

            // Gerekli alanları kontrol et
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Kullanıcı adı, email ve şifre gerekli'
                });
            }

            // Email formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçerli bir email adresi girin'
                });
            }

            // Şifre uzunluğunu kontrol et
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Şifre en az 6 karakter olmalı'
                });
            }

            const result = await userService.registerUser({
                username,
                email,
                password,
                firstName,
                lastName
            });

            res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla oluşturuldu',
                data: result
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kullanıcı girişi
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Gerekli alanları kontrol et
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email ve şifre gerekli'
                });
            }

            const result = await userService.loginUser({ email, password });

            res.status(200).json({
                success: true,
                message: 'Giriş başarılı',
                token: result.token,
                user: result.user
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kullanıcı profili getirme
    async getProfile(req, res) {
        try {
            const userId = req.user.userId; // JWT middleware'den gelir
            const userProfile = await userService.getUserProfile(userId);

            res.status(200).json({
                success: true,
                data: userProfile
            });

        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    // Kullanıcı profili güncelleme
    async updateProfile(req, res) {
        try {
            const userId = req.user.userId;
            const { firstName, lastName, email } = req.body;

            // Gerekli alanları kontrol et
            if (!firstName || !lastName || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Ad, soyad ve email gerekli'
                });
            }

            // Email formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Geçerli bir email adresi girin'
                });
            }

            const updatedProfile = await userService.updateUserProfile(userId, {
                firstName,
                lastName,
                email
            });

            res.status(200).json({
                success: true,
                message: 'Profil başarıyla güncellendi',
                data: updatedProfile
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    // Token doğrulama
    async verifyToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token bulunamadı'
                });
            }

            const decoded = userService.verifyToken(token);

            res.status(200).json({
                success: true,
                message: 'Token geçerli',
                data: { userId: decoded.userId }
            });

        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }

    // Şifre değiştirme
    async changePassword(req, res) {
        try {
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;

            // Gerekli alanları kontrol et
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Mevcut şifre ve yeni şifre gerekli'
                });
            }

            // Yeni şifre uzunluğunu kontrol et
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Yeni şifre en az 6 karakter olmalı'
                });
            }

            const result = await userService.changePassword(userId, currentPassword, newPassword);

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = new UserController();
