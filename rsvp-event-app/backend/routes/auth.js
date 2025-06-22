const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../utils/validators');

// Public routes
router.post('/register', registerValidator, authController.register);
router.post('/login', loginValidator, authController.login);

// Test login route with no validation (for troubleshooting)
router.post('/login-test', authController.login);

router.post('/forgotpassword', forgotPasswordValidator, authController.forgotPassword);
router.put('/resetpassword/:resettoken', resetPasswordValidator, authController.resetPassword);
router.get('/verifyemail/:token', authController.verifyEmail);

// Protected routes (require authentication)
router.use(protect);

router.get('/me', authController.getMe);
router.put('/updatedetails', authController.updateDetails);
router.put('/updatepassword', authController.updatePassword);
router.get('/logout', authController.logout);

module.exports = router;
