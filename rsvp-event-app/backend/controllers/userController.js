const { User, Role } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');

/**
 * @desc    Get all users
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search, role, status } = req.query;
  const offset = (page - 1) * limit;
  
  // Build where clause
  const where = {};
  
  // Search by name or email
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  // Filter by role
  if (role) {
    where.roleId = role;
  }
  
  // Filter by status
  if (status) {
    where.isActive = status === 'active';
  }
  
  const { count, rows: users } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name'],
      },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [['createdAt', 'DESC']],
  });

  // Calculate pagination
  const totalPages = Math.ceil(count / limit);
  const pagination = {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    data: users,
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions'],
      },
    ],
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user
 * @route   POST /api/v1/users
 * @access  Private/Admin
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const { email, roleId } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return next(new ErrorResponse('Email already in use', 400));
  }

  // Check if role exists
  const role = await Role.findByPk(roleId);
  if (!role) {
    return next(new ErrorResponse(`Role not found with id of ${roleId}`, 404));
  }

  // Create user
  const user = await User.create({
    ...req.body,
    isEmailVerified: true, // Admin created users are auto-verified
  });

  // Send welcome email with temporary password if password was generated
  if (req.body.sendWelcomeEmail) {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Account Has Been Created',
        template: 'account-created',
        templateVars: {
          name: user.firstName,
          email: user.email,
          password: req.body.password, // This is only for the email template
          loginUrl: `${process.env.FRONTEND_URL}/login`,
        },
      });
    } catch (error) {
      logger.error('Error sending welcome email:', error);
      // Don't fail the request if email sending fails
    }
  }

  // Remove password from response
  const userData = user.get({ plain: true });
  delete userData.password;

  res.status(201).json({
    success: true,
    data: userData,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/v1/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { email, roleId } = req.body;
  const userId = req.params.id;

  // Find user
  let user = await User.findByPk(userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }

  // Check if email is being updated and if it's already in use
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  // Check if role exists
  if (roleId && roleId !== user.roleId) {
    const role = await Role.findByPk(roleId);
    if (!role) {
      return next(new ErrorResponse(`Role not found with id of ${roleId}`, 404));
    }
  }

  // Update user
  await user.update(req.body);

  // If password is being updated, hash it
  if (req.body.password) {
    user.password = req.body.password;
    await user.save();
  }

  // Remove password from response
  const userData = user.get({ plain: true });
  delete userData.password;

  res.status(200).json({
    success: true,
    data: userData,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Prevent deleting self
  if (req.user.id === userId) {
    return next(new ErrorResponse('You cannot delete your own account', 400));
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404));
  }

  // Soft delete the user
  await user.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Toggle user active status
 * @route   PUT /api/v1/users/:id/toggle-active
 * @access  Private/Admin
 */
exports.toggleUserActive = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;

  // Prevent deactivating self
  if (req.user.id === userId) {
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

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions'],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/v1/users/me
 * @access  Private
 */
exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);

  // Check if email is being updated
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse('Email already in use', 400));
    }
    
    // If changing email, require password verification
    if (!currentPassword) {
      return next(new ErrorResponse('Please provide your current password to change email', 400));
    }
    
    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }
    
    // Update email and mark as unverified
    user.email = email;
    user.isEmailVerified = false;
    
    // Generate verification token
    const verificationToken = generateSecureToken(user, 'verify-email');
    
    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify Your New Email Address',
        template: 'email-verification',
        templateVars: {
          name: user.firstName,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`,
        },
      });
    } catch (error) {
      logger.error('Error sending verification email:', error);
      return next(new ErrorResponse('Error sending verification email', 500));
    }
  }
  
  // Update password if provided
  if (newPassword) {
    if (!currentPassword) {
      return next(new ErrorResponse('Please provide your current password', 400));
    }
    
    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }
    
    user.password = newPassword;
  }
  
  // Update other fields
  const { firstName, lastName, phone } = req.body;
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  
  await user.save();
  
  // Remove password from response
  const userData = user.get({ plain: true });
  delete userData.password;

  res.status(200).json({
    success: true,
    data: userData,
  });
});
