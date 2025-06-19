const { Guest, EventGuest, Event, User } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { Op } = require('sequelize');
const { sendEmail } = require('../utils/email');
const { generateRsvpToken } = require('../utils/tokenGenerator');
const logger = require('../utils/logger');

/**
 * @desc    Get all guests
 * @route   GET /api/v1/guests
 * @access  Private/Admin
 */
exports.getGuests = asyncHandler(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    eventId,
    status,
    sort = 'lastName',
    order = 'ASC'
  } = req.query;
  
  const offset = (page - 1) * limit;
  
  // Build where clause
  const where = {};
  
  // Search by name or email
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  
  // Filter by event
  if (eventId) {
    where['$events.EventGuest.eventId$'] = eventId;
  }
  
  // Filter by status
  if (status) {
    where['$events.EventGuest.status$'] = status;
  }
  
  const { count, rows: guests } = await Guest.findAndCountAll({
    where,
    include: [
      {
        model: Event,
        as: 'events',
        through: { attributes: ['status', 'createdAt', 'updatedAt'] },
        attributes: ['id', 'name', 'startDate'],
        required: !!eventId, // Only include if filtering by event
      },
    ],
    limit: parseInt(limit, 10),
    offset: parseInt(offset, 10),
    order: [[sort, order.toUpperCase()]],
    distinct: true, // Important for correct count with includes
  });

  // Calculate pagination
  const totalPages = Math.ceil(count / limit);
  const pagination = {
    total: count,
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  res.status(200).json({
    success: true,
    count: guests.length,
    pagination,
    data: guests,
  });
});

/**
 * @desc    Get single guest
 * @route   GET /api/v1/guests/:id
 * @access  Private/Admin
 */
exports.getGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findByPk(req.params.id, {
    include: [
      {
        model: Event,
        as: 'events',
        through: { attributes: ['status', 'notes', 'createdAt', 'updatedAt'] },
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      },
    ],
  });

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: guest,
  });
});

/**
 * @desc    Create guest
 * @route   POST /api/v1/guests
 * @access  Private
 */
exports.createGuest = asyncHandler(async (req, res, next) => {
  // Check if guest with email already exists
  if (req.body.email) {
    const existingGuest = await Guest.findOne({
      where: { email: req.body.email },
    });

    if (existingGuest) {
      return next(new ErrorResponse('Guest with this email already exists', 400));
    }
  }

  const guest = await Guest.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    data: guest,
  });
});

/**
 * @desc    Update guest
 * @route   PUT /api/v1/guests/:id
 * @access  Private
 */
exports.updateGuest = asyncHandler(async (req, res, next) => {
  let guest = await Guest.findByPk(req.params.id);

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if email is being updated and if it's already in use
  if (req.body.email && req.body.email !== guest.email) {
    const existingGuest = await Guest.findOne({
      where: { email: req.body.email },
    });

    if (existingGuest) {
      return next(new ErrorResponse('Email already in use', 400));
    }
  }

  guest = await guest.update(req.body);

  res.status(200).json({
    success: true,
    data: guest,
  });
});

/**
 * @desc    Delete guest
 * @route   DELETE /api/v1/guests/:id
 * @access  Private/Admin
 */
exports.deleteGuest = asyncHandler(async (req, res, next) => {
  const guest = await Guest.findByPk(req.params.id);

  if (!guest) {
    return next(
      new ErrorResponse(`Guest not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if guest has any RSVPs
  const rsvpCount = await EventGuest.count({
    where: { guestId: guest.id },
  });

  if (rsvpCount > 0) {
    return next(
      new ErrorResponse(
        'Cannot delete guest with existing RSVPs. Delete RSVPs first.',
        400
      )
    );
  }

  await guest.destroy();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Add guest to event
 * @route   POST /api/v1/guests/:id/events/:eventId
 * @access  Private
 */
exports.addGuestToEvent = asyncHandler(async (req, res, next) => {
  const { id, eventId } = req.params;
  const { status = 'pending', notes, sendInvitation } = req.body;

  // Check if guest exists
  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new ErrorResponse(`Guest not found with id of ${id}`, 404));
  }

  // Check if event exists and user has access
  const event = await Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404));
  }

  // Make sure user is event organizer or admin
  if (event.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add guests to this event`,
        403
      )
    );
  }

  // Check if guest is already invited to the event
  const existingInvitation = await EventGuest.findOne({
    where: { eventId, guestId: id },
  });

  if (existingInvitation) {
    return next(
      new ErrorResponse('Guest is already invited to this event', 400)
    );
  }

  // Add guest to event
  await EventGuest.create({
    eventId,
    guestId: id,
    status,
    notes,
    invitedBy: req.user.id,
  });

  // Send invitation if requested
  if (sendInvitation && guest.email) {
    try {
      const rsvpToken = generateRsvpToken({ eventId, guestId: id });
      const rsvpUrl = `${process.env.FRONTEND_URL}/rsvp/${rsvpToken}`;

      await sendEmail({
        to: guest.email,
        subject: `You're invited to ${event.name}`,
        template: 'event-invitation',
        templateVars: {
          eventName: event.name,
          organizerName: req.user.firstName,
          eventDate: new Date(event.startDate).toLocaleDateString(),
          eventTime: new Date(event.startDate).toLocaleTimeString(),
          eventLocation: event.venue?.name || 'Location TBD',
          rsvpUrl,
          message: req.body.invitationMessage || '',
        },
      });
    } catch (error) {
      logger.error('Error sending invitation email:', error);
      // Don't fail the request if email sending fails
    }
  }

  // Get updated guest with events
  const updatedGuest = await Guest.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'events',
        where: { id: eventId },
        through: { attributes: [] },
        required: false,
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: updatedGuest,
  });
});

/**
 * @desc    Remove guest from event
 * @route   DELETE /api/v1/guests/:id/events/:eventId
 * @access  Private
 */
exports.removeGuestFromEvent = asyncHandler(async (req, res, next) => {
  const { id, eventId } = req.params;

  // Check if guest exists
  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new ErrorResponse(`Guest not found with id of ${id}`, 404));
  }

  // Check if event exists and user has access
  const event = await Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404));
  }

  // Make sure user is event organizer or admin
  if (event.userId !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to remove guests from this event`,
        403
      )
    );
  }

  // Remove guest from event
  await EventGuest.destroy({
    where: { eventId, guestId: id },
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Update guest RSVP status for an event
 * @route   PUT /api/v1/guests/:id/events/:eventId/rsvp
 * @access  Private
 */
exports.updateGuestRsvp = asyncHandler(async (req, res, next) => {
  const { id, eventId } = req.params;
  const { status, plusOnes, dietaryRestrictions, notes } = req.body;

  // Validate status
  if (!['attending', 'not_attending', 'maybe'].includes(status)) {
    return next(
      new ErrorResponse(
        'Invalid status. Must be one of: attending, not_attending, maybe',
        400
      )
    );
  }

  // Check if guest exists
  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new ErrorResponse(`Guest not found with id of ${id}`, 404));
  }

  // Check if event exists
  const event = await Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id of ${eventId}`, 404));
  }

  // Update or create RSVP
  const [rsvp, created] = await EventGuest.upsert(
    {
      eventId,
      guestId: id,
      status,
      plusOnes: plusOnes || 0,
      dietaryRestrictions,
      notes,
      rsvpDate: new Date(),
    },
    { returning: true }
  );

  // If this is a new RSVP, send confirmation email
  if (created && guest.email) {
    try {
      await sendEmail({
        to: guest.email,
        subject: `RSVP Confirmation for ${event.name}`,
        template: 'rsvp-confirmation',
        templateVars: {
          guestName: `${guest.firstName} ${guest.lastName}`.trim(),
          eventName: event.name,
          eventDate: new Date(event.startDate).toLocaleDateString(),
          eventTime: new Date(event.startDate).toLocaleTimeString(),
          eventLocation: event.venue?.name || 'Location TBD',
          rsvpStatus: status,
          plusOnes: plusOnes || 0,
          dietaryRestrictions: dietaryRestrictions || 'None specified',
        },
      });
    } catch (error) {
      logger.error('Error sending RSVP confirmation email:', error);
      // Don't fail the request if email sending fails
    }
  }

  res.status(200).json({
    success: true,
    data: rsvp,
  });
});

/**
 * @desc    Get guest's events
 * @route   GET /api/v1/guests/:id/events
 * @access  Private
 */
exports.getGuestEvents = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status, upcoming, past } = req.query;

  // Check if guest exists
  const guest = await Guest.findByPk(id);
  if (!guest) {
    return next(new ErrorResponse(`Guest not found with id of ${id}`, 404));
  }

  // Build where clause for events
  const where = {};
  
  // Filter by status
  if (status) {
    where['$events.EventGuest.status$'] = status;
  }
  
  // Filter upcoming events
  if (upcoming === 'true') {
    where.startDate = { [Op.gte]: new Date() };
  }
  
  // Filter past events
  if (past === 'true') {
    where.startDate = { [Op.lt]: new Date() };
  }

  // Get guest with events
  const guestWithEvents = await Guest.findByPk(id, {
    include: [
      {
        model: Event,
        as: 'events',
        where,
        through: {
          attributes: ['status', 'notes', 'plusOnes', 'dietaryRestrictions', 'rsvpDate'],
        },
        include: [
          {
            model: User,
            as: 'organizer',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: EventVenue,
            as: 'venue',
          },
        ],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: guestWithEvents?.events || [],
  });
});
