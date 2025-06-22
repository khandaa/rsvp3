/**
 * Fix User Roles Table Script
 * ===========================
 * This script fixes the user_roles table by recreating it with correct constraints
 * for a proper many-to-many relationship between users and roles.
 */

const db = require('../models');
const { QueryTypes } = require('sequelize');
const sequelize = db.sequelize;

async function fixUserRolesTable() {
  try {
    console.log('Starting user_roles table fix...');
    
    // Start with a clean slate
    await sequelize.query('DROP TABLE IF EXISTS user_roles');
    console.log('Dropped existing user_roles table');
    
    // Create the table again with correct constraints (unique on the combination, not individual columns)
    await sequelize.query(`
      CREATE TABLE user_roles (
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        role_id INTEGER NOT NULL REFERENCES roles(id),
        user_id INTEGER NOT NULL REFERENCES users(id),
        PRIMARY KEY (role_id, user_id)
      )
    `);
    console.log('Created user_roles table with correct constraints');
    
    // Get roles
    const [roles] = await sequelize.query('SELECT id, name FROM roles');
    console.log(`Found ${roles.length} roles`);
    
    const adminRoleId = roles.find(r => r.name === 'admin')?.id;
    const guestRoleId = roles.find(r => r.name === 'guest')?.id;
    
    if (!adminRoleId || !guestRoleId) {
      throw new Error('Required roles not found. Please run createRoles.js first.');
    }
    
    console.log(`Admin role ID: ${adminRoleId}`);
    console.log(`Guest role ID: ${guestRoleId}`);
    
    // Get users
    const [users] = await sequelize.query('SELECT id, username, email FROM users');
    console.log(`\nFound ${users.length} users:`);
    users.forEach(user => console.log(`- ${user.username} (${user.email}) [ID: ${user.id}]`));
    
    // Create a map of user assignments to track what we'll add
    const userAssignments = [];
    
    // Prepare role assignments
    for (const user of users) {
      const roleId = user.username === 'admin' ? adminRoleId : guestRoleId;
      userAssignments.push({ userId: user.id, roleId, username: user.username });
    }
    
    console.log('\nAssigning roles to users:');
    
    // Assign roles in a single batch
    for (const assignment of userAssignments) {
      try {
        await sequelize.query(`
          INSERT INTO user_roles (role_id, user_id, created_at, updated_at)
          VALUES (?, ?, datetime('now'), datetime('now'))
        `, { 
          replacements: [assignment.roleId, assignment.userId],
          type: QueryTypes.INSERT
        });
        console.log(`✓ Assigned ${assignment.roleId === adminRoleId ? 'admin' : 'guest'} role to user ${assignment.username} (ID: ${assignment.userId})`);
      } catch (err) {
        console.error(`✗ Failed to assign role to ${assignment.username}: ${err.message}`);
      }
    }
    
    // Verify the assignments
    const [assignments] = await sequelize.query(`
      SELECT u.username, r.name as role_name 
      FROM user_roles ur 
      JOIN users u ON ur.user_id = u.id 
      JOIN roles r ON ur.role_id = r.id
    `);
    
    console.log('\nRole assignment summary:');
    assignments.forEach(a => console.log(`- User ${a.username} has role: ${a.role_name}`));
    
    console.log('\nUser-role relationship fixed successfully!');
    console.log('You can now test login with the following credentials:');
    console.log('- Admin: admin@example.com / admin');
    console.log('- User: user1@example.com / Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error fixing user_roles table:', error);
    process.exit(1);
  }
}

// Connect to the database and run the function
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    fixUserRolesTable();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
