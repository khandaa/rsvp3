# RSVP Event Management Application

A comprehensive event management application built with React frontend and Express backend, allowing users to create events, manage guest lists, track RSVPs, and more.

## Features

- User authentication with role-based access control
- Event creation and management
- Guest management and RSVP tracking
- Dashboard with real-time statistics
- Role-based navigation and permissions

## Tech Stack

### Backend
- Express.js API framework
- SQLite database with Sequelize ORM
- JWT-based authentication
- RESTful API design

### Frontend
- React with Material-UI components
- React Router for navigation
- Axios for API communication
- Responsive design for mobile and desktop views

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd rsvp-event-app
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd ../frontend
npm install
```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Create a `.env` file in the frontend directory

5. Start the development servers:
```
npm run start
```

## Deployment

### Backend Deployment
- Set NODE_ENV=production for production deployment
- Configure a proper database connection for production
- Set secure CORS settings

### Frontend Deployment
- Build the production version with `npm run build`
- Deploy the static files to a hosting service

## Default Admin Credentials
- Username: admin
- Password: admin

## Database Structure
The application uses SQLite with the following key tables:
- Users: User accounts and authentication
- Events: Event details and configuration
- Guests: Guest information and contact details
- RSVPs: Tracks guest responses and attendance
- Roles: User role definitions for permissions

See the full database schema documentation in the help section of the application.

## License
[Your License]
