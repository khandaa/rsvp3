const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get all venues
 * @route   GET /api/venues
 * @access  Private
 */
exports.getVenues = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Search parameters
  const name = req.query.name;
  const city = req.query.city;
  const capacity = req.query.capacity;
  
  // Build where clause
  const whereClause = {};
  if (name) {
    whereClause.name = { [Op.like]: `%${name}%` };
  }
  if (city) {
    whereClause.city = { [Op.like]: `%${city}%` };
  }
  if (capacity) {
    whereClause.capacity = { [Op.gte]: capacity };
  }

  // Execute query
  const { count, rows } = await db.EventVenue.findAndCountAll({
    where: whereClause,
    limit,
    offset: startIndex,
    order: [['name', 'ASC']],
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
 * @desc    Get single venue
 * @route   GET /api/venues/:id
 * @access  Private
 */
exports.getVenue = asyncHandler(async (req, res, next) => {
  const venue = await db.EventVenue.findByPk(req.params.id, {
    include: [
      {
        model: db.Event,
        as: 'events',
        attributes: ['id', 'name', 'eventDate', 'status']
      }
    ]
  });

  if (!venue) {
    return next(
      new ErrorResponse(`Venue not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: venue,
  });
});

/**
 * @desc    Create new venue
 * @route   POST /api/venues
 * @access  Private/Admin
 */
exports.createVenue = asyncHandler(async (req, res, next) => {
  const venue = await db.EventVenue.create({
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    postalCode: req.body.postalCode,
    capacity: req.body.capacity,
    amenities: req.body.amenities,
    contactName: req.body.contactName,
    contactEmail: req.body.contactEmail,
    contactPhone: req.body.contactPhone,
    status: req.body.status || 'active',
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: venue,
  });
});

/**
 * @desc    Update venue
 * @route   PUT /api/venues/:id
 * @access  Private/Admin
 */
exports.updateVenue = asyncHandler(async (req, res, next) => {
  let venue = await db.EventVenue.findByPk(req.params.id);

  if (!venue) {
    return next(
      new ErrorResponse(`Venue not found with id ${req.params.id}`, 404)
    );
  }

  venue = await venue.update({
    name: req.body.name || venue.name,
    address: req.body.address || venue.address,
    city: req.body.city || venue.city,
    state: req.body.state || venue.state,
    country: req.body.country || venue.country,
    postalCode: req.body.postalCode || venue.postalCode,
    capacity: req.body.capacity || venue.capacity,
    amenities: req.body.amenities || venue.amenities,
    contactName: req.body.contactName || venue.contactName,
    contactEmail: req.body.contactEmail || venue.contactEmail,
    contactPhone: req.body.contactPhone || venue.contactPhone,
    status: req.body.status || venue.status,
    description: req.body.description || venue.description,
    websiteUrl: req.body.websiteUrl || venue.websiteUrl,
    updatedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: venue,
  });
});

/**
 * @desc    Delete venue
 * @route   DELETE /api/venues/:id
 * @access  Private/Admin
 */
exports.deleteVenue = asyncHandler(async (req, res, next) => {
  const venue = await db.EventVenue.findByPk(req.params.id);

  if (!venue) {
    return next(
      new ErrorResponse(`Venue not found with id ${req.params.id}`, 404)
    );
  }

  // Check if venue is associated with any events
  const associatedEvents = await db.Event.count({
    where: {
      venueId: req.params.id
    }
  });

  if (associatedEvents > 0) {
    return next(
      new ErrorResponse(
        `Cannot delete venue as it is associated with ${associatedEvents} events`,
        400
      )
    );
  }

  await venue.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Get available venues for a specific date range
 * @route   GET /api/venues/available
 * @access  Private
 */
exports.getAvailableVenues = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, capacity } = req.query;
  
  if (!startDate || !endDate) {
    return next(
      new ErrorResponse('Please provide start and end dates', 400)
    );
  }

  // Find venues that don't have events scheduled in the given date range
  const bookedVenueIds = await db.Event.findAll({
    attributes: ['venueId'],
    where: {
      [Op.and]: [
        {
          eventDate: {
            [Op.between]: [new Date(startDate), new Date(endDate)]
          }
        },
        {
          status: {
            [Op.notIn]: ['cancelled', 'draft']
          }
        }
      ]
    },
    raw: true
  }).then(events => events.map(event => event.venueId));

  // Build the where clause for venues
  const whereClause = {};
  
  // Exclude booked venues
  if (bookedVenueIds.length > 0) {
    whereClause.id = {
      [Op.notIn]: bookedVenueIds
    };
  }
  
  // Filter by capacity if provided
  if (capacity) {
    whereClause.capacity = {
      [Op.gte]: parseInt(capacity, 10)
    };
  }
  
  // Ensure venue is active
  whereClause.status = 'active';

  const venues = await db.EventVenue.findAll({
    where: whereClause,
    order: [['name', 'ASC']]
  });

  res.status(200).json({
    success: true,
    count: venues.length,
    data: venues
  });
});
