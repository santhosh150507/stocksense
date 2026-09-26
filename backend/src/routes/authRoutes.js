const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { requireFields } = require('../middleware/validateRequest');

// Public routes
router.post('/signup', requireFields(['name', 'email', 'password']), authController.signup);
router.post('/login', requireFields(['email', 'password']), authController.login);
router.post('/forgot-password', requireFields(['email']), authController.forgotPassword);
router.post('/reset-password', requireFields(['email', 'otp', 'newPassword']), authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.me);

module.exports = router;
