const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
  checkTokenStatus
} = require('../controllers/passwordResetController');

// Şifre sıfırlama talebi
router.post('/request-reset', requestPasswordReset);

// Şifre sıfırlama token doğrulama
router.get('/verify-token/:token', verifyResetToken);

// Yeni şifre belirleme
router.post('/reset/:token', resetPassword);

// Email doğrulama talebi (giriş yapmış kullanıcılar için)
router.post('/request-verification', authenticateToken, requestEmailVerification);

// Email doğrulama
router.get('/verify-email/:token', verifyEmail);

// Token durumunu kontrol et
router.get('/check-token/:token', checkTokenStatus);

module.exports = router;



