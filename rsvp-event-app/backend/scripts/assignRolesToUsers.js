/**
 * Script to assign roles to users
 * ===============================
 * This script assigns appropriate roles to existing users:
 * - Assigns admin role to admin user
 * - Assigns guest role to regular users
 */

const db = require('../models');
const { User, Role } = db;

async function assignRolesToUsers() {
  try {
    console.log('Starting role assignment process...');
    
    // Get all roles
    const roles = await Role.findAll();
    console.log(`Found ${roles.length} roles`);
    
    const adminRole = roles.find(role => role.name === 'admin');
    const guestRole = roles.find(role => role.name === 'guest');
    
    if (!adminRole || !guestRole) {
      console.error('Required roles not found, please run createRoles.js first');
      process.exit(1);
    }
    
    console.log(`Admin role ID: ${adminRole.id}`);
    console.log(`Guest role ID: ${guestRole.id}`);
    
    // Get all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users`);
    
    // Process users and assign roles
    for (const user of users) {
      console.log(`Processing user: ${user.username} (${user.email})`);
      
      // Clear existing roles first to avoid duplicates
      await user.setRoles([]);
      
      // Assign appropriate role
      if (user.username === 'admin') {
        await user.addRole(adminRole);
        console.log(`✓ Assigned admin role to ${user.username}`);
      } else {
        await user.addRole(guestRole);
        console.log(`✓ Assigned guest role to ${user.username}`);
      }
    }
    
    console.log('\nRole assignment complete!');
    console.log('You can now test login with the following credentials:');
    console.log('- Admin: admin@example.com / admin');
    console.log('- User: user1@example.com / Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error assigning roles to users:', error);
    process.exit(1);
  }
}

// Connect to the database and run the function
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    assignRolesToUsers();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
