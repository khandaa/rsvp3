/**
 * Seed Marriage Events Script
 * ==========================
 * This script creates 5 sample marriage events, each with:
 * - 20 guests per event
 * - Different RSVP statuses
 * - Event venues
 */

const { faker } = require('@faker-js/faker');
const db = require('../models');
const { Event, Guest, EventGuest, RSVP, EventVenue, User } = db;
const { QueryTypes } = require('sequelize');

// RSVP status options
const RSVP_STATUSES = ['pending', 'attending', 'declined', 'maybe'];

// Configuration
const NUM_EVENTS = 5;
const GUESTS_PER_EVENT = 20;
const START_DATE = new Date('2025-08-01');

// Helper function to get a random element from an array
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get a random date in the next year
const getRandomFutureDate = (startDate, daysRange = 365) => {
  const randomDays = Math.floor(Math.random() * daysRange);
  const date = new Date(startDate);
  date.setDate(date.getDate() + randomDays);
  return date;
};

// Get end date (8 hours after start date)
const getEndDate = (startDate) => {
  const endDate = new Date(startDate);
  endDate.setHours(endDate.getHours() + 8);
  return endDate;
};

// Function to create an event venue
const createEventVenue = async (eventId) => {
  return await EventVenue.create({
    eventId,
    name: faker.company.name() + ' ' + getRandomElement(['Wedding Hall', 'Resort', 'Hotel', 'Gardens', 'Banquet Hall']),
    addressLine1: faker.location.streetAddress(),
    addressLine2: faker.helpers.maybe(() => faker.location.secondaryAddress(), { probability: 0.3 }),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    isPrimary: true,
    capacity: faker.helpers.rangeToNumber({ min: 100, max: 500 }),
    contactName: faker.person.fullName(),
    contactPhone: faker.phone.number(),
    contactEmail: faker.internet.email(),
    notes: faker.lorem.paragraph(),
    imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 600 }),
  });
};

// Function to create a guest
const createGuest = async () => {
  return await Guest.create({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
    isVIP: faker.datatype.boolean({ probability: 0.1 }),
    notes: faker.lorem.sentence(),
    dietaryRestrictions: faker.helpers.maybe(() => getRandomElement(['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'Kosher']), { probability: 0.4 }),
    tags: JSON.stringify(['wedding']),
    customFields: JSON.stringify({
      tablePreference: getRandomElement(['Near dance floor', 'Near bar', 'Near family', 'Away from speakers', 'No preference']),
      relationshipToCouple: getRandomElement(['Friend of Bride', 'Friend of Groom', 'Family of Bride', 'Family of Groom', 'Colleague']),
    }),
  });
};

// Function to fix database constraints
async function fixDatabaseConstraints() {
  console.log('Fixing database constraints...');
  
  try {
    // Instead of trying to fix the existing table, let's just drop and recreate the rsvps table with correct constraints
    // First check if the table exists
    const tableExists = await db.sequelize.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='rsvps';",
      { type: QueryTypes.SELECT }
    );
    
    if (tableExists.length > 0) {
      console.log('Dropping and recreating RSVP table with correct constraints...');
      
      // Drop existing tables that might have foreign key dependencies
      await db.sequelize.query('DROP TABLE IF EXISTS rsvp_plus_ones', { type: QueryTypes.RAW });
      await db.sequelize.query('DROP TABLE IF EXISTS rsvps', { type: QueryTypes.RAW });
      
      // Create the table with proper constraints
      await db.sequelize.query(
        `CREATE TABLE IF NOT EXISTS rsvps (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id INTEGER NOT NULL,
          guest_id INTEGER NOT NULL,
          token VARCHAR(255) UNIQUE,
          status VARCHAR(255) DEFAULT 'pending',
          response_date DATETIME,
          number_of_guests INTEGER DEFAULT 1,
          dietary_restrictions TEXT,
          special_requirements TEXT,
          message TEXT,
          has_plus_one BOOLEAN DEFAULT 0,
          created_at DATETIME NOT NULL,
          updated_at DATETIME NOT NULL,
          comments TEXT,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
          UNIQUE(event_id, guest_id)
        )`,
        { type: QueryTypes.RAW }
      );
      
      console.log('Successfully recreated RSVP table with correct constraints');
    } else {
      console.log('RSVP table not found, will be created by models');
    }
  } catch (error) {
    console.error('Error fixing constraints:', error);
    // Log but don't throw to allow script to continue
    console.log('Will attempt to continue with seeding...');
  }
}

// Function to create event, guests, and RSVPs
const createEventWithGuests = async (userId, index) => {
  try {
    // Get a random future date for the event
    const eventDate = getRandomFutureDate(START_DATE);
    const startDate = eventDate;
    const endDate = getEndDate(startDate);

    // Create couples' names
    const bride = faker.person.firstName('female') + ' ' + faker.person.lastName();
    const groom = faker.person.firstName('male') + ' ' + faker.person.lastName();
    
    // Create the event
    const event = await Event.create({
      name: `Wedding of ${bride} and ${groom}`,
      description: `Please join us to celebrate the wedding of ${bride} and ${groom}.`,
      type: 'wedding',
      startDate,
      endDate,
      timezone: 'Asia/Kolkata',
      status: 'published',
      isPrivate: faker.datatype.boolean({ probability: 0.2 }),
      coverImage: faker.image.urlPicsumPhotos({ width: 1200, height: 800 }),
      createdBy: userId,
      maxAttendees: GUESTS_PER_EVENT * 2, // Account for plus ones
    });

    console.log(`Created event #${index + 1}: ${event.name} on ${startDate.toLocaleDateString()}`);
    
    // Create venue for the event
    const venue = await createEventVenue(event.id);
    console.log(`Created venue: ${venue.name}`);
    
    // Create guests and associate with event
    const guestPromises = [];
    for (let i = 0; i < GUESTS_PER_EVENT; i++) {
      guestPromises.push(createGuest());
    }
    
    const guests = await Promise.all(guestPromises);
    console.log(`Created ${guests.length} guests for event: ${event.name}`);
    
    // Associate guests with events and create RSVPs
    for (const guest of guests) {
      // Create event guest association
      await EventGuest.create({
        eventId: event.id,
        guestId: guest.id,
        isConfirmed: true,
        invitationSent: true,
        invitationSentDate: new Date(),
      });
      
      // Create RSVP with random status
      const status = getRandomElement(RSVP_STATUSES);
      const hasPlusOne = faker.datatype.boolean({ probability: 0.3 });
      
      try {
        await RSVP.create({
          eventId: event.id,
          guestId: guest.id,
          status,
          responseDate: status !== 'pending' ? new Date() : null,
          hasPlusOne,
          dietaryRestrictions: faker.helpers.maybe(() => getRandomElement(['Vegetarian', 'Vegan', 'Gluten-Free', 'Nut Allergy', 'None']), { probability: 0.4 }),
          specialRequirements: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.2 }),
          token: faker.string.uuid(),
          comments: faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.3 }),
          numberOfGuests: hasPlusOne ? 2 : 1
        });
      } catch (error) {
        console.error(`Error creating RSVP for guest ${guest.id} at event ${event.id}:`, error.message);
        // Continue processing other guests if one fails
      }
    }
    
    // Log RSVP status counts for this event
    const rsvpCounts = await RSVP.findAll({
      where: { eventId: event.id },
      attributes: ['status', [db.sequelize.fn('COUNT', db.sequelize.col('status')), 'count']],
      group: ['status'],
      raw: true,
    });
    
    console.log('RSVP status distribution:');
    rsvpCounts.forEach(({ status, count }) => {
      console.log(`  - ${status}: ${count}`);
    });
    
    console.log('============================================');
    return event;
  } catch (error) {
    console.error(`Error creating event #${index + 1}:`, error);
    throw error;
  }
};

// Main function to seed events
async function seedMarriageEvents() {
  try {
    // Connect to the database
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Check and fix database constraints
    await fixDatabaseConstraints();
    
    // Find admin user to assign as event creator
    const adminUser = await User.findOne({
      where: {
        username: 'admin'
      }
    });
    
    if (!adminUser) {
      throw new Error('Admin user not found. Please ensure admin user exists.');
    }
    
    console.log(`Found admin user: ${adminUser.username} (ID: ${adminUser.id})`);
    
    // Clear existing events, guests and RSVPs for clean seeding
    console.log('Clearing existing event-related data for clean seeding...');
    
    // Helper function to safely delete from tables
    const safeDelete = async (tableName) => {
      try {
        // Check if table exists first
        const tableCheck = await db.sequelize.query(
          `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`,
          { type: QueryTypes.SELECT }
        );
        
        if (tableCheck.length > 0) {
          await db.sequelize.query(`DELETE FROM ${tableName}`, { type: QueryTypes.DELETE });
          console.log(`Cleared table: ${tableName}`);
        } else {
          console.log(`Table ${tableName} does not exist, skipping`);
        }
      } catch (error) {
        console.log(`Error clearing ${tableName}: ${error.message}`);
        // Continue with other tables
      }
    };
    
    // Delete from tables in reverse dependency order
    await safeDelete('rsvp_plus_ones');
    await safeDelete('rsvps');
    await safeDelete('event_guests');
    await safeDelete('event_venues'); 
    await safeDelete('events');
    await safeDelete('guests');
    
    console.log('Existing event data clearing process completed');
    
    // Create the events sequentially to avoid conflicts
    for (let i = 0; i < NUM_EVENTS; i++) {
      await createEventWithGuests(adminUser.id, i);
      console.log(`Completed event ${i + 1} of ${NUM_EVENTS}`);
    }
    
    console.log(`\nSuccessfully created ${NUM_EVENTS} wedding events with ${NUM_EVENTS * GUESTS_PER_EVENT} guests`);
    console.log('Each event has 20 guests with various RSVP statuses');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding marriage events:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedMarriageEvents();
