const db = require('../config/db');
const env = require('../config/env');

const otpService = {
  /**
   * Generate and store a 6-digit OTP code for password reset
   * @param {string} email
   * @returns {Promise<string>} The generated OTP code
   */
  async generateOTP(email) {
    // Generate a 6-digit random numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryMinutes = env.OTP_EXPIRY_MINUTES || 10;
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Invalidate prior unused OTPs for this email
    await db.query(`DELETE FROM otp_codes WHERE email = $1`, [email.toLowerCase().trim()]);

    // Insert new OTP record
    await db.query(
      `INSERT INTO otp_codes (email, code, expires_at) VALUES ($1, $2, $3)`,
      [email.toLowerCase().trim(), code, expiresAt]
    );

    console.log(`[OTP] Generated OTP ${code} for ${email} (valid for ${expiryMinutes} minutes)`);
    return code;
  },

  /**
   * Verify an OTP code for an email
   * @param {string} email
   * @param {string} code
   * @returns {Promise<boolean>}
   */
  async verifyOTP(email, code) {
    const query = `
      SELECT * FROM otp_codes
      WHERE email = $1 AND code = $2 AND expires_at > CURRENT_TIMESTAMP
      ORDER BY id DESC LIMIT 1;
    `;
    const res = await db.query(query, [email.toLowerCase().trim(), String(code).trim()]);

    if (res.rows.length === 0) {
      return false;
    }

    // Delete used OTP
    await db.query(`DELETE FROM otp_codes WHERE id = $1`, [res.rows[0].id]);
    return true;
  }
};

module.exports = otpService;
