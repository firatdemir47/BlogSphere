const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Email doğrulama gönderme
  async sendVerificationEmail(userEmail, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    // Test modu - email göndermeyi atla
    console.log('Email doğrulama linki:', verificationUrl);
    return true;
    
    const mailOptions = {
      from: `"BlogSphere" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'BlogSphere - Email Doğrulama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">BlogSphere'e Hoş Geldiniz!</h2>
          <p>Hesabınızı doğrulamak için aşağıdaki butona tıklayın:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Email Adresimi Doğrula
          </a>
          <p>Bu link 24 saat geçerlidir.</p>
          <p>Eğer bu email'i siz talep etmediyseniz, lütfen dikkate almayın.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email gönderme hatası:', error);
      return false;
    }
  }

  // Şifre sıfırlama email'i
  async sendPasswordResetEmail(userEmail, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    // Test modu - email göndermeyi atla
    console.log('Şifre sıfırlama linki:', resetUrl);
    return true;
    
    const mailOptions = {
      from: `"BlogSphere" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: 'BlogSphere - Şifre Sıfırlama',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Şifre Sıfırlama Talebi</h2>
          <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Şifremi Sıfırla
          </a>
          <p>Bu link 1 saat geçerlidir.</p>
          <p>Eğer bu email'i siz talep etmediyseniz, lütfen dikkate almayın.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Şifre sıfırlama email hatası:', error);
      return false;
    }
  }

  // Yeni yorum bildirimi
  async sendCommentNotification(blogAuthorEmail, commentAuthorName, blogTitle, commentContent) {
    const mailOptions = {
      from: `"BlogSphere" <${process.env.SMTP_USER}>`,
      to: blogAuthorEmail,
      subject: `BlogSphere - Yeni Yorum: ${blogTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Yeni Yorum!</h2>
          <p><strong>${commentAuthorName}</strong> blog yazınıza yorum yaptı:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0; font-style: italic;">"${commentContent}"</p>
          </div>
          <p>Blog: <strong>${blogTitle}</strong></p>
          <a href="${process.env.FRONTEND_URL}" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Yorumu Görüntüle
          </a>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Yorum bildirimi email hatası:', error);
      return false;
    }
  }

  // Genel email gönderme
  async sendEmail(to, subject, htmlContent) {
    const mailOptions = {
      from: `"BlogSphere" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: htmlContent
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Genel email gönderme hatası:', error);
      return false;
    }
  }

  // Email template'leri
  getEmailTemplates() {
    return {
      welcome: (userName) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">BlogSphere'e Hoş Geldiniz, ${userName}!</h2>
          <p>Blog yazılarınızı paylaşmaya başlayabilirsiniz.</p>
        </div>
      `,
      
      blogPublished: (userName, blogTitle) => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Blog Yazınız Yayınlandı!</h2>
          <p>Merhaba ${userName},</p>
          <p>"${blogTitle}" başlıklı blog yazınız başarıyla yayınlandı.</p>
        </div>
      `
    };
  }
}

module.exports = new EmailService();
