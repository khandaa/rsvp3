const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');
const { protect, authorize } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Use authentication middleware for all routes
router.use(protect);

// GET all logistics items
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('eventId').optional().isUUID(),
  query('type').optional().isIn(['accommodation', 'transportation', 'equipment', 'catering', 'venue', 'other']),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  validationHandler
], logisticsController.getLogisticsItems);

// GET single logistics item
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  validationHandler
], logisticsController.getLogisticsItem);

// POST create new logistics item
router.post('/', [
  body('eventId').isUUID().withMessage('Valid event ID is required'),
  body('type').isIn(['accommodation', 'transportation', 'equipment', 'catering', 'venue', 'other']).withMessage('Valid type is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location').optional().trim(),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('capacity').optional().isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  body('provider').optional().trim(),
  body('contactInfo').optional().isObject(),
  body('cost').optional().isNumeric(),
  body('notes').optional().trim(),
  body('metadata').optional().isObject(),
  body('guestIds').optional().isArray(),
  validationHandler
], logisticsController.createLogisticsItem);

// PUT update logistics item
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  body('eventId').optional().isUUID().withMessage('Valid event ID is required'),
  body('type').optional().isIn(['accommodation', 'transportation', 'equipment', 'catering', 'venue', 'other']).withMessage('Valid type is required'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('location').optional().trim(),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
  body('capacity').optional().isInt({ min: 1 }).toInt(),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  body('provider').optional().trim(),
  body('contactInfo').optional().isObject(),
  body('cost').optional().isNumeric(),
  body('notes').optional().trim(),
  body('metadata').optional().isObject(),
  body('guestIds').optional().isArray(),
  validationHandler
], logisticsController.updateLogisticsItem);

// DELETE logistics item
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  validationHandler
], logisticsController.deleteLogisticsItem);

// Assign guests to logistics item
router.post('/:id/assign', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  body('guestIds').isArray().withMessage('Guest IDs must be an array').notEmpty().withMessage('Guest IDs array cannot be empty'),
  validationHandler
], logisticsController.assignGuests);

// Remove guests from logistics item
router.post('/:id/remove', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  body('guestIds').isArray().withMessage('Guest IDs must be an array').notEmpty().withMessage('Guest IDs array cannot be empty'),
  validationHandler
], logisticsController.removeGuests);

// Check in/out guests for a logistics item
router.post('/:id/checkin', [
  param('id').isUUID().withMessage('Invalid logistics ID'),
  body('guestIds').isArray().withMessage('Guest IDs must be an array').notEmpty().withMessage('Guest IDs array cannot be empty'),
  body('action').isIn(['checkin', 'checkout']).withMessage('Action must be either "checkin" or "checkout"'),
  validationHandler
], logisticsController.checkInOutGuests);

module.exports = router;
