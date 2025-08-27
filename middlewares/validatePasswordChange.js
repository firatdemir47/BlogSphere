const { body, validationResult } = require('express-validator');

const validatePasswordChange = [
    // Mevcut şifre validasyonu
    body('currentPassword')
        .notEmpty()
        .withMessage('Mevcut şifre gerekli')
        .isLength({ min: 1 })
        .withMessage('Mevcut şifre boş olamaz'),

    // Yeni şifre validasyonu
    body('newPassword')
        .notEmpty()
        .withMessage('Yeni şifre gerekli')
        .isLength({ min: 6 })
        .withMessage('Yeni şifre en az 6 karakter olmalı')
        .matches(/^(?=.*[a-zA-Z])/)
        .withMessage('Yeni şifre en az bir harf içermeli'),

    // Validation sonuçlarını kontrol et
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation hatası',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }
        next();
    }
];

module.exports = validatePasswordChange;
