const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Op, QueryTypes, fn, col, literal } = require('sequelize');
const db = require('../models');

/**
 * @desc    Get RSVP statistics for an event
 * @route   GET /api/reporting/events/:id/rsvp-stats
 * @access  Private
 */
exports.getRsvpStats = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;

  // Verify event exists
  const event = await db.Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Get RSVP statistics by status
  const rsvpStats = await db.RSVP.findAll({
    where: { eventId },
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('plusOnes')), 'plusOnesTotal']
    ],
    group: ['status']
  });

  // Calculate totals
  let attendingCount = 0;
  let plusOnesCount = 0;
  let declinedCount = 0;
  let pendingCount = 0;
  let maybeCount = 0;

  rsvpStats.forEach(stat => {
    switch (stat.status) {
      case 'attending':
        attendingCount = Number(stat.get('count'));
        plusOnesCount = Number(stat.get('plusOnesTotal')) || 0;
        break;
      case 'declined':
        declinedCount = Number(stat.get('count'));
        break;
      case 'pending':
        pendingCount = Number(stat.get('count'));
        break;
      case 'maybe':
        maybeCount = Number(stat.get('count'));
        break;
    }
  });

  const totalInvited = await db.Guest.count({
    include: [{
      model: db.Event,
      as: 'events',
      where: { id: eventId }
    }]
  });

  const totalResponded = attendingCount + declinedCount + maybeCount;
  const responseRate = totalInvited > 0 ? (totalResponded / totalInvited) * 100 : 0;
  const expectedAttendees = attendingCount + plusOnesCount;
  
  res.status(200).json({
    success: true,
    data: {
      eventId,
      eventName: event.name,
      totalInvited,
      rsvpStats: {
        attending: attendingCount,
        plusOnes: plusOnesCount,
        declined: declinedCount,
        pending: pendingCount,
        maybe: maybeCount,
        expectedAttendees,
      },
      responseRate: responseRate.toFixed(2),
    }
  });
});

/**
 * @desc    Get attendance tracking for an event
 * @route   GET /api/reporting/events/:id/attendance
 * @access  Private
 */
exports.getAttendanceTracking = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;

  // Verify event exists
  const event = await db.Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Get logistics with check-in data
  const logistics = await db.Logistics.findAll({
    where: { eventId },
    include: [{
      model: db.Guest,
      as: 'guests',
      through: {
        attributes: ['checkedIn', 'checkedInAt', 'checkedOut', 'checkedOutAt']
      }
    }]
  });

  // Process check-in information
  const logisticsData = logistics.map(item => {
    const checkedInGuests = item.guests.filter(g => g.LogisticsGuest.checkedIn);
    const checkedOutGuests = item.guests.filter(g => g.LogisticsGuest.checkedOut);
    
    return {
      id: item.id,
      name: item.name,
      type: item.type,
      totalAssigned: item.guests.length,
      checkedIn: checkedInGuests.length,
      checkedOut: checkedOutGuests.length,
      checkInRate: item.guests.length > 0 ? (checkedInGuests.length / item.guests.length) * 100 : 0
    };
  });

  // Get overall attendance numbers
  const totalRsvps = await db.RSVP.count({
    where: { 
      eventId,
      status: 'attending'
    }
  });

  // Get count of guests who were checked in to at least one logistics item
  const checkedInGuestsQuery = `
    SELECT COUNT(DISTINCT "guestId") AS "checkedInCount"
    FROM "LogisticsGuests" lg
    JOIN "Logistics" l ON lg."logisticsId" = l.id
    WHERE l."eventId" = :eventId AND lg."checkedIn" = true
  `;

  const [checkedInData] = await db.sequelize.query(checkedInGuestsQuery, {
    replacements: { eventId },
    type: QueryTypes.SELECT
  });

  const checkedInCount = parseInt(checkedInData.checkedInCount, 10) || 0;
  const attendanceRate = totalRsvps > 0 ? (checkedInCount / totalRsvps) * 100 : 0;

  res.status(200).json({
    success: true,
    data: {
      eventId,
      eventName: event.name,
      totalExpected: totalRsvps,
      totalAttended: checkedInCount,
      attendanceRate: attendanceRate.toFixed(2),
      logisticsBreakdown: logisticsData
    }
  });
});

/**
 * @desc    Get demographic statistics for an event
 * @route   GET /api/reporting/events/:id/demographics
 * @access  Private
 */
exports.getDemographics = asyncHandler(async (req, res, next) => {
  const eventId = req.params.id;

  // Verify event exists
  const event = await db.Event.findByPk(eventId);
  if (!event) {
    return next(new ErrorResponse(`Event not found with id ${eventId}`, 404));
  }

  // Get guests who RSVPed as attending
  const attendingGuests = await db.Guest.findAll({
    include: [{
      model: db.RSVP,
      as: 'rsvps',
      where: {
        eventId,
        status: 'attending'
      }
    }]
  });

  // Extract demographic information
  // These are just examples and will depend on what guest data you're tracking
  const demographicData = {
    genderDistribution: {},
    ageDistribution: {
      'under18': 0,
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      'over65': 0,
      'unknown': 0
    },
    locationDistribution: {},
    dietaryPreferences: {}
  };

  attendingGuests.forEach(guest => {
    // Process gender distribution if available
    if (guest.gender) {
      demographicData.genderDistribution[guest.gender] = 
        (demographicData.genderDistribution[guest.gender] || 0) + 1;
    }
    
    // Process age distribution if date of birth available
    if (guest.dateOfBirth) {
      const age = calculateAge(guest.dateOfBirth);
      
      if (age < 18) demographicData.ageDistribution['under18']++;
      else if (age >= 18 && age <= 25) demographicData.ageDistribution['18-25']++;
      else if (age >= 26 && age <= 35) demographicData.ageDistribution['26-35']++;
      else if (age >= 36 && age <= 45) demographicData.ageDistribution['36-45']++;
      else if (age >= 46 && age <= 55) demographicData.ageDistribution['46-55']++;
      else if (age >= 56 && age <= 65) demographicData.ageDistribution['56-65']++;
      else if (age > 65) demographicData.ageDistribution['over65']++;
    } else {
      demographicData.ageDistribution['unknown']++;
    }
    
    // Process location distribution
    if (guest.city && guest.state) {
      const location = `${guest.city}, ${guest.state}`;
      demographicData.locationDistribution[location] = 
        (demographicData.locationDistribution[location] || 0) + 1;
    } else if (guest.city) {
      demographicData.locationDistribution[guest.city] = 
        (demographicData.locationDistribution[guest.city] || 0) + 1;
    }
    
    // Process dietary preferences if available
    if (guest.dietaryRestrictions) {
      const restrictions = guest.dietaryRestrictions.split(',').map(item => item.trim());
      restrictions.forEach(diet => {
        demographicData.dietaryPreferences[diet] = 
          (demographicData.dietaryPreferences[diet] || 0) + 1;
      });
    }
  });

  res.status(200).json({
    success: true,
    data: {
      eventId,
      eventName: event.name,
      totalAttendees: attendingGuests.length,
      demographics: demographicData
    }
  });
});

/**
 * @desc    Get event comparison report (compare multiple events)
 * @route   GET /api/reporting/events/compare
 * @access  Private
 */
exports.compareEvents = asyncHandler(async (req, res, next) => {
  const { eventIds } = req.query;
  
  if (!eventIds || !Array.isArray(eventIds) || eventIds.length < 2) {
    return next(new ErrorResponse('Please provide at least two event IDs for comparison', 400));
  }

  const events = await db.Event.findAll({
    where: {
      id: {
        [Op.in]: eventIds
      }
    }
  });

  if (events.length !== eventIds.length) {
    return next(new ErrorResponse('One or more events not found', 404));
  }

  // Prepare comparison data structure
  const comparisonData = await Promise.all(events.map(async (event) => {
    // Get RSVP stats
    const rsvpStats = await db.RSVP.findAll({
      where: { eventId: event.id },
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count'],
        [fn('SUM', col('plusOnes')), 'plusOnesTotal']
      ],
      group: ['status']
    });

    // Process RSVP stats
    let attending = 0, declined = 0, maybe = 0, pending = 0, plusOnes = 0;
    rsvpStats.forEach(stat => {
      switch(stat.status) {
        case 'attending':
          attending = Number(stat.get('count'));
          plusOnes = Number(stat.get('plusOnesTotal') || 0);
          break;
        case 'declined': declined = Number(stat.get('count')); break;
        case 'maybe': maybe = Number(stat.get('count')); break;
        case 'pending': pending = Number(stat.get('count')); break;
      }
    });

    // Get total invited
    const totalInvited = await db.Guest.count({
      include: [{
        model: db.Event,
        as: 'events',
        where: { id: event.id }
      }]
    });

    // Get check-in count
    const [checkedInData] = await db.sequelize.query(`
      SELECT COUNT(DISTINCT "guestId") AS "checkedInCount"
      FROM "LogisticsGuests" lg
      JOIN "Logistics" l ON lg."logisticsId" = l.id
      WHERE l."eventId" = :eventId AND lg."checkedIn" = true
    `, {
      replacements: { eventId: event.id },
      type: QueryTypes.SELECT
    });

    const checkedInCount = parseInt(checkedInData.checkedInCount, 10) || 0;
    
    return {
      id: event.id,
      name: event.name,
      date: event.eventDate,
      venue: event.venue,
      totalInvited,
      rsvpStats: {
        attending,
        declined,
        maybe,
        pending,
        plusOnes,
        expectedAttendees: attending + plusOnes
      },
      responseRate: totalInvited > 0 ? ((attending + declined + maybe) / totalInvited * 100).toFixed(2) : '0.00',
      attendanceRate: attending > 0 ? (checkedInCount / attending * 100).toFixed(2) : '0.00',
      checkedIn: checkedInCount
    };
  }));

  res.status(200).json({
    success: true,
    data: comparisonData
  });
});

/**
 * Helper function to calculate age from date of birth
 */
function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
