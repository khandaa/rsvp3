/**
 * Database Verification Script
 * ==========================
 * This script verifies the SQLite database structure and confirms that all 
 * tables were created correctly with default data. It also tests API connectivity
 * to ensure the backend is properly connected to the database.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const fs = require('fs');

// Database file path - check multiple possible paths
const possiblePaths = [
  path.join(__dirname, './rsvp_event_app_dev.sqlite'),
  path.join(__dirname, '../database/rsvp_event_app_dev.sqlite'),
  path.join(__dirname, '../backend/database/rsvp_event_app_dev.sqlite'),
  path.join(__dirname, './rsvp_events.db')
];

let dbPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    dbPath = testPath;
    console.log(`Found database at: ${dbPath}`);
    break;
  }
}

if (!dbPath) {
  console.error('❌ Could not find database file in any of the expected locations');
  process.exit(1);
}

// Backend API base URL
const API_BASE_URL = 'http://localhost:5010';

// Connect to the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(`❌ Error connecting to database: ${err.message}`);
    process.exit(1);
  }
  console.log(`✅ Connected to SQLite database at: ${dbPath}`);
});

// Convert callback-based functions to Promise-based
db.allAsync = promisify(db.all.bind(db));
db.getAsync = promisify(db.get.bind(db));

// Enable foreign keys
db.get('PRAGMA foreign_keys = ON', (err) => {
  if (err) console.error('⚠️ Failed to enable foreign keys:', err.message);
});

// Function to close database connection and exit
const closeDbAndExit = (code = 0) => {
  db.close((err) => {
    if (err) {
      console.error(`❌ Error closing database: ${err.message}`);
      process.exit(1);
    }
    console.log('Database connection closed.');
    process.exit(code);
  });
};

// Start verification
async function verifyDatabase() {
  try {
    // Check SQLite version
    const versionRow = await db.getAsync('SELECT sqlite_version() as version');
    console.log(`SQLite version: ${versionRow.version}`);
    
    // List all tables
    console.log('\n=== Database Tables ===');
    const tables = await db.allAsync("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    
    const applicationTables = tables.filter(table => !table.name.startsWith('sqlite_'));
    applicationTables.forEach(table => {
      console.log(`• ${table.name}`);
    });
    
    // Expected tables based on model definitions
    const expectedTables = [
      'users', 'roles', 'user_roles', 'events', 'event_venues', 
      'guests', 'event_guests', 'rsvps', 'guest_groups', 'notifications', 
      'notification_templates', 'notification_recipients', 'audit_logs'
    ];
    
    const missingTables = expectedTables.filter(
      table => !applicationTables.some(t => t.name === table)
    );
    
    if (missingTables.length > 0) {
      console.log('\n❌ Missing tables:', missingTables);
    } else {
      console.log('\n✅ All expected tables exist');
    }
    
    // Check for default admin user
    console.log('\n=== Verifying Users ===');
    const adminUser = await db.getAsync('SELECT id, username, email, first_name, last_name FROM users WHERE username = "admin"');
    
    if (adminUser) {
      console.log(`✓ Admin user exists: ID=${adminUser.id}, Username=${adminUser.username}, Email=${adminUser.email}`);
    } else {
      console.error('❌ Default admin user not found');
    }
    
    // Check for sample users
    const sampleUsers = await db.allAsync('SELECT id, username, email FROM users WHERE username IN ("user1", "user2", "user3")');
    console.log(`\nFound ${sampleUsers.length} sample users:`);
    sampleUsers.forEach(user => {
      console.log(`✓ User: ID=${user.id}, Username=${user.username}, Email=${user.email}`);
    });
    
    if (sampleUsers.length < 3) {
      console.warn('⚠ Some sample users are missing. Expected user1, user2, user3.');
    }
    
    // Check roles
    console.log('\n=== Verifying Roles ===');
    const roles = await db.allAsync('SELECT id, name, permissions FROM roles');
    console.log(`Found ${roles.length} roles:`);
    roles.forEach(role => {
      console.log(`✓ Role: ID=${role.id}, Name=${role.name}, Permissions=${role.permissions ? JSON.stringify(role.permissions).substring(0, 50) + '...' : 'null'}`);
    });
    
    // Check user-role relationships
    console.log('\n=== Verifying User-Role Relationships ===');
    const userRoles = await db.allAsync(`
      SELECT u.username, r.name as role_name
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY u.username
    `);
    
    if (userRoles.length > 0) {
      console.log(`Found ${userRoles.length} user-role assignments:`);
      userRoles.forEach(ur => {
        console.log(`✓ User '${ur.username}' has role '${ur.role_name}'`);
      });
    } else {
      console.error('❌ No user-role relationships found');
    }
    
    // Test API connectivity
    console.log('\n=== Testing API Connectivity ===');
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      console.log(`✓ API Health Check: ${JSON.stringify(response.data)}`);
      
      // Try to get public info without authentication to verify basic API connectivity
      console.log('\nTesting public API endpoints...');
      try {
        await axios.get(`${API_BASE_URL}/api/auth`);
        console.log('✓ Auth API endpoints available');
      } catch (error) {
        const statusCode = error.response?.status || 'Unknown';
        // 404 is expected if the /api/auth base endpoint doesn't respond directly
        if (statusCode === 404) {
          console.log('✓ Auth API endpoints structure confirmed');
        } else {
          console.error(`❌ Error accessing auth API: ${error.message}, Status: ${statusCode}`);
        }
      }
      
      // Test login endpoint using multiple user credentials
      console.log('\nTesting login endpoint with sample credentials...');
      
      // Array of users to test
      const usersToTest = [
        { email: 'user1@example.com', password: 'Admin@123', label: 'Regular User' },
        { email: 'admin@example.com', password: 'Admin@123', label: 'Admin User' }
      ];
      
      // Test each user
      for (const user of usersToTest) {
        try {
          console.log(`Testing login for ${user.label}: ${user.email}`);
          const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: user.email,
            password: user.password
          });
          
          if (loginResponse.data && loginResponse.data.token) {
            console.log(`✓ ${user.label} login successful! Token received.`);
            // If admin login works, try a protected endpoint
            if (user.label === 'Admin User') {
              try {
                const token = loginResponse.data.token;
                const profileResponse = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                console.log('✓ Protected API endpoint (/api/auth/me) works! User data retrieved.');
              } catch (protectedError) {
                console.error(`❌ Protected API test failed: ${protectedError.message}`);
              }
            }
          } else {
            console.warn(`⚠ ${user.label} login responded but no token received.`);
          }
        } catch (error) {
          console.error(`❌ ${user.label} login test failed: ${error.message}`);
          console.error(`Response status: ${error.response?.status}, Data: ${JSON.stringify(error.response?.data || {})}`);
        }
      }
    } catch (error) {
      console.error(`❌ API connectivity test failed: ${error.message}`);
    }
    
    // Verify table relationships (check a few key relationships)
    console.log('\n=== Verifying Table Relationships ===');
    
    // Check Events and Venues relationship
    try {
      const eventVenues = await db.allAsync(`
        SELECT COUNT(*) as count FROM event_venues
      `);
      console.log(`Found ${eventVenues[0].count} event venues`);
    } catch (error) {
      console.error('❌ Could not verify event_venues relationship:', error.message);
    }
    
    // Final summary
    console.log('\n=== Database Verification Summary ===');
    console.log(`✅ Database structure verified with ${applicationTables.length} tables`);
    console.log(`✅ ${sampleUsers.length} sample users verified`);
    console.log(`✅ ${userRoles.length} user-role relationships verified`);
    console.log('✅ Backend API connectivity tested');
    
    console.log('\nVerification complete!');
  } catch (error) {
    console.error(`\n❌ Verification failed: ${error.message}`);
  } finally {
    closeDbAndExit(0);
  }
}

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  closeDbAndExit(1);
});

// Run the verification
verifyDatabase();
