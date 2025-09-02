const passwordResetService = require('../services/passwordResetService');

// Şifre sıfırlama talebi
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi gerekli'
      });
    }

    const result = await passwordResetService.requestPasswordReset(email);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Şifre sıfırlama token doğrulama
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const result = await passwordResetService.verifyResetToken(token);

    res.json({
      success: true,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Yeni şifre belirleme
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifre ve şifre tekrarı gerekli'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Şifreler eşleşmiyor'
      });
    }

    const result = await passwordResetService.resetPassword(token, password);

    res.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Email doğrulama talebi
const requestEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const userId = req.user.userId;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email adresi gerekli'
      });
    }

    const result = await passwordResetService.requestEmailVerification(userId, email);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Email doğrulama
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const result = await passwordResetService.verifyEmail(token);

    res.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Token durumunu kontrol et
const checkTokenStatus = async (req, res) => {
  try {
    const { token } = req.params;
    const { type } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const result = await passwordResetService.checkTokenStatus(token, type);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  requestEmailVerification,
  verifyEmail,
  checkTokenStatus
};



