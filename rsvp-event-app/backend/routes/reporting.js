const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/reportingController');
const { protect, authorize } = require('../middleware/auth');
const { param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Use authentication middleware for all routes
router.use(protect);

// Get RSVP statistics for an event
router.get('/events/:id/rsvp-stats', [
  param('id').isUUID().withMessage('Invalid event ID'),
  validationHandler
], reportingController.getRsvpStats);

// Get attendance tracking for an event
router.get('/events/:id/attendance', [
  param('id').isUUID().withMessage('Invalid event ID'),
  validationHandler
], reportingController.getAttendanceTracking);

// Get demographic statistics for an event
router.get('/events/:id/demographics', [
  param('id').isUUID().withMessage('Invalid event ID'),
  validationHandler
], reportingController.getDemographics);

// Compare multiple events
router.get('/events/compare', [
  query('eventIds').isArray().withMessage('Event IDs must be an array'),
  query('eventIds.*').isUUID().withMessage('All event IDs must be valid UUIDs'),
  validationHandler
], reportingController.compareEvents);

module.exports = router;
