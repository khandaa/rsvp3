import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Room as RoomIcon,
  DirectionsCar as TransportIcon,
  Hotel as AccommodationIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon
} from '@mui/icons-material';
import api from '../../services/api';

// Tab panel component for organizing content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`logistics-tabpanel-${index}`}
      aria-labelledby={`logistics-tab-${index}`}
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

// Tab props
function a11yProps(index) {
  return {
    id: `logistics-tab-${index}`,
    'aria-controls': `logistics-tabpanel-${index}`,
  };
}

export default function LogisticsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Logistics data
  const [accommodations, setAccommodations] = useState([]);
  const [transportation, setTransportation] = useState([]);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetchEventDetails();
    fetchLogisticsData();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      // In a real app, this would be an API call
      // const { data } = await api.get(`/api/events/${eventId}`);
      
      // Mock event data
      const mockEvent = {
        id: parseInt(eventId),
        name: 'Annual Company Conference',
        startDate: '2025-07-15T09:00:00',
        endDate: '2025-07-17T17:00:00',
        location: 'Convention Center',
        address: '123 Main Street, Cityville, State 12345'
      };
      
      setTimeout(() => {
        setEvent(mockEvent);
      }, 300);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details. Please try again.');
    }
  };

  const fetchLogisticsData = async () => {
    try {
      setLoading(true);
      
      // In a real app, these would be API calls
      // const accommodationsRes = await api.get(`/api/events/${eventId}/accommodations`);
      // const transportationRes = await api.get(`/api/events/${eventId}/transportation`);
      // const venuesRes = await api.get(`/api/events/${eventId}/venues`);
      
      // Mock data
      const mockAccommodations = [
        {
          id: 1,
          name: 'Grand Hotel',
          type: 'Hotel',
          address: '100 Main St, Cityville',
          contactInfo: '555-123-4567',
          roomCount: 50,
          notes: 'Group booking rate available until June 15',
          bookingCode: 'CONF2025'
        },
        {
          id: 2,
          name: 'Business Suites',
          type: 'Hotel',
          address: '200 Commerce Ave, Cityville',
          contactInfo: '555-987-6543',
          roomCount: 30,
          notes: 'Executive suites available',
          bookingCode: 'EXEC2025'
        }
      ];
      
      const mockTransportation = [
        {
          id: 1,
          type: 'Shuttle',
          provider: 'City Express',
          description: 'Shuttle service from hotels to venue',
          departureLocation: 'Hotel entrance',
          arrivalLocation: 'Convention Center main entrance',
          schedule: [
            { time: '08:00 AM', note: 'Morning departure' },
            { time: '08:30 AM', note: 'Morning departure' },
            { time: '05:30 PM', note: 'Evening return' },
            { time: '06:00 PM', note: 'Evening return' }
          ],
          contactInfo: '555-789-0123',
          notes: 'Must show conference badge'
        },
        {
          id: 2,
          type: 'Airport Transfer',
          provider: 'Airport Shuttles Inc',
          description: 'Transport from airport to hotels',
          departureLocation: 'Airport Terminal 1 & 2',
          arrivalLocation: 'Conference Hotels',
          schedule: [
            { time: 'Every hour', note: 'From 6:00 AM to 10:00 PM' }
          ],
          contactInfo: '555-234-5678',
          notes: 'Book 24 hours in advance'
        }
      ];
      
      const mockVenues = [
        {
          id: 1,
          name: 'Main Hall',
          type: 'Conference Hall',
          address: '123 Main Street, Cityville',
          capacity: 200,
          facilities: ['Projector', 'Sound System', 'Wi-Fi'],
          contactPerson: 'John Manager',
          contactEmail: 'john@venue.com',
          notes: 'Main conference venue'
        },
        {
          id: 2,
          name: 'Workshop Rooms',
          type: 'Meeting Rooms',
          address: '123 Main Street, Cityville',
          capacity: 40,
          facilities: ['Whiteboards', 'Wi-Fi', 'Video conferencing'],
          contactPerson: 'Sarah Coordinator',
          contactEmail: 'sarah@venue.com',
          notes: 'Located on 2nd floor'
        }
      ];
      
      setTimeout(() => {
        setAccommodations(mockAccommodations);
        setTransportation(mockTransportation);
        setVenues(mockVenues);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching logistics data:', error);
      setError('Failed to load logistics data. Please try again.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddAccommodation = () => {
    navigate(`/events/${eventId}/logistics/accommodation/add`);
  };

  const handleEditAccommodation = (accommodationId) => {
    navigate(`/events/${eventId}/logistics/accommodation/edit/${accommodationId}`);
  };

  const handleAddTransportation = () => {
    navigate(`/events/${eventId}/logistics/transportation/add`);
  };

  const handleEditTransportation = (transportationId) => {
    navigate(`/events/${eventId}/logistics/transportation/edit/${transportationId}`);
  };

  const handleAddVenue = () => {
    navigate(`/events/${eventId}/logistics/venue/add`);
  };

  const handleEditVenue = (venueId) => {
    navigate(`/events/${eventId}/logistics/venue/edit/${venueId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(`/events/${eventId}`)}
            sx={{ mb: 1 }}
          >
            Back to Event
          </Button>
          <Typography variant="h4" component="h1" gutterBottom>
            Logistics - {event?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(event?.startDate).toLocaleDateString()} to {new Date(event?.endDate).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Venues" icon={<RoomIcon />} iconPosition="start" {...a11yProps(0)} />
          <Tab label="Accommodation" icon={<AccommodationIcon />} iconPosition="start" {...a11yProps(1)} />
          <Tab label="Transportation" icon={<TransportIcon />} iconPosition="start" {...a11yProps(2)} />
        </Tabs>

        {/* Venues Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Event Venues</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddVenue}
            >
              Add Venue
            </Button>
          </Box>

          {venues.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>No venues have been added yet.</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddVenue}
              >
                Add Your First Venue
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {venues.map((venue) => (
                <Grid item key={venue.id} xs={12} md={6}>
                  <Card>
                    <CardHeader
                      title={venue.name}
                      subheader={venue.type}
                      action={
                        <IconButton onClick={() => handleEditVenue(venue.id)}>
                          <EditIcon />
                        </IconButton>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Address:</strong> {venue.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Capacity:</strong> {venue.capacity} people
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Facilities:</strong> {venue.facilities.join(', ')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Contact:</strong> {venue.contactPerson} ({venue.contactEmail})
                      </Typography>
                      {venue.notes && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Notes:</strong> {venue.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Accommodation Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Accommodation Options</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAccommodation}
            >
              Add Accommodation
            </Button>
          </Box>

          {accommodations.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>No accommodations have been added yet.</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAccommodation}
              >
                Add Your First Accommodation
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {accommodations.map((accommodation) => (
                <Grid item key={accommodation.id} xs={12} md={6}>
                  <Card>
                    <CardHeader
                      title={accommodation.name}
                      subheader={accommodation.type}
                      action={
                        <IconButton onClick={() => handleEditAccommodation(accommodation.id)}>
                          <EditIcon />
                        </IconButton>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Address:</strong> {accommodation.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Contact:</strong> {accommodation.contactInfo}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Rooms Reserved:</strong> {accommodation.roomCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Booking Code:</strong> {accommodation.bookingCode}
                      </Typography>
                      {accommodation.notes && (
                        <Typography variant="body2" color="text.secondary">
                          <strong>Notes:</strong> {accommodation.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Transportation Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Transportation Options</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTransportation}
            >
              Add Transportation
            </Button>
          </Box>

          {transportation.length === 0 ? (
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography variant="body1" sx={{ mb: 2 }}>No transportation options have been added yet.</Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddTransportation}
              >
                Add Your First Transportation Option
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {transportation.map((transport) => (
                <Grid item key={transport.id} xs={12}>
                  <Card>
                    <CardHeader
                      title={transport.type}
                      subheader={transport.provider}
                      action={
                        <IconButton onClick={() => handleEditTransportation(transport.id)}>
                          <EditIcon />
                        </IconButton>
                      }
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Description:</strong> {transport.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Route:</strong> {transport.departureLocation} to {transport.arrivalLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        <strong>Contact:</strong> {transport.contactInfo}
                      </Typography>
                      
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Schedule:
                      </Typography>
                      <List dense>
                        {transport.schedule.map((item, index) => (
                          <ListItem key={index} disablePadding>
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {transport.type.toLowerCase().includes('airport') ? 
                                <FlightIcon fontSize="small" /> : 
                                <TransportIcon fontSize="small" />
                              }
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.time} 
                              secondary={item.note}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      {transport.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                          <strong>Notes:</strong> {transport.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>
    </Box>
  );
}
