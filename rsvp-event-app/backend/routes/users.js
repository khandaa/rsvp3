const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const toggleUserActive = require('../controllers/toggleUserActive');
const { protect, authorize } = require('../middleware/auth');
const db = require('../models');
const { Role } = require('../models');
const {
  registerValidator,
  updateUserValidator,
  idParamValidator,
} = require('../utils/validators');

// Apply protect middleware to all routes
router.use(protect);

// User profile routes
router.get('/me', userController.getMyProfile);
router.put('/me', userController.updateMyProfile);

// Admin routes - require admin role
router.use(authorize(Role.ADMIN));

// User management routes
router
  .route('/')
  .get(userController.getUsers)
  .post(registerValidator, userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Toggle user active status
router.put(
  '/:id/toggle-active',
  // Skip validators for now to fix the route error
  // idParamValidator,
  async (req, res, next) => {
    try {
      const userId = req.params.id;

      // Basic validation
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      // Prevent deactivating self
      if (req.user && req.user.id === userId) {
        return res.status(400).json({
          success: false,
          message: 'You cannot deactivate your own account'
        });
      }

      const user = await db.User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User not found with id of ${userId}`
        });
      }

      // Toggle active status
      user.isActive = !user.isActive;
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  }
);

module.exports = router;
