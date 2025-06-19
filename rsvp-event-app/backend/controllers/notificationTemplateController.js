const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get all notification templates
 * @route   GET /api/notification-templates
 * @access  Private/Admin
 */
exports.getNotificationTemplates = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Search parameters
  const name = req.query.name;
  const type = req.query.type;
  
  // Build where clause
  const whereClause = {};
  if (name) {
    whereClause.name = { [Op.like]: `%${name}%` };
  }
  if (type) {
    whereClause.type = type;
  }

  // Execute query
  const { count, rows } = await db.NotificationTemplate.findAndCountAll({
    where: whereClause,
    limit,
    offset: startIndex,
    order: [['name', 'ASC']]
  });

  res.status(200).json({
    success: true,
    count,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
    data: rows,
  });
});

/**
 * @desc    Get single notification template
 * @route   GET /api/notification-templates/:id
 * @access  Private/Admin
 */
exports.getNotificationTemplate = asyncHandler(async (req, res, next) => {
  const template = await db.NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Notification template not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: template,
  });
});

/**
 * @desc    Create new notification template
 * @route   POST /api/notification-templates
 * @access  Private/Admin
 */
exports.createNotificationTemplate = asyncHandler(async (req, res, next) => {
  const template = await db.NotificationTemplate.create({
    name: req.body.name,
    subject: req.body.subject,
    content: req.body.content,
    type: req.body.type,
    variables: req.body.variables,
    description: req.body.description,
    status: req.body.status || 'active',
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: template,
  });
});

/**
 * @desc    Update notification template
 * @route   PUT /api/notification-templates/:id
 * @access  Private/Admin
 */
exports.updateNotificationTemplate = asyncHandler(async (req, res, next) => {
  let template = await db.NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Notification template not found with id ${req.params.id}`, 404)
    );
  }

  template = await template.update({
    name: req.body.name || template.name,
    subject: req.body.subject || template.subject,
    content: req.body.content || template.content,
    type: req.body.type || template.type,
    variables: req.body.variables || template.variables,
    description: req.body.description || template.description,
    status: req.body.status || template.status,
    updatedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: template,
  });
});

/**
 * @desc    Delete notification template
 * @route   DELETE /api/notification-templates/:id
 * @access  Private/Admin
 */
exports.deleteNotificationTemplate = asyncHandler(async (req, res, next) => {
  const template = await db.NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Notification template not found with id ${req.params.id}`, 404)
    );
  }

  // Check if template is associated with any notifications
  const associatedNotifications = await db.Notification.count({
    where: {
      templateId: req.params.id
    }
  });

  if (associatedNotifications > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete template as it is associated with ${associatedNotifications} notifications`,
        400
      )
    );
  }

  await template.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Preview notification template with test data
 * @route   POST /api/notification-templates/:id/preview
 * @access  Private/Admin
 */
exports.previewTemplate = asyncHandler(async (req, res, next) => {
  const template = await db.NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    return next(
      new ErrorResponse(`Notification template not found with id ${req.params.id}`, 404)
    );
  }

  // Get test data from request or use default placeholder data
  const testData = req.body.testData || {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    },
    event: {
      name: 'Sample Event',
      eventDate: new Date().toISOString().split('T')[0],
      location: 'Sample Venue'
    },
    rsvp: {
      status: 'attending',
      plusOnes: 2
    }
  };

  // Process template
  let subject = template.subject;
  let content = template.content;

  // Simple variable replacement (in production, use a proper template engine)
  Object.keys(testData).forEach(category => {
    Object.keys(testData[category]).forEach(key => {
      const placeholder = `{{${category}.${key}}}`;
      const value = testData[category][key];
      
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });
  });

  res.status(200).json({
    success: true,
    data: {
      subject,
      content,
      originalTemplate: template
    },
  });
});
