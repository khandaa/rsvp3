/**
 * Database Connection Test
 * Tests that the SQLite database connection is working properly
 */

const path = require('path');
const { db } = require('../backend/db/sqlite');

describe('SQLite Database Connection', () => {
  afterAll((done) => {
    db.close((err) => {
      if (err) console.error(err);
      done();
    });
  });
  
  test('should connect to the database', (done) => {
    db.get('SELECT sqlite_version() AS version', (err, row) => {
      if (err) {
        done(err);
        return;
      }
      expect(row).toBeDefined();
      expect(row.version).toBeDefined();
      console.log(`SQLite version: ${row.version}`);
      done();
    });
  });
  
  test('should have a users table with default admin user', (done) => {
    db.get('SELECT username FROM users WHERE username = "admin"', (err, row) => {
      if (err) {
        done(err);
        return;
      }
      expect(row).toBeDefined();
      expect(row.username).toBe('admin');
      done();
    });
  });
  
  test('should have all required tables', (done) => {
    const requiredTables = [
      'users', 'roles', 'user_roles', 'permissions', 'role_permissions',
      'events', 'event_venues', 'event_schedules',
      'guests', 'guest_groups', 'guest_group_members',
      'rsvp_invitations', 'rsvp_responses', 'rsvp_plus_ones',
      'accommodations', 'guest_accommodations', 'transportation'
    ];
    
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (err) {
        done(err);
        return;
      }
      
      const tableNames = rows.map(row => row.name)
        .filter(name => !name.startsWith('sqlite_'));
      
      requiredTables.forEach(tableName => {
        expect(tableNames).toContain(tableName);
      });
      
      done();
    });
  });
});
