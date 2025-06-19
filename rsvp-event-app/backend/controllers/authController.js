const { User, Role } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { generateJwtToken, generateSecureToken } = require('../utils/tokenGenerator');
const { sendEmail } = require('../utils/email');
const logger = require('../utils/logger');

/**
 * @desc    Register user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone, roleId } = req.body;

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone,
    roleId: roleId || 2, // Default to 'user' role
  });

  // Generate email verification token
  const verificationToken = generateSecureToken(user, 'verify-email');
  
  // Send verification email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      templateVars: {
        name: user.firstName,
        verificationUrl: `${process.env.APP_URL}/verify-email?token=${verificationToken}`,
      },
    });
  } catch (error) {
    logger.error('Error sending verification email:', error);
    // Don't fail the request if email sending fails
  }

  // Generate JWT token
  const token = generateJwtToken({ id: user.id });

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      roleId: user.roleId,
    },
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: ['id', 'name', 'permissions'],
      },
    ],
  });

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated', 401));
  }

  // Generate token
  const token = generateJwtToken({ id: user.id });

  // Remove sensitive data
  user.password = undefined;

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    },
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
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
 * @desc    Update user details
 * @route   PUT /api/v1/auth/updatedetails
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
  };

  const user = await User.findByPk(req.user.id);

  // Check if email is being updated and if it's already in use
  if (fieldsToUpdate.email && fieldsToUpdate.email !== user.email) {
    const existingUser = await User.findOne({ where: { email: fieldsToUpdate.email } });
    if (existingUser) {
      return next(new ErrorResponse('Email already in use', 400));
    }
    
    // Generate email verification token
    const verificationToken = generateSecureToken(user, 'verify-email');
    
    // Send verification email
    try {
      await sendEmail({
        to: fieldsToUpdate.email,
        subject: 'Verify Your New Email Address',
        template: 'email-verification',
        templateVars: {
          name: user.firstName,
          verificationUrl: `${process.env.APP_URL}/verify-email?token=${verificationToken}`,
        },
      });
      
      // Reset email verification status
      fieldsToUpdate.isEmailVerified = false;
    } catch (error) {
      logger.error('Error sending verification email:', error);
      return next(new ErrorResponse('Error sending verification email', 500));
    }
  }

  await user.update(fieldsToUpdate);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/v1/auth/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.user.id);

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  // Send password change notification email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Changed',
      template: 'password-changed',
      templateVars: {
        name: user.firstName,
      },
    });
  } catch (error) {
    logger.error('Error sending password change notification:', error);
    // Don't fail the request if email sending fails
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 404));
  }

  // Generate reset token
  const resetToken = generateSecureToken(user, 'reset-password');
  
  // Set reset token and expiry
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      templateVars: {
        name: user.firstName,
        resetUrl,
        expiresIn: '10 minutes',
      },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Email sent' },
    });
  } catch (error) {
    logger.error('Error sending password reset email:', error);
    
    // Reset the token if email fails to send
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

/**
 * @desc    Reset password
 * @route   PUT /api/v1/auth/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token or token has expired', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  
  await user.save();

  // Send confirmation email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Successful',
      template: 'password-reset-success',
      templateVars: {
        name: user.firstName,
      },
    });
  } catch (error) {
    logger.error('Error sending password reset confirmation:', error);
    // Don't fail the request if email sending fails
  }

  res.status(200).json({
    success: true,
    data: { message: 'Password reset successful' },
  });
});

/**
 * @desc    Verify email
 * @route   GET /api/v1/auth/verifyemail/:token
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Verify token
  const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);

  if (decoded.type !== 'verify-email') {
    return next(new ErrorResponse('Invalid token', 400));
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  if (user.isEmailVerified) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  }

  user.isEmailVerified = true;
  await user.save();

  // Send welcome email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Email Verified Successfully',
      template: 'email-verified',
      templateVars: {
        name: user.firstName,
        loginUrl: `${process.env.FRONTEND_URL}/login`,
      },
    });
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    // Don't fail the request if email sending fails
  }

  res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
});

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/v1/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  // In a stateless JWT system, the client should delete the token
  // This endpoint is provided for consistency with traditional session-based auth
  res.status(200).json({
    success: true,
    data: {},
  });
});
