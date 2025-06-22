require('dotenv').config();
const { sequelize, User, Role } = require('../models');
const bcrypt = require('bcryptjs');

const createSampleUsers = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database');

    // Create sample users
    const sampleUsers = [
      {
        username: 'user1',
        firstName: 'User',
        lastName: 'One',
        email: 'user1@example.com',
        password: 'Admin@123',
        phone: '1234567890',
        isActive: true,
      },
      {
        username: 'user2',
        firstName: 'User',
        lastName: 'Two',
        email: 'user2@example.com',
        password: 'Admin@123',
        phone: '2234567890',
        isActive: true,
      },
      {
        username: 'user3',
        firstName: 'User',
        lastName: 'Three',
        email: 'user3@example.com',
        password: 'Admin@123',
        phone: '3234567890',
        isActive: true,
      },
    ];

    // Check if guest role exists and use it (it's a valid role in the model)
    const userRole = await Role.findOrCreate({
      where: { name: 'guest' },
      defaults: {
        name: 'guest',
        description: 'Regular users with guest privileges',
        permissions: JSON.stringify(['read:own']),
      },
    });

    const userRoleId = userRole[0].id;

    // Create users
    for (const userData of sampleUsers) {
      try {
        const existingUser = await User.findOne({ where: { email: userData.email } });

        if (existingUser) {
          console.log(`User with email ${userData.email} already exists, skipping.`);
        } else {
          // Hash password
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userData.password, salt);

          // Create user with role
          const user = await User.create({
            ...userData,
            password: hashedPassword,
            roleId: userRoleId
          });

          console.log(`Created user: ${user.email}`);
        }
      } catch (error) {
        console.error(`Error creating user ${userData.email}:`, error.message);
      }
    }

    console.log('Sample users creation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createSampleUsers();
