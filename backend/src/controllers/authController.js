const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const otpService = require('../services/otpService');

const VALID_ROLES = ['inventory_manager', 'warehouse_staff'];

const authController = {
  /**
   * User registration
   */
  async signup(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
      }

      const assignedRole = role && VALID_ROLES.includes(role) ? role : 'warehouse_staff';

      const existingUser = await User.findByEmail(email.toLowerCase().trim());
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        name,
        email: email.toLowerCase().trim(),
        password_hash,
        role: assignedRole
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * User login
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
      );

      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Request password reset OTP
   */
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required.' });
      }

      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        // Return friendly message without leaking account existence
        return res.status(200).json({
          message: 'If the email is registered, a password reset OTP has been sent.'
        });
      }

      const otp = await otpService.generateOTP(user.email);

      return res.status(200).json({
        message: 'Password reset OTP sent successfully.',
        // Included for easy local demonstration/testing
        otp
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reset password with OTP
   */
  async resetPassword(req, res, next) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and newPassword are required.' });
      }

      const isValid = await otpService.verifyOTP(email.toLowerCase().trim(), otp);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP code.' });
      }

      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(newPassword, salt);

      await User.updatePassword(user.id, password_hash);

      return res.status(200).json({
        message: 'Password has been reset successfully. You can now login with your new password.'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get authenticated user profile
   */
  async me(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
