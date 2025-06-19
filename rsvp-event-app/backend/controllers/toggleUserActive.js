/**
 * Implementation for the missing toggleUserActive function in userController
 */
const { User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * @desc    Toggle user active status
 * @route   PUT /api/v1/users/:id/toggle-active
 * @access  Private/Admin
 */
const toggleUserActive = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Prevent deactivating self
  if (req.user && req.user.id === userId) {
    return next(new ErrorResponse('You cannot deactivate your own account', 400));
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
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
});

// Export directly as a function (not an object).
// This is critical - by exporting the function directly it can be used in router.put(...)
module.exports = toggleUserActive;
