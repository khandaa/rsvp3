# Changelog

All notable changes to the RSVP Event Management Application will be documented in this file.

## [1.0.0] - 2025-06-22

### Added
- Initial release with core functionality
- User authentication with role-based access control
- Event creation and management features
- Guest list management and RSVP tracking
- Dashboard with real-time statistics
- Navigation menu with role-based visibility
- User role display in the navigation bar
- Placeholder pages for Transportation and Accommodations features

### Fixed
- API connection issues between frontend and backend
- Backend port configuration (running on 5010)
- Frontend API client base URL to match backend port
- Sequelize model association errors in dashboard controller
- JWT authentication and middleware issues
- Database query optimizations for event statistics

### Changed
- Updated navigation menu items and visibility permissions
- Improved dashboard data retrieval with real-time statistics
- Enhanced error handling for API requests
- Optimized database queries
- Updated environment configurations for development and production

### Security
- Implemented proper CORS configuration for production
- Enhanced JWT token verification
- Role-based access control for API endpoints
