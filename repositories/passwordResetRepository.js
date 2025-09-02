const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// Password reset token oluşturma
const createPasswordResetToken = async (userId, email) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

  const query = `
    INSERT INTO password_reset_tokens (user_id, email, token, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      token = $3, 
      expires_at = $4, 
      created_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const result = await pool.query(query, [userId, email, token, expiresAt]);
  return result.rows[0];
};

// Password reset token doğrulama
const verifyPasswordResetToken = async (token) => {
  const query = `
    SELECT prt.*, u.email, u.username
    FROM password_reset_tokens prt
    JOIN users u ON prt.user_id = u.id
    WHERE prt.token = $1 AND prt.expires_at > CURRENT_TIMESTAMP
  `;

  const result = await pool.query(query, [token]);
  return result.rows[0];
};

// Password reset token silme
const deletePasswordResetToken = async (token) => {
  const query = 'DELETE FROM password_reset_tokens WHERE token = $1';
  await pool.query(query, [token]);
};

// Şifre güncelleme
const updatePassword = async (userId, newPasswordHash) => {
  const query = `
    UPDATE users 
    SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
    RETURNING id, username, email
  `;

  const result = await pool.query(query, [newPasswordHash, userId]);
  return result.rows[0];
};

// Email verification token oluşturma
const createEmailVerificationToken = async (userId, email) => {
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

  const query = `
    INSERT INTO email_verification_tokens (user_id, email, token, expires_at)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      token = $3, 
      expires_at = $4, 
      created_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const result = await pool.query(query, [userId, email, token, expiresAt]);
  return result.rows[0];
};

// Email verification token doğrulama
const verifyEmailVerificationToken = async (token) => {
  const query = `
    SELECT evt.*, u.email, u.username
    FROM email_verification_tokens evt
    JOIN users u ON evt.user_id = u.id
    WHERE evt.token = $1 AND evt.expires_at > CURRENT_TIMESTAMP
  `;

  const result = await pool.query(query, [token]);
  return result.rows[0];
};

// Email verification token silme
const deleteEmailVerificationToken = async (token) => {
  const query = 'DELETE FROM email_verification_tokens WHERE token = $1';
  await pool.query(query, [token]);
};

// Email doğrulama durumunu güncelleme
const markEmailAsVerified = async (userId) => {
  const query = `
    UPDATE users 
    SET is_verified = true, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, username, email, is_verified
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

module.exports = {
  createPasswordResetToken,
  verifyPasswordResetToken,
  deletePasswordResetToken,
  updatePassword,
  createEmailVerificationToken,
  verifyEmailVerificationToken,
  deleteEmailVerificationToken,
  markEmailAsVerified
};



