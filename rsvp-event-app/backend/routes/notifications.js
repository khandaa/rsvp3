const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const notificationTemplateController = require('../controllers/notificationTemplateController');
const { protect, authorize } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { validationHandler } = require('../middleware/validation');

// Use authentication middleware for all routes
router.use(protect);

// Notification Routes
router.route('/')
  .get([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('userId').optional().isUUID(),
    validationHandler
  ], notificationController.getNotifications)
  .post([
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('type').isIn(['email', 'sms', 'push', 'in-app']).withMessage('Valid notification type is required'),
    body('status').optional().isIn(['pending', 'sent', 'failed', 'cancelled']).withMessage('Valid status is required'),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Valid priority is required'),
    body('templateId').optional().isUUID().withMessage('Valid template ID is required'),
    body('recipients').optional().isArray().withMessage('Recipients must be an array'),
    body('recipients.*.userId').optional().isUUID().withMessage('Valid user ID is required'),
    body('recipients.*.email').optional().isEmail().withMessage('Valid email is required'),
    validationHandler
  ], notificationController.createNotification);

router.route('/me')
  .get([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('status').optional().isIn(['pending', 'sent', 'read', 'failed']),
    validationHandler
  ], notificationController.getMyNotifications);

router.route('/:id')
  .get([
    param('id').isUUID().withMessage('Invalid notification ID'),
    validationHandler
  ], notificationController.getNotification)
  .put([
    param('id').isUUID().withMessage('Invalid notification ID'),
    body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('type').optional().isIn(['email', 'sms', 'push', 'in-app']).withMessage('Valid notification type is required'),
    body('status').optional().isIn(['pending', 'sent', 'failed', 'cancelled']).withMessage('Valid status is required'),
    body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('Valid priority is required'),
    body('templateId').optional().isUUID().withMessage('Valid template ID is required'),
    validationHandler
  ], notificationController.updateNotification)
  .delete([
    param('id').isUUID().withMessage('Invalid notification ID'),
    validationHandler
  ], authorize('admin'), notificationController.deleteNotification);

router.route('/:id/status')
  .put([
    param('id').isUUID().withMessage('Invalid notification ID'),
    body('status').isIn(['read', 'unread']).withMessage('Valid status is required'),
    validationHandler
  ], notificationController.updateNotificationStatus);

// Notification Template Routes
router.route('/templates')
  .get([
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('name').optional().trim(),
    query('type').optional().isIn(['email', 'sms', 'push', 'in-app']),
    validationHandler
  ], notificationTemplateController.getNotificationTemplates)
  .post([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('type').isIn(['email', 'sms', 'push', 'in-app']).withMessage('Valid template type is required'),
    body('variables').optional().isArray().withMessage('Variables must be an array'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Valid status is required'),
    validationHandler
  ], authorize('admin'), notificationTemplateController.createNotificationTemplate);

router.route('/templates/:id')
  .get([
    param('id').isUUID().withMessage('Invalid template ID'),
    validationHandler
  ], notificationTemplateController.getNotificationTemplate)
  .put([
    param('id').isUUID().withMessage('Invalid template ID'),
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
    body('content').optional().trim().notEmpty().withMessage('Content cannot be empty'),
    body('type').optional().isIn(['email', 'sms', 'push', 'in-app']).withMessage('Valid template type is required'),
    body('variables').optional().isArray().withMessage('Variables must be an array'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Valid status is required'),
    validationHandler
  ], authorize('admin'), notificationTemplateController.updateNotificationTemplate)
  .delete([
    param('id').isUUID().withMessage('Invalid template ID'),
    validationHandler
  ], authorize('admin'), notificationTemplateController.deleteNotificationTemplate);

router.route('/templates/:id/preview')
  .post([
    param('id').isUUID().withMessage('Invalid template ID'),
    body('testData').optional().isObject().withMessage('Test data must be an object'),
    validationHandler
  ], notificationTemplateController.previewTemplate);

module.exports = router;
