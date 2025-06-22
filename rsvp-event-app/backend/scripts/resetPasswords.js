/**
 * Reset Password Script
 * ====================
 * This script resets the password for all users in the database to 'Admin@123'
 * Run this script when you need to ensure consistent login credentials for testing
 */

const db = require('../models');
const bcrypt = require('bcryptjs');
const { User } = db;

async function resetPasswords() {
  try {
    console.log('Starting password reset process...');
    
    // Get all users
    const users = await User.findAll();
    console.log(`Found ${users.length} users`);
    
    // Default password to set for all users
    const defaultPassword = 'Admin@123';
    
    // Process users and update passwords
    for (const user of users) {
      console.log(`Resetting password for user: ${user.username} (${user.email})`);
      
      // Set raw password so the User model's beforeSave hook will hash it properly
      user.password = defaultPassword;
      await user.save();
      
      console.log(`✓ Password reset for ${user.username}`);
    }
    
    console.log('\nPassword reset complete!');
    console.log('You can now log in with the following credentials:');
    console.log('- Username: [any username]');
    console.log('- Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
}

// Connect to the database and run the function
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    resetPasswords();
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
