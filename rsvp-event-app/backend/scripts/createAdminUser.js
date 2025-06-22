require('dotenv').config();
const { sequelize, User, Role } = require('../models');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connected to the database');

    // Check if admin role exists and create it if it doesn't
    const adminRole = await Role.findOrCreate({
      where: { name: 'admin' },
      defaults: {
        name: 'admin',
        description: 'Administrator with full system access',
        permissions: JSON.stringify(['create:any', 'read:any', 'update:any', 'delete:any']),
      },
    });

    const adminRoleId = adminRole[0].id;

    // Admin user data
    const adminData = {
      username: 'admin',
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@example.com',
      password: 'admin',
      phone: '9999999999',
      isActive: true,
    };

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { username: adminData.username } });

    if (existingAdmin) {
      console.log(`Admin user already exists, skipping.`);
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Create admin user
      const admin = await User.create({
        ...adminData,
        password: hashedPassword,
        roleId: adminRoleId
      });

      console.log(`Created admin user: ${admin.email}`);
    }

    console.log('Admin user creation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser();
