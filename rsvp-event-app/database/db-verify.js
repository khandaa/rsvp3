/**
 * Database Verification Script
 * ==========================
 * This script verifies the SQLite database structure and confirms that all 
 * tables were created correctly with default data.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, './rsvp_events.db');

// Connect to the database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(`Error connecting to database: ${err.message}`);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Enable foreign keys
db.get('PRAGMA foreign_keys = ON', (err) => {
  if (err) console.error('Failed to enable foreign keys:', err.message);
});

// Check SQLite version
db.get('SELECT sqlite_version() as version', (err, row) => {
  if (err) {
    console.error('Failed to get SQLite version:', err.message);
  } else {
    console.log(`SQLite version: ${row.version}`);
  }
});

// List all tables
console.log('\n=== Database Tables ===');
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
  if (err) {
    console.error('Failed to retrieve tables:', err.message);
    closeDbAndExit(1);
  }
  
  tables.forEach(table => {
    if (!table.name.startsWith('sqlite_')) {
      console.log(`• ${table.name}`);
    }
  });
  
  // Check for default admin user
  console.log('\n=== Verifying Default Admin User ===');
  db.get('SELECT user_id, username, email FROM users WHERE username = "admin"', (err, user) => {
    if (err) {
      console.error('Failed to check admin user:', err.message);
    } else if (user) {
      console.log(`✓ Admin user exists: ID=${user.user_id}, Username=${user.username}, Email=${user.email}`);
    } else {
      console.error('✗ Default admin user not found');
    }
    
    // Check roles
    console.log('\n=== Verifying Roles ===');
    db.all('SELECT role_id, name FROM roles', (err, roles) => {
      if (err) {
        console.error('Failed to retrieve roles:', err.message);
      } else {
        roles.forEach(role => {
          console.log(`✓ Role: ${role.name} (ID: ${role.role_id})`);
        });
      }
      
      // Close database connection
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          process.exit(1);
        }
        console.log('\nDatabase verification complete.');
      });
    });
  });
});

// Handle unexpected errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  db.close(() => process.exit(1));
});
