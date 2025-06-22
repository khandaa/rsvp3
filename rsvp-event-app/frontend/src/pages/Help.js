import React from 'react';
import { Container, Typography, Paper, Box, Grid, Divider } from '@mui/material';
import DatabaseIcon from '@mui/icons-material/Storage';
import ApiIcon from '@mui/icons-material/Api';
import HelpIcon from '@mui/icons-material/Help';
import UsageIcon from '@mui/icons-material/TouchApp';

const Help = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help Documentation
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <HelpIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5" component="h2">
                Getting Started
              </Typography>
            </Box>
            <Typography paragraph>
              Welcome to the RSVP Event Management System. This application helps you manage events, 
              guests, and RSVPs efficiently. This help page will guide you through the system's features 
              and database structure.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <UsageIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5" component="h2">
                Using the Application
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom>User Roles</Typography>
            <Typography paragraph>
              <strong>Admin:</strong> Full access to all features including user management.<br />
              <strong>Event Organizer:</strong> Can create and manage events, guests, and send invitations.<br />
              <strong>Event Host:</strong> Can manage guests and RSVPs for assigned events.<br />
              <strong>Guest:</strong> Can view event details and respond to invitations.
            </Typography>

            <Typography variant="h6" gutterBottom mt={2}>Key Features</Typography>
            <Typography paragraph>
              <strong>Dashboard:</strong> View event statistics and upcoming events.<br />
              <strong>Events:</strong> Create, edit, and manage events.<br />
              <strong>Guests:</strong> Add and manage guests, create guest groups.<br />
              <strong>RSVPs:</strong> Track guest responses and attendance.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <DatabaseIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5" component="h2">
                Database Structure
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 2 }}>
              This application uses SQLite database with the following tables and relationships:
            </Typography>
            
            <Typography variant="h6" gutterBottom>Core Tables</Typography>
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Users</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - username: Unique username<br />
                - email: Unique email address<br />
                - password: Encrypted password<br />
                - firstName: User's first name<br />
                - lastName: User's last name<br />
                - status: Account status (active, inactive)<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> One-to-many with Events (as creator), many-to-many with Roles
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Roles</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - name: Role name (admin, event_organizer, event_host, guest)<br />
                - description: Role description<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Many-to-many with Users through UserRoles
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Events</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - name: Event name<br />
                - description: Event description<br />
                - startDate: Event start date/time<br />
                - endDate: Event end date/time<br />
                - status: Status (draft, published, canceled, completed)<br />
                - type: Event type (wedding, conference, etc.)<br />
                - maxGuests: Maximum number of guests<br />
                - creatorId: Foreign key to Users<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Many-to-many with Guests through EventGuests, one-to-many with EventVenues
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Guests</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - firstName: Guest's first name<br />
                - lastName: Guest's last name<br />
                - email: Guest's email address<br />
                - phone: Guest's phone number<br />
                - isVIP: VIP status flag<br />
                - notes: Additional notes<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Many-to-many with Events through EventGuests, one-to-many with RSVPs
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>EventGuests</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - eventId: Foreign key to Events<br />
                - guestId: Foreign key to Guests<br />
                - invitationSent: Flag indicating invitation status<br />
                - isConfirmed: Confirmation status<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Belongs to Events and Guests (junction table)
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>RSVPs</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - eventId: Foreign key to Events<br />
                - guestId: Foreign key to Guests<br />
                - status: RSVP status (attending, declined, maybe)<br />
                - plusOnes: Number of additional guests<br />
                - dietaryRestrictions: Dietary needs<br />
                - comments: Additional comments<br />
                - token: Unique token for RSVP link<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Belongs to Events and Guests, one-to-many with RSVPPlusOnes
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box mb={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>EventVenues</Typography>
              <Typography variant="body2" sx={{ ml: 2 }}>
                - id: Primary key<br />
                - eventId: Foreign key to Events<br />
                - name: Venue name<br />
                - addressLine1: Address line 1<br />
                - addressLine2: Address line 2<br />
                - city: City<br />
                - state: State/Province<br />
                - postalCode: Postal/ZIP code<br />
                - country: Country<br />
                - isPrimary: Primary venue flag<br />
                - createdAt: Timestamp<br />
                - updatedAt: Timestamp
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Relationships:</strong> Belongs to Events
              </Typography>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <ApiIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h5" component="h2">
                API Documentation
              </Typography>
            </Box>
            <Typography paragraph>
              The RSVP Event Management System provides a RESTful API for interacting with the system.
              Key endpoints include:
            </Typography>
            <Typography component="div" variant="body2" sx={{ ml: 2 }}>
              <strong>Authentication:</strong><br />
              - POST /api/auth/login - User login<br />
              - POST /api/auth/register - User registration<br />
              <br />
              <strong>Events:</strong><br />
              - GET /api/events - List events<br />
              - POST /api/events - Create event<br />
              - GET /api/events/:id - Get event details<br />
              - PUT /api/events/:id - Update event<br />
              - DELETE /api/events/:id - Delete event<br />
              <br />
              <strong>Guests:</strong><br />
              - GET /api/guests - List guests<br />
              - POST /api/guests - Add guest<br />
              - GET /api/guests/:id - Get guest details<br />
              - PUT /api/guests/:id - Update guest<br />
              - DELETE /api/guests/:id - Delete guest<br />
              <br />
              <strong>RSVPs:</strong><br />
              - GET /api/events/:eventId/rsvps - List RSVPs for an event<br />
              - POST /api/events/:eventId/rsvps - Create RSVP<br />
              - PUT /api/events/:eventId/rsvps/:id - Update RSVP<br />
              <br />
              <strong>Dashboard:</strong><br />
              - GET /api/dashboard/stats - Get dashboard statistics
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Help;
