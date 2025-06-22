const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// Public endpoint for development purposes
router.get('/stats/public', getDashboardStats);

// Protected endpoint for production use
router.get('/stats', protect, getDashboardStats);

module.exports = router;
