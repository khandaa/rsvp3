const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get all guest groups
 * @route   GET /api/guestgroups
 * @access  Private
 */
exports.getGuestGroups = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const eventId = req.query.eventId;
  const name = req.query.name;
  
  // Build where clause
  const whereClause = {};
  
  if (eventId) {
    whereClause.eventId = eventId;
  }
  
  if (name) {
    whereClause.name = { [Op.like]: `%${name}%` };
  }

  const { count, rows } = await db.GuestGroup.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name']
      },
      {
        model: db.Guest,
        as: 'guests',
        attributes: ['id', 'firstName', 'lastName', 'email'],
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
    limit,
    offset: startIndex,
    order: [['name', 'ASC']],
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
 * @desc    Get single guest group
 * @route   GET /api/guestgroups/:id
 * @access  Private
 */
exports.getGuestGroup = asyncHandler(async (req, res, next) => {
  const guestGroup = await db.GuestGroup.findByPk(req.params.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name', 'eventDate']
      },
      {
        model: db.Guest,
        as: 'guests',
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
  });

  if (!guestGroup) {
    return next(
      new ErrorResponse(`Guest group not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: guestGroup,
  });
});

/**
 * @desc    Create new guest group
 * @route   POST /api/guestgroups
 * @access  Private
 */
exports.createGuestGroup = asyncHandler(async (req, res, next) => {
  // Create the guest group
  const guestGroup = await db.GuestGroup.create({
    name: req.body.name,
    description: req.body.description,
    type: req.body.type,
    eventId: req.body.eventId,
    createdBy: req.user.id,
  });

  // Add guests to the group if provided
  if (req.body.guestIds && req.body.guestIds.length > 0) {
    await guestGroup.addGuests(req.body.guestIds);
  }

  // Get the full guest group with relationships
  const fullGuestGroup = await db.GuestGroup.findByPk(guestGroup.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name']
      },
      {
        model: db.Guest,
        as: 'guests',
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
  });

  res.status(201).json({
    success: true,
    data: fullGuestGroup,
  });
});

/**
 * @desc    Update guest group
 * @route   PUT /api/guestgroups/:id
 * @access  Private
 */
exports.updateGuestGroup = asyncHandler(async (req, res, next) => {
  let guestGroup = await db.GuestGroup.findByPk(req.params.id);

  if (!guestGroup) {
    return next(
      new ErrorResponse(`Guest group not found with id ${req.params.id}`, 404)
    );
  }

  // Update the guest group
  guestGroup = await guestGroup.update({
    name: req.body.name || guestGroup.name,
    description: req.body.description || guestGroup.description,
    type: req.body.type || guestGroup.type,
    eventId: req.body.eventId || guestGroup.eventId,
    updatedBy: req.user.id,
  });

  // Update guests in the group if provided
  if (req.body.guestIds) {
    // Remove all existing guests
    await guestGroup.setGuests([]);
    
    // Add new guests
    if (req.body.guestIds.length > 0) {
      await guestGroup.addGuests(req.body.guestIds);
    }
  }

  // Get the updated guest group with relationships
  const updatedGuestGroup = await db.GuestGroup.findByPk(guestGroup.id, {
    include: [
      {
        model: db.Event,
        as: 'event',
        attributes: ['id', 'name']
      },
      {
        model: db.Guest,
        as: 'guests',
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedGuestGroup,
  });
});

/**
 * @desc    Delete guest group
 * @route   DELETE /api/guestgroups/:id
 * @access  Private
 */
exports.deleteGuestGroup = asyncHandler(async (req, res, next) => {
  const guestGroup = await db.GuestGroup.findByPk(req.params.id);

  if (!guestGroup) {
    return next(
      new ErrorResponse(`Guest group not found with id ${req.params.id}`, 404)
    );
  }

  // Remove all guest associations before deleting
  await guestGroup.setGuests([]);
  
  // Delete the group
  await guestGroup.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Add guests to a group
 * @route   POST /api/guestgroups/:id/guests
 * @access  Private
 */
exports.addGuestsToGroup = asyncHandler(async (req, res, next) => {
  const guestGroup = await db.GuestGroup.findByPk(req.params.id);

  if (!guestGroup) {
    return next(
      new ErrorResponse(`Guest group not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.body.guestIds || !Array.isArray(req.body.guestIds) || req.body.guestIds.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of guest IDs', 400)
    );
  }

  // Add guests to the group
  await guestGroup.addGuests(req.body.guestIds);

  // Get the updated guest group with relationships
  const updatedGuestGroup = await db.GuestGroup.findByPk(guestGroup.id, {
    include: [
      {
        model: db.Guest,
        as: 'guests',
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedGuestGroup,
  });
});

/**
 * @desc    Remove guests from a group
 * @route   DELETE /api/guestgroups/:id/guests
 * @access  Private
 */
exports.removeGuestsFromGroup = asyncHandler(async (req, res, next) => {
  const guestGroup = await db.GuestGroup.findByPk(req.params.id);

  if (!guestGroup) {
    return next(
      new ErrorResponse(`Guest group not found with id ${req.params.id}`, 404)
    );
  }

  if (!req.body.guestIds || !Array.isArray(req.body.guestIds) || req.body.guestIds.length === 0) {
    return next(
      new ErrorResponse('Please provide an array of guest IDs', 400)
    );
  }

  // Remove guests from the group
  await guestGroup.removeGuests(req.body.guestIds);

  // Get the updated guest group with relationships
  const updatedGuestGroup = await db.GuestGroup.findByPk(guestGroup.id, {
    include: [
      {
        model: db.Guest,
        as: 'guests',
        through: { attributes: [] } // Exclude join table attributes
      }
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedGuestGroup,
  });
});
