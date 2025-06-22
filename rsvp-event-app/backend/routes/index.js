const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const eventRoutes = require('./events');
const notificationRoutes = require('./notifications');
const venueRoutes = require('./venues');
const guestGroupRoutes = require('./guestGroups');
const logisticsRoutes = require('./logistics');
const reportingRoutes = require('./reporting');
const dashboardRoutes = require('./dashboard');

// Register routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/notifications', notificationRoutes);
router.use('/venues', venueRoutes);
router.use('/guest-groups', guestGroupRoutes);
router.use('/logistics', logisticsRoutes);
router.use('/reporting', reportingRoutes);
router.use('/dashboard', dashboardRoutes);

// API health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date()
  });
});

module.exports = router;
