import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
  Code as CodeIcon,
  Check as CheckIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`help-tabpanel-${index}`}
      aria-labelledby={`help-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function HelpPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Help & Documentation
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<HelpIcon />} label="User Guide" />
          <Tab icon={<StorageIcon />} label="Database" />
          <Tab icon={<CodeIcon />} label="API Reference" />
          <Tab icon={<InfoIcon />} label="About" />
        </Tabs>

        {/* User Guide Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Getting Started
          </Typography>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Creating an Event</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                To create a new event:
              </Typography>
              <ol>
                <li>Navigate to the Events page from the sidebar menu</li>
                <li>Click the "Create Event" button in the top right corner</li>
                <li>Fill out the event details form including name, date, and location</li>
                <li>Click "Save" to create your event</li>
              </ol>
              <Typography paragraph>
                Once created, you can manage your event details, guest list, and view RSVPs from the event details page.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Managing Guests</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                You can add guests individually or import them in bulk:
              </Typography>
              <ul>
                <li>Individual: Go to the Guests tab on your event and click "Add Guest"</li>
                <li>Bulk Import: Use the "Import Guests" option and upload a CSV file</li>
              </ul>
              <Typography paragraph>
                For bulk imports, download our template CSV first to ensure your data is formatted correctly.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Managing RSVPs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                There are two ways to collect RSVPs:
              </Typography>
              <ol>
                <li>Public RSVP form - share a link with your guests</li>
                <li>Manual entry - add responses yourself in the admin dashboard</li>
              </ol>
              <Typography paragraph>
                To share the public RSVP link, go to your event details page and click the "Share" button.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </TabPanel>

        {/* Database Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Database Structure
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Users Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="id (Primary Key)" secondary="Integer, Auto-increment" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="email" secondary="String, Unique" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="name" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="password" secondary="String (hashed)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="role" secondary="String (admin, user)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="created_at" secondary="DateTime" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="updated_at" secondary="DateTime" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Events Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="id (Primary Key)" secondary="Integer, Auto-increment" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="name" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="description" secondary="Text" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="date" secondary="DateTime" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="location" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="user_id (Foreign Key)" secondary="Integer, references Users" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Guests Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="id (Primary Key)" secondary="Integer, Auto-increment" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="name" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="email" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="phone" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="event_id (Foreign Key)" secondary="Integer, references Events" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    RSVPs Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="id (Primary Key)" secondary="Integer, Auto-increment" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="guest_id (Foreign Key)" secondary="Integer, references Guests" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="event_id (Foreign Key)" secondary="Integer, references Events" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="status" secondary="String (attending, declined, pending)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="response_date" secondary="DateTime" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Activity Logs Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="id (Primary Key)" secondary="Integer, Auto-increment" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="user_id (Foreign Key)" secondary="Integer, references Users" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="action" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="entity_type" secondary="String (event, guest, rsvp, user)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="entity_id" secondary="Integer" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="timestamp" secondary="DateTime" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Settings Table
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    <ListItem>
                      <ListItemText primary="key (Primary Key)" secondary="String" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="value" secondary="Text" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="description" secondary="String" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* API Reference Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            API Endpoints
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Authentication</Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">POST /api/auth/login</Typography>
              <Typography variant="body2">Authenticate a user and get an access token</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">
                  Request body: {`{ email: string, password: string }`}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Events</Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">GET /api/events</Typography>
              <Typography variant="body2">Get all events</Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">POST /api/events</Typography>
              <Typography variant="body2">Create a new event</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">
                  Request body: Event object
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Guests</Typography>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">GET /api/guests</Typography>
              <Typography variant="body2">Get all guests</Typography>
            </CardContent>
          </Card>
          
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">POST /api/events/:eventId/guests/import</Typography>
              <Typography variant="body2">Import guests from CSV</Typography>
            </CardContent>
          </Card>
        </TabPanel>
        
        {/* About Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            About RSVP Event App
          </Typography>
          
          <Typography paragraph>
            RSVP Event App is a comprehensive event management solution designed to make organizing events and managing guest lists simple and efficient.
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Version</Typography>
          <Typography paragraph>3.0.0</Typography>
          
          <Typography variant="h6" sx={{ mt: 3 }}>Features</Typography>
          <List>
            <ListItem>
              <ListItemIcon><CheckIcon /></ListItemIcon>
              <ListItemText primary="Event creation and management" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon /></ListItemIcon>
              <ListItemText primary="Guest list management" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon /></ListItemIcon>
              <ListItemText primary="RSVP tracking" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon /></ListItemIcon>
              <ListItemText primary="Public RSVP forms" />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckIcon /></ListItemIcon>
              <ListItemText primary="Analytics and reporting" />
            </ListItem>
          </List>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default HelpPage;
