const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op, QueryTypes, fn, col, literal, where } = require('sequelize');
const db = require('../models');
const sequelize = db.sequelize;

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get current user
  const userId = req.user.id;
  
  // Calculate stats
  const stats = {};
  
  // Count total events
  stats.totalEvents = await db.Event.count();
  
  // Count active events (current and future events)
  const now = new Date();
  stats.activeEvents = await db.Event.count({
    where: {
      date: {
        [Op.gte]: now
      }
    }
  });
  
  // Count total guests
  stats.totalGuests = await db.Guest.count();
  
  // Count confirmed and pending guests from RSVP status
  const rsvpCounts = await db.RSVP.findAll({
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count']
    ],
    group: ['status']
  });
  
  // Initialize confirmed and pending counts
  stats.confirmedGuests = 0;
  stats.pendingGuests = 0;
  
  // Map RSVP statuses to their counts
  rsvpCounts.forEach(rsvp => {
    const status = rsvp.status;
    const count = parseInt(rsvp.get('count'), 10);
    
    if (status === 'attending') {
      stats.confirmedGuests = count;
    } else if (status === 'pending') {
      stats.pendingGuests = count;
    }
  });
  
  // Get upcoming events (limited to 5)
  stats.upcomingEvents = await db.Event.findAll({
    where: {
      date: {
        [Op.gte]: now
      }
    },
    include: [
      {
        model: db.Venue,
        as: 'venue',
        attributes: ['name', 'city']
      }
    ],
    order: [['date', 'ASC']],
    limit: 5
  });
  
  // Format upcoming events data
  stats.upcomingEvents = await Promise.all(stats.upcomingEvents.map(async (event) => {
    // Get guest count for this event
    const guestsCount = await db.Guest.count({
      include: [
        {
          model: db.Event,
          as: 'events',
          where: { id: event.id }
        }
      ]
    });
    
    // Get confirmed count for this event
    const confirmedCount = await db.RSVP.count({
      where: {
        eventId: event.id,
        status: 'attending'
      }
    });
    
    return {
      id: event.id,
      name: event.name,
      date: event.date,
      location: event.venue ? `${event.venue.name}, ${event.venue.city}` : 'TBD',
      guestsCount,
      confirmedCount
    };
  }));
  
  res.status(200).json({
    success: true,
    data: stats
  });
});
