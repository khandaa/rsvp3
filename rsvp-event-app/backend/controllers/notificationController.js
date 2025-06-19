const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get all notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const userId = req.query.userId;

  const whereClause = {};
  if (userId) {
    whereClause['$recipients.userId$'] = userId;
  }

  const { count, rows } = await db.Notification.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.NotificationRecipient,
        as: 'recipients',
      },
      {
        model: db.NotificationTemplate,
        as: 'template',
      }
    ],
    limit,
    offset: startIndex,
    order: [['createdAt', 'DESC']],
    distinct: true
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
 * @desc    Get single notification
 * @route   GET /api/notifications/:id
 * @access  Private
 */
exports.getNotification = asyncHandler(async (req, res, next) => {
  const notification = await db.Notification.findByPk(req.params.id, {
    include: [
      {
        model: db.NotificationRecipient,
        as: 'recipients',
        include: [
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      },
      {
        model: db.NotificationTemplate,
        as: 'template',
      }
    ],
  });

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});

/**
 * @desc    Create new notification
 * @route   POST /api/notifications
 * @access  Private
 */
exports.createNotification = asyncHandler(async (req, res, next) => {
  // First create the notification
  const notification = await db.Notification.create({
    subject: req.body.subject,
    content: req.body.content,
    type: req.body.type,
    status: req.body.status || 'pending',
    priority: req.body.priority || 'normal',
    templateId: req.body.templateId,
    metadata: req.body.metadata,
    createdBy: req.user.id,
  });

  // Then create recipients if provided
  if (req.body.recipients && req.body.recipients.length > 0) {
    const recipients = req.body.recipients.map(recipient => ({
      notificationId: notification.id,
      userId: recipient.userId,
      email: recipient.email,
      status: 'pending',
      createdBy: req.user.id,
    }));

    await db.NotificationRecipient.bulkCreate(recipients);
  }

  // Fetch the full notification with recipients
  const createdNotification = await db.Notification.findByPk(notification.id, {
    include: [
      {
        model: db.NotificationRecipient,
        as: 'recipients',
      },
      {
        model: db.NotificationTemplate,
        as: 'template',
      }
    ],
  });

  res.status(201).json({
    success: true,
    data: createdNotification,
  });
});

/**
 * @desc    Update notification
 * @route   PUT /api/notifications/:id
 * @access  Private
 */
exports.updateNotification = asyncHandler(async (req, res, next) => {
  let notification = await db.Notification.findByPk(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id ${req.params.id}`, 404)
    );
  }

  notification = await notification.update({
    subject: req.body.subject || notification.subject,
    content: req.body.content || notification.content,
    type: req.body.type || notification.type,
    status: req.body.status || notification.status,
    priority: req.body.priority || notification.priority,
    templateId: req.body.templateId || notification.templateId,
    metadata: req.body.metadata || notification.metadata,
    updatedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: notification,
  });
});

/**
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private/Admin
 */
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await db.Notification.findByPk(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id ${req.params.id}`, 404)
    );
  }

  await notification.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Mark notification as read/unread for a recipient
 * @route   PUT /api/notifications/:id/status
 * @access  Private
 */
exports.updateNotificationStatus = asyncHandler(async (req, res, next) => {
  const notification = await db.Notification.findByPk(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id ${req.params.id}`, 404)
    );
  }

  const recipient = await db.NotificationRecipient.findOne({
    where: {
      notificationId: req.params.id,
      userId: req.user.id,
    },
  });

  if (!recipient) {
    return next(
      new ErrorResponse(`You are not a recipient of this notification`, 403)
    );
  }

  await recipient.update({
    status: req.body.status,
  });

  res.status(200).json({
    success: true,
    data: {
      id: recipient.id,
      status: recipient.status,
    },
  });
});

/**
 * @desc    Get notifications for the authenticated user
 * @route   GET /api/notifications/me
 * @access  Private
 */
exports.getMyNotifications = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const status = req.query.status;

  const whereClause = {
    '$recipients.userId$': req.user.id,
  };

  if (status) {
    whereClause['$recipients.status$'] = status;
  }

  const { count, rows } = await db.Notification.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.NotificationRecipient,
        as: 'recipients',
        where: {
          userId: req.user.id,
        },
      },
      {
        model: db.NotificationTemplate,
        as: 'template',
      }
    ],
    limit,
    offset: startIndex,
    order: [['createdAt', 'DESC']],
    distinct: true
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
