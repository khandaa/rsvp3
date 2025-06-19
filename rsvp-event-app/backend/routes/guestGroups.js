const express = require('express');
const router = express.Router();
const guestGroupController = require('../controllers/guestGroupController');
const { protect, authorize } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Use authentication middleware for all routes
router.use(protect);

// GET all guest groups
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('eventId').optional().isUUID(),
  query('name').optional().trim(),
  validationHandler
], guestGroupController.getGuestGroups);

// GET single guest group
router.get('/:id', [
  param('id').isUUID().withMessage('Invalid guest group ID'),
  validationHandler
], guestGroupController.getGuestGroup);

// POST create new guest group
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('eventId').isUUID().withMessage('Valid event ID is required'),
  body('type').optional().isIn(['family', 'friends', 'colleagues', 'vip', 'performers', 'staff', 'other']).withMessage('Valid group type is required'),
  body('description').optional().trim(),
  body('guestIds').optional().isArray(),
  validationHandler
], guestGroupController.createGuestGroup);

// PUT update guest group
router.put('/:id', [
  param('id').isUUID().withMessage('Invalid guest group ID'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('eventId').optional().isUUID().withMessage('Valid event ID is required'),
  body('type').optional().isIn(['family', 'friends', 'colleagues', 'vip', 'performers', 'staff', 'other']).withMessage('Valid group type is required'),
  body('description').optional().trim(),
  body('guestIds').optional().isArray(),
  validationHandler
], guestGroupController.updateGuestGroup);

// DELETE guest group
router.delete('/:id', [
  param('id').isUUID().withMessage('Invalid guest group ID'),
  validationHandler
], guestGroupController.deleteGuestGroup);

// Add guests to group
router.post('/:id/guests', [
  param('id').isUUID().withMessage('Invalid guest group ID'),
  body('guestIds').isArray().withMessage('Guest IDs must be an array').notEmpty().withMessage('Guest IDs array cannot be empty'),
  validationHandler
], guestGroupController.addGuestsToGroup);

// Remove guests from group
router.delete('/:id/guests', [
  param('id').isUUID().withMessage('Invalid guest group ID'),
  body('guestIds').isArray().withMessage('Guest IDs must be an array').notEmpty().withMessage('Guest IDs array cannot be empty'),
  validationHandler
], guestGroupController.removeGuestsFromGroup);

module.exports = router;
