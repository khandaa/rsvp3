/**
 * Test Data Generator for RSVP Event App
 * 
 * This script populates the database with test data for development and testing purposes.
 * It creates sample records for all major entities: users, events, guests, RSVPs, venues, etc.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');

// Import models
const db = require('../models');
const logger = require('../utils/logger');

// Constants for data generation
const NUM_ROLES = 3;
const NUM_USERS = 10;
const NUM_VENUES = 10;
const NUM_EVENTS = 15;
const NUM_GUESTS = 50;
const NUM_RSVPS = 40;
const NUM_NOTIFICATIONS = 20;
const NUM_LOGISTICS = 10;

// Sample data arrays
const roles = [
  { id: 'admin', name: 'Administrator', permissions: JSON.stringify(['manage_all', 'view_all', 'create_all']) },
  { id: 'organizer', name: 'Event Organizer', permissions: JSON.stringify(['manage_events', 'view_events', 'create_events']) },
  { id: 'user', name: 'Basic User', permissions: JSON.stringify(['view_events', 'rsvp']) }
];

const eventTypes = ['wedding', 'conference', 'birthday', 'corporate', 'holiday', 'meeting', 'social'];
const eventStatuses = ['draft', 'published', 'cancelled', 'completed'];
const rsvpStatuses = ['attending', 'not_attending', 'maybe', 'pending'];

// Helper function to generate random date between two dates
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to pick random item from array
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to generate random number in range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function - chance for true/false with weighted probability
const chance = (probability) => Math.random() < probability;

/**
 * Generate test data and save to database
 */
const generateTestData = async () => {
  try {
    logger.info('Starting test data generation...');

    // Clear existing data (optional - uncomment if needed)
    // await db.sequelize.sync({ force: true });
    // logger.info('Database cleared.');

    // Create roles
    logger.info('Creating roles...');
    for (const role of roles) {
      await db.Role.findOrCreate({
        where: { id: role.id },
        defaults: role
      });
    }

    // Create users
    logger.info('Creating users...');
    const users = [];
    
    // Create admin user first
    const adminPassword = await bcrypt.hash('admin', 10);
    const adminUser = await db.User.findOrCreate({
      where: { email: 'admin@rsvp.com' },
      defaults: {
        id: uuid(),
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@rsvp.com',
        password: adminPassword,
        roleId: 'admin',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    users.push(adminUser[0]);

    // Create regular test users
    const userPassword = await bcrypt.hash('password123', 10);
    
    for (let i = 1; i < NUM_USERS; i++) {
      const firstName = `User${i}`;
      const lastName = `Test${i}`;
      const roleId = randomItem(roles).id;
      
      const user = await db.User.findOrCreate({
        where: { email: `user${i}@rsvp.com` },
        defaults: {
          id: uuid(),
          firstName,
          lastName,
          email: `user${i}@rsvp.com`,
          password: userPassword,
          roleId,
          isActive: chance(0.9), // 10% inactive
          isEmailVerified: chance(0.8), // 20% unverified
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      users.push(user[0]);
    }
    
    // Create venues
    logger.info('Creating venues...');
    const venues = [];
    
    for (let i = 0; i < NUM_VENUES; i++) {
      const venue = await db.Venue.findOrCreate({
        where: { name: `Test Venue ${i + 1}` },
        defaults: {
          id: uuid(),
          name: `Test Venue ${i + 1}`,
          address: `${randomInt(100, 999)} Main Street`,
          city: `City ${i + 1}`,
          state: `State ${i % 5}`,
          postalCode: `${randomInt(10000, 99999)}`,
          capacity: randomInt(50, 500),
          contactName: `Contact ${i}`,
          contactEmail: `venue${i}@example.com`,
          contactPhone: `555-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
          amenities: JSON.stringify(['WiFi', 'Parking', 'AV Equipment'].slice(0, randomInt(1, 3))),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      venues.push(venue[0]);
    }
    
    // Create events
    logger.info('Creating events...');
    const events = [];
    
    for (let i = 0; i < NUM_EVENTS; i++) {
      const startDate = randomDate(new Date(), new Date(2025, 11, 31));
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + randomInt(1, 48));
      
      const event = await db.Event.findOrCreate({
        where: { name: `Test Event ${i + 1}` },
        defaults: {
          id: uuid(),
          name: `Test Event ${i + 1}`,
          description: `Description for test event ${i + 1}. This is a sample event for testing.`,
          startDate,
          endDate,
          location: chance(0.7) ? null : `Location ${i + 1}`, // 70% use venue
          venueId: chance(0.7) ? randomItem(venues).id : null,
          eventType: randomItem(eventTypes),
          isPublic: chance(0.7),
          maxAttendees: randomInt(10, 300),
          status: randomItem(eventStatuses),
          userId: randomItem(users).id,
          coverImage: chance(0.3) ? `event${i}.jpg` : null,
          agenda: JSON.stringify([
            { time: '09:00', title: 'Registration', description: 'Check-in and welcome' },
            { time: '10:00', title: 'Opening', description: 'Welcome address' },
            { time: '12:00', title: 'Lunch', description: 'Lunch service' }
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      events.push(event[0]);
    }

    // Create guests
    logger.info('Creating guests...');
    const guests = [];
    
    for (let i = 0; i < NUM_GUESTS; i++) {
      const guest = await db.Guest.findOrCreate({
        where: { email: `guest${i}@example.com` },
        defaults: {
          id: uuid(),
          firstName: `Guest${i}`,
          lastName: `Person${i}`,
          email: `guest${i}@example.com`,
          phone: chance(0.8) ? `555-${randomInt(100, 999)}-${randomInt(1000, 9999)}` : null,
          dietaryRestrictions: chance(0.3) ? 'Vegetarian' : null,
          notes: chance(0.4) ? `Notes for guest ${i}` : null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      guests.push(guest[0]);
    }
    
    // Create RSVPs
    logger.info('Creating RSVPs...');
    for (let i = 0; i < NUM_RSVPS; i++) {
      const event = randomItem(events);
      const guest = randomItem(guests);
      
      await db.RSVP.findOrCreate({
        where: {
          eventId: event.id,
          guestId: guest.id
        },
        defaults: {
          id: uuid(),
          eventId: event.id,
          guestId: guest.id,
          status: randomItem(rsvpStatuses),
          plusOnes: randomInt(0, 3),
          dietaryRestrictions: chance(0.3) ? 'Vegetarian' : null,
          specialRequests: chance(0.2) ? 'Need wheelchair access' : null,
          responseDate: chance(0.8) ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    // Create notifications
    logger.info('Creating notifications...');
    for (let i = 0; i < NUM_NOTIFICATIONS; i++) {
      const event = randomItem(events);
      
      await db.Notification.findOrCreate({
        where: {
          title: `Test Notification ${i + 1}`,
          eventId: event.id
        },
        defaults: {
          id: uuid(),
          title: `Test Notification ${i + 1}`,
          content: `This is a test notification ${i + 1} for event ${event.name}`,
          eventId: event.id,
          type: randomItem(['email', 'sms', 'push', 'in-app']),
          status: randomItem(['draft', 'scheduled', 'sent', 'failed']),
          scheduledAt: chance(0.6) ? randomDate(new Date(), new Date(2025, 11, 31)) : null,
          sentAt: chance(0.4) ? new Date() : null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
    
    // Create logistics
    logger.info('Creating logistics...');
    for (let i = 0; i < NUM_LOGISTICS; i++) {
      const event = randomItem(events);
      
      await db.Logistics.findOrCreate({
        where: {
          title: `Test Logistics ${i + 1}`,
          eventId: event.id
        },
        defaults: {
          id: uuid(),
          title: `Test Logistics ${i + 1}`,
          description: `Logistics description ${i + 1} for event ${event.name}`,
          eventId: event.id,
          type: randomItem(['travel', 'accommodation', 'parking', 'equipment', 'catering']),
          details: JSON.stringify({
            address: chance(0.6) ? `${randomInt(100, 999)} Main Street` : null,
            contactPerson: chance(0.7) ? `Person ${i}` : null,
            contactPhone: chance(0.7) ? `555-${randomInt(100, 999)}-${randomInt(1000, 9999)}` : null,
            notes: chance(0.5) ? `Additional notes for logistics ${i}` : null
          }),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    logger.info('Test data generation completed successfully!');
    return {
      userCount: NUM_USERS,
      eventCount: NUM_EVENTS,
      venueCount: NUM_VENUES,
      guestCount: NUM_GUESTS,
      rsvpCount: NUM_RSVPS,
      notificationCount: NUM_NOTIFICATIONS,
      logisticsCount: NUM_LOGISTICS
    };
  } catch (error) {
    logger.error('Error generating test data:', error);
    throw error;
  }
};

// Run the script if executed directly
if (require.main === module) {
  generateTestData()
    .then((result) => {
      console.log('✅ Test data generation complete!');
      console.log('Summary:');
      console.log(`- Created ${result.userCount} users`);
      console.log(`- Created ${result.eventCount} events`);
      console.log(`- Created ${result.venueCount} venues`);
      console.log(`- Created ${result.guestCount} guests`);
      console.log(`- Created ${result.rsvpCount} RSVPs`);
      console.log(`- Created ${result.notificationCount} notifications`);
      console.log(`- Created ${result.logisticsCount} logistics items`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Test data generation failed:', error);
      process.exit(1);
    });
} else {
  module.exports = generateTestData;
}
