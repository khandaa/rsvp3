const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { Event, Guest, RSVP, User, Venue } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all events
 * @route   GET /api/events
 * @access  Public
 */
exports.getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const queryOptions = {
    offset: startIndex,
    limit,
    include: [
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode']
      }
    ],
    order: [['date', 'ASC']]
  };

  // Filter by status if provided
  if (req.query.status) {
    queryOptions.where = { status: req.query.status };
  }

  // If not authenticated or not admin, only return published events
  if (!req.user || (req.user && !req.user.isAdmin)) {
    queryOptions.where = {
      ...queryOptions.where,
      status: 'published'
    };
  }

  // Search by name, description, location
  if (req.query.search) {
    const searchFilter = {
      [Op.or]: [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } }
      ]
    };
    queryOptions.where = {
      ...queryOptions.where,
      ...searchFilter
    };
  }

  const { count, rows: events } = await Event.findAndCountAll(queryOptions);

  // Pagination result
  const pagination = {};

  if (endIndex < count) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count,
    pagination,
    data: events
  });
});

/**
 * @desc    Get single event
 * @route   GET /api/events/:id
 * @access  Public
 */
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id, {
    include: [
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name', 'address', 'city', 'state', 'zipCode']
      }
    ]
  });

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if event is published or user is admin
  if (event.status !== 'published' && (!req.user || !req.user.isAdmin)) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Private/Admin
 */
exports.createEvent = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const event = await Event.create(req.body);

  res.status(201).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Private/Admin
 */
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Add user to req.body
  req.body.updatedBy = req.user.id;

  event = await event.update(req.body);

  res.status(200).json({
    success: true,
    data: event
  });
});

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Private/Admin
 */
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Delete the event and its associations
  await event.destroy();

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Add guests to event
 * @route   POST /api/events/:id/guests
 * @access  Private/Admin
 */
exports.addGuests = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  const { guests } = req.body;
  const addedGuests = [];

  for (const guestData of guests) {
    // Check if guest already exists
    let guest = await Guest.findOne({
      where: {
        email: guestData.email
      }
    });

    // If guest doesn't exist, create a new one
    if (!guest) {
      guest = await Guest.create({
        ...guestData,
        createdBy: req.user.id
      });
    }

    // Associate guest with event
    await event.addGuest(guest);
    addedGuests.push(guest);
  }

  res.status(200).json({
    success: true,
    count: addedGuests.length,
    data: addedGuests
  });
});

/**
 * @desc    Get event guests
 * @route   GET /api/events/:id/guests
 * @access  Private/Admin
 */
exports.getEventGuests = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  const guests = await event.getGuests({
    include: [
      {
        model: RSVP,
        as: 'rsvps',
        where: { eventId: req.params.id },
        required: false
      }
    ]
  });

  res.status(200).json({
    success: true,
    count: guests.length,
    data: guests
  });
});

/**
 * @desc    Submit RSVP for event
 * @route   POST /api/events/:id/rsvp
 * @access  Public
 */
exports.submitRSVP = asyncHandler(async (req, res, next) => {
  const { guestId, status, additionalGuests, dietaryRestrictions, notes } = req.body;

  // Check if event exists
  const event = await Event.findByPk(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if guest exists
  const guest = await Guest.findByPk(guestId);
  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${guestId}`, 404)
    );
  }

  // Create or update RSVP
  const [rsvp, created] = await RSVP.findOrCreate({
    where: {
      eventId: req.params.id,
      guestId
    },
    defaults: {
      status,
      additionalGuests: additionalGuests || 0,
      dietaryRestrictions: dietaryRestrictions || '',
      notes: notes || ''
    }
  });

  // If RSVP already exists, update it
  if (!created) {
    await rsvp.update({
      status,
      additionalGuests: additionalGuests || 0,
      dietaryRestrictions: dietaryRestrictions || '',
      notes: notes || ''
    });
  }

  res.status(200).json({
    success: true,
    data: rsvp
  });
});

/**
 * @desc    Get RSVP statistics for event
 * @route   GET /api/events/:id/rsvp-stats
 * @access  Private/Admin
 */
exports.getRSVPStats = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  const stats = await RSVP.findAll({
    where: { eventId: req.params.id },
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      [sequelize.fn('SUM', sequelize.col('additionalGuests')), 'additionalGuests']
    ],
    group: ['status']
  });

  // Format stats
  const formattedStats = {
    attending: 0,
    not_attending: 0,
    pending: 0,
    additionalGuests: 0
  };

  stats.forEach(stat => {
    const { status, count, additionalGuests } = stat.dataValues;
    formattedStats[status] = count;
    if (status === 'attending') {
      formattedStats.additionalGuests = additionalGuests || 0;
    }
  });

  // Get total invited guests
  const totalInvited = await event.countGuests();
  formattedStats.totalInvited = totalInvited;
  formattedStats.totalAttending = formattedStats.attending + formattedStats.additionalGuests;

  res.status(200).json({
    success: true,
    data: formattedStats
  });
});

/**
 * @desc    Upload event image
 * @route   PUT /api/events/:id/image
 * @access  Private/Admin
 */
exports.uploadEventImage = asyncHandler(async (req, res, next) => {
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Update event with image path
  await event.update({
    imagePath: req.file.path,
    updatedBy: req.user.id
  });

  res.status(200).json({
    success: true,
    data: {
      imagePath: event.imagePath
    }
  });
});
