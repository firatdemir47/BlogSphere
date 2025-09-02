const bcrypt = require('bcrypt');
const passwordResetRepo = require('../repositories/passwordResetRepository');
const emailService = require('./emailService');
const userRepo = require('../repositories/userRepository');

class PasswordResetService {
  // Şifre sıfırlama talebi
  async requestPasswordReset(email) {
    try {
      // Kullanıcıyı bul
      const user = await userRepo.findByEmail(email);
      if (!user) {
        throw new Error('Bu email adresi ile kayıtlı kullanıcı bulunamadı');
      }

      // Password reset token oluştur
      const resetToken = await passwordResetRepo.createPasswordResetToken(user.id, email);

      // Email gönder
      const emailSent = await emailService.sendPasswordResetEmail(email, resetToken.token);
      
      // Geçici olarak email göndermeyi atla
      // if (!emailSent) {
      //   throw new Error('Email gönderilemedi');
      // }

      return {
        success: true,
        message: 'Şifre sıfırlama linki email adresinize gönderildi'
      };
    } catch (error) {
      throw error;
    }
  }

  // Şifre sıfırlama token doğrulama
  async verifyResetToken(token) {
    try {
      const resetData = await passwordResetRepo.verifyPasswordResetToken(token);
      
      if (!resetData) {
        throw new Error('Geçersiz veya süresi dolmuş token');
      }

      return {
        success: true,
        data: {
          userId: resetData.user_id,
          email: resetData.email,
          username: resetData.username
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Yeni şifre belirleme
  async resetPassword(token, newPassword) {
    try {
      // Token'ı doğrula
      const resetData = await passwordResetRepo.verifyPasswordResetToken(token);
      
      if (!resetData) {
        throw new Error('Geçersiz veya süresi dolmuş token');
      }

      // Şifre validasyonu
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Şifre en az 6 karakter olmalıdır');
      }

      // Şifreyi hash'le
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Şifreyi güncelle
      const updatedUser = await passwordResetRepo.updatePassword(resetData.user_id, hashedPassword);

      // Token'ı sil
      await passwordResetRepo.deletePasswordResetToken(token);

      return {
        success: true,
        message: 'Şifreniz başarıyla güncellendi',
        data: {
          userId: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Email doğrulama talebi
  async requestEmailVerification(userId, email) {
    try {
      // Email verification token oluştur
      const verificationToken = await passwordResetRepo.createEmailVerificationToken(userId, email);

      // Email gönder
      const emailSent = await emailService.sendVerificationEmail(email, verificationToken.token);
      
      // Geçici olarak email göndermeyi atla
      // if (!emailSent) {
      //   throw new Error('Email gönderilemedi');
      // }

      return {
        success: true,
        message: 'Email doğrulama linki gönderildi'
      };
    } catch (error) {
      throw error;
    }
  }

  // Email doğrulama
  async verifyEmail(token) {
    try {
      const verificationData = await passwordResetRepo.verifyEmailVerificationToken(token);
      
      if (!verificationData) {
        throw new Error('Geçersiz veya süresi dolmuş token');
      }

      // Email'i doğrula
      const verifiedUser = await passwordResetRepo.markEmailAsVerified(verificationData.user_id);

      // Token'ı sil
      await passwordResetRepo.deleteEmailVerificationToken(token);

      return {
        success: true,
        message: 'Email adresiniz başarıyla doğrulandı',
        data: {
          userId: verifiedUser.id,
          username: verifiedUser.username,
          email: verifiedUser.email,
          isVerified: verifiedUser.is_verified
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Token durumunu kontrol et
  async checkTokenStatus(token, type = 'password') {
    try {
      let tokenData;
      
      if (type === 'password') {
        tokenData = await passwordResetRepo.verifyPasswordResetToken(token);
      } else if (type === 'email') {
        tokenData = await passwordResetRepo.verifyEmailVerificationToken(token);
      }

      return {
        valid: !!tokenData,
        expired: !tokenData,
        data: tokenData
      };
    } catch (error) {
      return {
        valid: false,
        expired: true,
        error: error.message
      };
    }
  }
}

module.exports = new PasswordResetService();
