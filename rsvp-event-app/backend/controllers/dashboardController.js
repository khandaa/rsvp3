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
  // Get current user (optional for public endpoint)
  const userId = req.user ? req.user.id : null;
  
  // Calculate stats
  const stats = {};
  
  // Count total events
  stats.totalEvents = await db.Event.count();
  
  // Count active events (current and future events)
  const now = new Date();
  stats.activeEvents = await db.Event.count({
    where: {
      startDate: {
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
      startDate: {
        [Op.gte]: now
      },
      // Also filter for published events only
      status: 'published'
    },
    // Remove the incorrect include statement until proper associations are set up
    // EventVenue relationship needs to be properly defined before including it
    order: [['startDate', 'ASC']],
    limit: 5
  });
  
  // Format upcoming events data
  stats.upcomingEvents = await Promise.all(stats.upcomingEvents.map(async (event) => {
    // Get guest count for this event using the event_guests join table instead
    const guestsCount = await db.EventGuest.count({
      where: {
        eventId: event.id
      }
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
      date: event.startDate,
      location: 'TBD', // Simplified until venue association is properly set up
      guestsCount,
      confirmedCount
    };
  }));
  
  res.status(200).json({
    success: true,
    data: stats
  });
});
