const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../utils/fileUpload');
const { body, param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Public routes
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed', 'active']),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601(),
    query('upcoming').optional().isIn(['true', 'false']),
    query('past').optional().isIn(['true', 'false']),
    query('sort').optional().isIn(['name', 'startDate', 'endDate', 'createdAt']),
    query('order').optional().isIn(['ASC', 'DESC']),
  ],
  validationHandler,
  eventController.getEvents
);

router.get(
  '/:id',
  [param('id').isUUID()],
  validationHandler,
  eventController.getEvent
);

// Protected routes (require authentication)
router.use(protect);

// Event CRUD operations
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Event name is required'),
    body('description').optional().trim(),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate')
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('location').optional().trim(),
    body('isPublic').optional().isBoolean().toBoolean(),
    body('maxAttendees').optional().isInt({ min: 1 }),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'cancelled', 'completed'])
      .withMessage('Invalid status'),
    body('venue').optional().isObject(),
    body('venue.name').optional().trim(),
    body('venue.address').optional().trim(),
    body('venue.city').optional().trim(),
    body('venue.state').optional().trim(),
    body('venue.country').optional().trim(),
    body('venue.postalCode').optional().trim(),
    body('venue.latitude').optional().isFloat(),
    body('venue.longitude').optional().isFloat(),
  ],
  validationHandler,
  eventController.createEvent
);

router.put(
  '/:id',
  [
    param('id').isUUID(),
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('startDate')
      .optional()
      .isISO8601()
      .withMessage('Valid start date is required'),
    body('endDate')
      .optional()
      .isISO8601()
      .withMessage('Valid end date is required')
      .custom((value, { req }) => {
        if (req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    body('location').optional().trim(),
    body('isPublic').optional().isBoolean().toBoolean(),
    body('maxAttendees').optional().isInt({ min: 1 }),
    body('status')
      .optional()
      .isIn(['draft', 'published', 'cancelled', 'completed'])
      .withMessage('Invalid status'),
    body('venue').optional().isObject(),
    body('venue.name').optional().trim(),
    body('venue.address').optional().trim(),
    body('venue.city').optional().trim(),
    body('venue.state').optional().trim(),
    body('venue.country').optional().trim(),
    body('venue.postalCode').optional().trim(),
    body('venue.latitude').optional().isFloat(),
    body('venue.longitude').optional().isFloat(),
  ],
  validationHandler,
  eventController.updateEvent
);

router.delete(
  '/:id',
  [param('id').isUUID()],
  validationHandler,
  eventController.deleteEvent
);

// Event image upload
router.post(
  '/:id/image',
  [
    param('id').isUUID(),
    upload.single('image'),
    (req, res, next) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload an image file',
        });
      }
      next();
    },
  ],
  eventController.uploadEventImage
);

// Event guests management
router.get(
  '/:id/guests',
  [
    param('id').isUUID(),
    query('status')
      .optional()
      .isIn(['pending', 'attending', 'not_attending', 'maybe']),
    query('search').optional().trim(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  validationHandler,
  eventController.getEventGuests
);

router.post(
  '/:id/guests',
  [
    param('id').isUUID(),
    body('guests')
      .isArray({ min: 1 })
      .withMessage('At least one guest is required'),
    body('guests.*.firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required'),
    body('guests.*.lastName').optional().trim(),
    body('guests.*.email')
      .optional()
      .isEmail()
      .withMessage('Please include a valid email')
      .normalizeEmail(),
    body('guests.*.phone').optional().trim(),
    body('guests.*.notes').optional().trim(),
    body('sendInvitation').optional().isBoolean().toBoolean(),
    body('invitationMessage').optional().trim(),
  ],
  validationHandler,
  eventController.addGuests
);

// RSVP endpoints
router.post(
  '/:id/rsvp',
  [
    param('id').isUUID(),
    body('guestId').isUUID().withMessage('Guest ID is required'),
    body('status')
      .isIn(['attending', 'not_attending', 'maybe'])
      .withMessage('Valid RSVP status is required'),
    body('plusOnes')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Plus ones must be a non-negative number'),
    body('dietaryRestrictions').optional().trim(),
    body('specialRequirements').optional().trim(),
  ],
  validationHandler,
  eventController.submitRSVP
);

// Event statistics
router.get(
  '/:id/stats',
  [param('id').isUUID()],
  validationHandler,
  eventController.getRSVPStats
);

// Admin only routes
router.use(authorize('admin'));

router.get(
  '/admin/all',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']),
    query('userId').optional().isUUID(),
  ],
  validationHandler,
  eventController.getEvents
);

module.exports = router;
