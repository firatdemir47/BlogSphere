const userService = require('../services/userService');

// JWT token doğrulama middleware'i
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token gerekli'
            });
        }

        // Token'ı doğrula
        const decoded = userService.verifyToken(token);
        
        // Kullanıcı bilgilerini req.user'a ekle
        req.user = decoded;
        
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Geçersiz token'
        });
    }
};

// Opsiyonel authentication middleware (kullanıcı giriş yapmışsa bilgileri ekle)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = userService.verifyToken(token);
            req.user = decoded;
        }
        
        next();
    } catch (error) {
        // Token geçersizse devam et, sadece req.user undefined olur
        next();
    }
};

// Admin yetkisi kontrolü (gelecekte kullanım için)
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication gerekli'
            });
        }

        // Burada admin kontrolü yapılabilir
        // Şimdilik sadece giriş yapmış kullanıcıları kabul ediyoruz
        
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Yetki yetersiz'
        });
    }
};

module.exports = {
    authenticateToken,
    optionalAuth,
    requireAdmin
};
