const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get all logistics items
 * @route   GET /api/logistics
 * @access  Private
 */
exports.getLogisticsItems = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const eventId = req.query.eventId;
  const type = req.query.type;
  const status = req.query.status;
  
  // Build where clause
  const whereClause = {};
  
  if (eventId) {
    whereClause.eventId = eventId;
  }
  
  if (type) {
    whereClause.type = type;
  }
  
  if (status) {
    whereClause.status = status;
  }

  const { count, rows } = await db.Logistics.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name', 'eventDate']
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
 * @desc    Get single logistics item
 * @route   GET /api/logistics/:id
 * @access  Private
 */
exports.getLogisticsItem = asyncHandler(async (req, res, next) => {
  const logisticsItem = await db.Logistics.findByPk(req.params.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name', 'eventDate']
      },
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
  });

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: logisticsItem,
  });
});

/**
 * @desc    Create new logistics item
 * @route   POST /api/logistics
 * @access  Private
 */
exports.createLogisticsItem = asyncHandler(async (req, res, next) => {
  // Create the logistics item
  const logisticsItem = await db.Logistics.create({
    eventId: req.body.eventId,
    type: req.body.type,
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    capacity: req.body.capacity,
    status: req.body.status || 'pending',
    provider: req.body.provider,
    contactInfo: req.body.contactInfo,
    cost: req.body.cost,
    notes: req.body.notes,
    metadata: req.body.metadata,
    createdBy: req.user.id,
  });

  // Associate guests if provided
  if (req.body.guestIds && Array.isArray(req.body.guestIds) && req.body.guestIds.length > 0) {
    await logisticsItem.setGuests(req.body.guestIds);
  }

  // Get the full logistics item with relationships
  const fullLogisticsItem = await db.Logistics.findByPk(logisticsItem.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name', 'eventDate']
      },
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
  });

  res.status(201).json({
    success: true,
    data: fullLogisticsItem,
  });
});

/**
 * @desc    Update logistics item
 * @route   PUT /api/logistics/:id
 * @access  Private
 */
exports.updateLogisticsItem = asyncHandler(async (req, res, next) => {
  let logisticsItem = await db.Logistics.findByPk(req.params.id);

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  // Update the logistics item
  logisticsItem = await logisticsItem.update({
    eventId: req.body.eventId || logisticsItem.eventId,
    type: req.body.type || logisticsItem.type,
    name: req.body.name || logisticsItem.name,
    description: req.body.description || logisticsItem.description,
    location: req.body.location || logisticsItem.location,
    startDate: req.body.startDate || logisticsItem.startDate,
    endDate: req.body.endDate || logisticsItem.endDate,
    capacity: req.body.capacity || logisticsItem.capacity,
    status: req.body.status || logisticsItem.status,
    provider: req.body.provider || logisticsItem.provider,
    contactInfo: req.body.contactInfo || logisticsItem.contactInfo,
    cost: req.body.cost || logisticsItem.cost,
    notes: req.body.notes || logisticsItem.notes,
    metadata: req.body.metadata || logisticsItem.metadata,
    updatedBy: req.user.id,
  });

  // Update associated guests if provided
  if (req.body.guestIds && Array.isArray(req.body.guestIds)) {
    await logisticsItem.setGuests(req.body.guestIds);
  }

  // Get the updated logistics item with relationships
  const updatedLogisticsItem = await db.Logistics.findByPk(logisticsItem.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name', 'eventDate']
      },
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedLogisticsItem,
  });
});

/**
 * @desc    Delete logistics item
 * @route   DELETE /api/logistics/:id
 * @access  Private
 */
exports.deleteLogisticsItem = asyncHandler(async (req, res, next) => {
  const logisticsItem = await db.Logistics.findByPk(req.params.id);

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  await logisticsItem.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Assign guests to logistics item
 * @route   POST /api/logistics/:id/assign
 * @access  Private
 */
exports.assignGuests = asyncHandler(async (req, res, next) => {
  const logisticsItem = await db.Logistics.findByPk(req.params.id);

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  // Check if logistics item has capacity
  const currentAssignedCount = await logisticsItem.countGuests();
  
  if (logisticsItem.capacity && currentAssignedCount >= logisticsItem.capacity) {
    return next(
      new ErrorResponse(`Logistics item has reached maximum capacity of ${logisticsItem.capacity}`, 400)
    );
  }

  if (!req.body.guestIds || !Array.isArray(req.body.guestIds) || req.body.guestIds.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of guest IDs', 400)
    );
  }

  // Check if adding these guests would exceed capacity
  if (logisticsItem.capacity && (currentAssignedCount + req.body.guestIds.length) > logisticsItem.capacity) {
    return next(
      new ErrorResponse(
        `Cannot assign ${req.body.guestIds.length} more guests. Would exceed capacity of ${logisticsItem.capacity}`,
        400
      )
    );
  }

  // Add guests to the logistics item
  await logisticsItem.addGuests(req.body.guestIds);

  // Get the updated logistics item with relationships
  const updatedLogisticsItem = await db.Logistics.findByPk(logisticsItem.id, {
    include: [
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedLogisticsItem,
  });
});

/**
 * @desc    Remove guests from logistics item
 * @route   POST /api/logistics/:id/remove
 * @access  Private
 */
exports.removeGuests = asyncHandler(async (req, res, next) => {
  const logisticsItem = await db.Logistics.findByPk(req.params.id);

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.body.guestIds || !Array.isArray(req.body.guestIds) || req.body.guestIds.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of guest IDs', 400)
    );
  }

  // Remove guests from the logistics item
  await logisticsItem.removeGuests(req.body.guestIds);

  // Get the updated logistics item with relationships
  const updatedLogisticsItem = await db.Logistics.findByPk(logisticsItem.id, {
    include: [
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedLogisticsItem,
  });
});

/**
 * @desc    Check in/out guests for a logistics item
 * @route   POST /api/logistics/:id/checkin
 * @access  Private
 */
exports.checkInOutGuests = asyncHandler(async (req, res, next) => {
  const logisticsItem = await db.Logistics.findByPk(req.params.id);

  if (!logisticsItem) {
    return next(
      new ErrorResponse(`Logistics item not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.body.guestIds || !Array.isArray(req.body.guestIds) || req.body.guestIds.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of guest IDs', 400)
    );
  }

  const action = req.body.action || 'checkin';
  const timestamp = new Date();
  
  // Get the logistics-guest join table
  const LogisticsGuest = db.sequelize.models.LogisticsGuest;
  
  // Process each guest
  for (const guestId of req.body.guestIds) {
    const logisticsGuest = await LogisticsGuest.findOne({
      where: {
        logisticsId: req.params.id,
        guestId
      }
    });
    
    if (logisticsGuest) {
      // Update the check-in/out status
      if (action === 'checkin') {
        await logisticsGuest.update({
          checkedIn: true,
          checkedInAt: timestamp,
          checkedInBy: req.user.id
        });
      } else if (action === 'checkout') {
        await logisticsGuest.update({
          checkedOut: true,
          checkedOutAt: timestamp,
          checkedOutBy: req.user.id
        });
      }
    } else {
      // If the guest is not assigned to this logistics item,
      // we'll assign them and check them in/out in one step
      const newLogisticsGuest = {
        logisticsId: req.params.id,
        guestId,
      };
      
      if (action === 'checkin') {
        newLogisticsGuest.checkedIn = true;
        newLogisticsGuest.checkedInAt = timestamp;
        newLogisticsGuest.checkedInBy = req.user.id;
      } else if (action === 'checkout') {
        newLogisticsGuest.checkedOut = true;
        newLogisticsGuest.checkedOutAt = timestamp;
        newLogisticsGuest.checkedOutBy = req.user.id;
      }
      
      await LogisticsGuest.create(newLogisticsGuest);
    }
  }

  // Get updated logistics item with check-in/out information
  const updatedLogisticsItem = await db.Logistics.findByPk(req.params.id, {
    include: [
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        through: {
          attributes: ['checkedIn', 'checkedInAt', 'checkedInBy', 'checkedOut', 'checkedOutAt', 'checkedOutBy']
        }
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedLogisticsItem,
  });
});
