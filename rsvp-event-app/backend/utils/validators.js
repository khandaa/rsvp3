const { body, param, query, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Event, Guest, Role } = require('../models');
const ErrorResponse = require('./errorResponse');

// Common validation chains
const emailValidator = body('email')
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage('Please provide a valid email address');

const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[^a-zA-Z0-9]/)
  .withMessage('Password must contain at least one special character');

const phoneValidator = body('phone')
  .optional({ checkFalsy: true })
  .trim()
  .matches(/^[0-9\-\+\(\)\s]+$/)
  .withMessage('Please provide a valid phone number');

// Common validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  
  return next(new ErrorResponse('Validation failed', 400, extractedErrors));
};

// Authentication validators
const registerValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  emailValidator.custom(async (email) => {
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error('Email already in use');
    }
    return true;
  }),
  passwordValidator,
  phoneValidator,
  body('roleId')
    .optional()
    .isInt()
    .withMessage('Role ID must be an integer')
    .custom(async (roleId) => {
      const role = await Role.findByPk(roleId);
      if (!role) {
        throw new Error('Invalid role ID');
      }
      return true;
    }),
  validate,
];

const loginValidator = [
  emailValidator,
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const forgotPasswordValidator = [emailValidator, validate];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Token is required'),
  passwordValidator,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  validate,
];

// Event validators
const eventValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Event name is required')
    .isLength({ max: 100 })
    .withMessage('Event name cannot be longer than 100 characters'),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot be longer than 1000 characters'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date()) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be a positive integer'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  body('requiresApproval')
    .optional()
    .isBoolean()
    .withMessage('requiresApproval must be a boolean'),
  validate,
];

// Guest validators
const guestValidator = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  emailValidator,
  phoneValidator,
  body('plusOnesAllowed')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Plus ones allowed must be a non-negative integer'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('customFields')
    .optional()
    .isObject()
    .withMessage('Custom fields must be an object'),
  validate,
];

// RSVP validators
const rsvpValidator = [
  body('eventId')
    .isInt()
    .withMessage('Event ID must be an integer')
    .custom(async (eventId) => {
      const event = await Event.findByPk(eventId);
      if (!event) {
        throw new Error('Event not found');
      }
      return true;
    }),
  body('guestId')
    .isInt()
    .withMessage('Guest ID must be an integer')
    .custom(async (guestId) => {
      const guest = await Guest.findByPk(guestId);
      if (!guest) {
        throw new Error('Guest not found');
      }
      return true;
    }),
  body('status')
    .isIn(['attending', 'not_attending', 'maybe'])
    .withMessage('Invalid RSVP status'),
  body('numberOfGuests')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Number of guests must be a positive integer'),
  body('dietaryRestrictions')
    .optional()
    .isString()
    .withMessage('Dietary restrictions must be a string'),
  body('specialRequirements')
    .optional()
    .isString()
    .withMessage('Special requirements must be a string'),
  validate,
];

// ID parameter validator
const idParamValidator = [
  param('id')
    .isInt()
    .withMessage('ID must be an integer')
    .toInt(),
  validate,
];

// Search validators
const searchValidator = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Search query must be at least 2 characters long'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
  query('order')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Order must be either ASC or DESC'),
  validate,
];

module.exports = {
  // Common
  validate,
  emailValidator,
  passwordValidator,
  phoneValidator,
  
  // Authentication
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  
  // Events
  eventValidator,
  
  // Guests
  guestValidator,
  
  // RSVPs
  rsvpValidator,
  
  // Parameters
  idParamValidator,
  
  // Search
  searchValidator,
  
  // Custom validators
  custom: {
    /**
     * Check if a value is unique in the database
     * @param {string} model - Sequelize model name
     * @param {string} field - Field to check
     * @param {string} [message] - Custom error message
     * @returns {Function} - Express validator function
     */
    isUnique: (model, field, message) => {
      return async (value, { req }) => {
        const Model = require(`../models/${model}`);
        const condition = { [field]: value };
        
        // For updates, exclude the current record
        if (req.method === 'PUT' || req.method === 'PATCH') {
          condition.id = { [Op.ne]: req.params.id };
        }
        
        const record = await Model.findOne({ where: condition });
        
        if (record) {
          throw new Error(message || `${field} is already in use`);
        }
        
        return true;
      };
    },
    
    /**
     * Check if a record exists in the database
     * @param {string} model - Sequelize model name
     * @param {string} field - Field to check
     * @param {string} [message] - Custom error message
     * @returns {Function} - Express validator function
     */
    exists: (model, field, message) => {
      return async (value) => {
        const Model = require(`../models/${model}`);
        const record = await Model.findOne({ where: { [field]: value } });
        
        if (!record) {
          throw new Error(message || `${field} not found`);
        }
        
        return true;
      };
    },
  },
};
