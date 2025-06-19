const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Use authentication middleware for all routes
router.use(protect);

// Public venue routes (available to all authenticated users)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('name').optional().trim(),
  query('city').optional().trim(),
  query('capacity').optional().isInt({ min: 1 }).toInt(),
  validationHandler
], venueController.getVenues);

router.get('/available', [
  query('startDate').isDate().withMessage('Valid start date is required'),
  query('endDate').isDate().withMessage('Valid end date is required'),
  query('capacity').optional().isInt({ min: 1 }).toInt(),
  validationHandler
], venueController.getAvailableVenues);

router.get('/:id', [
  param('id').isUUID().withMessage('Invalid venue ID'),
  validationHandler
], venueController.getVenue);

// Admin only routes
router.use(authorize('admin'));

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('amenities').optional().isArray(),
  body('contactName').optional().trim(),
  body('contactEmail').optional().isEmail().withMessage('Valid email is required'),
  body('contactPhone').optional().trim(),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Valid status is required'),
  body('description').optional().trim(),
  body('websiteUrl').optional().isURL().withMessage('Valid URL is required'),
  validationHandler
], venueController.createVenue);

router.put('/:id', [
  param('id').isUUID().withMessage('Invalid venue ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('address').optional().trim().notEmpty().withMessage('Address cannot be empty'),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
  body('postalCode').optional().trim().notEmpty().withMessage('Postal code cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Valid capacity is required'),
  body('amenities').optional().isArray(),
  body('contactName').optional().trim(),
  body('contactEmail').optional().isEmail().withMessage('Valid email is required'),
  body('contactPhone').optional().trim(),
  body('status').optional().isIn(['active', 'inactive', 'maintenance']).withMessage('Valid status is required'),
  body('description').optional().trim(),
  body('websiteUrl').optional().isURL().withMessage('Valid URL is required'),
  validationHandler
], venueController.updateVenue);

router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid venue ID'),
  validationHandler
], venueController.deleteVenue);

module.exports = router;
