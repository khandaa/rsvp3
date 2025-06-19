import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Paper,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import defaultEventImage from '../../assets/images/default-event.jpg';

export default function PublicEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call to get public event details
      // const { data } = await api.get(`/api/events/public/${id}`);
      
      // Mock data
      const mockEvent = {
        id: parseInt(id),
        name: 'Annual Company Conference',
        description: 'Join us for our annual company conference where we discuss the future of our company. This all-day event includes presentations from leadership, workshops, networking opportunities, and a catered lunch.',
        date: '2025-07-15T09:00:00',
        endDate: '2025-07-15T17:00:00',
        location: 'Convention Center',
        address: '123 Main Street, Cityville, State 12345',
        category: 'Corporate',
        status: 'upcoming',
        isPublic: true,
        imageUrl: null,
        capacity: 150,
        registrationOpen: true,
        organizerName: 'Events Team',
        organizerEmail: 'events@company.com',
        eventWebsite: 'https://company.com/conference-2025',
        agenda: [
          { time: '09:00 AM', title: 'Registration & Breakfast' },
          { time: '10:00 AM', title: 'Keynote Address' },
          { time: '11:30 AM', title: 'Breakout Sessions' },
          { time: '01:00 PM', title: 'Lunch' },
          { time: '02:00 PM', title: 'Workshops' },
          { time: '04:00 PM', title: 'Closing Remarks' },
          { time: '05:00 PM', title: 'Networking Reception' }
        ],
        additionalInfo: 'Please bring your company ID for check-in. Business casual attire is requested.'
      };
      
      // Only show event if it's public
      if (!mockEvent.isPublic) {
        setError('This event is not available for public viewing');
        setLoading(false);
        return;
      }
      
      setTimeout(() => {
        setEvent(mockEvent);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details. The event may not exist or is not public.');
      setLoading(false);
    }
  };

  const handleRSVP = () => {
    navigate(`/rsvp/${event.id}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Back to Homepage
          </Button>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Event not found</Typography>
          <Button 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Back to Homepage
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header Section */}
        <Card sx={{ mb: 4, position: 'relative' }}>
          <CardMedia
            component="img"
            height="240"
            image={event.imageUrl || defaultEventImage}
            alt={event.name}
          />
          <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(0, 0, 0, 0.6)', p: 2 }}>
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {event.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Chip 
                label={event.category}
                variant="outlined"
                size="small"
                sx={{ color: 'white', borderColor: 'white' }}
              />
              {event.registrationOpen && (
                <Chip 
                  label="Registration Open"
                  color="success"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
        </Card>

        {/* RSVP Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleRSVP}
            disabled={!event.registrationOpen}
            sx={{ py: 1.5, px: 4, fontSize: '1.1rem' }}
          >
            {event.registrationOpen ? 'RSVP Now' : 'Registration Closed'}
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>About This Event</Typography>
              <Typography variant="body1" paragraph>
                {event.description}
              </Typography>
              
              {event.additionalInfo && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Additional Information</Typography>
                  <Typography variant="body1">
                    {event.additionalInfo}
                  </Typography>
                </>
              )}
            </Paper>
            
            {event.agenda && event.agenda.length > 0 && (
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Event Agenda</Typography>
                <List>
                  {event.agenda.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.title}
                            </Typography>
                          }
                          secondary={item.time}
                        />
                      </ListItem>
                      {index < event.agenda.length - 1 && (
                        <Divider component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h5" gutterBottom>Event Details</Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Date & Time</Typography>
                  <Typography variant="body2">
                    {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  {event.endDate && (
                    <Typography variant="body2">
                      to {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Location</Typography>
                  <Typography variant="body2">{event.location}</Typography>
                  {event.address && (
                    <Typography variant="body2" color="text.secondary">
                      {event.address}
                    </Typography>
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">Organized by</Typography>
                  <Typography variant="body2">{event.organizerName}</Typography>
                </Box>
              </Box>
              
              {event.organizerEmail && (
                <>
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">Contact</Typography>
                      <Typography variant="body2">{event.organizerEmail}</Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleRSVP}
                disabled={!event.registrationOpen}
                fullWidth
              >
                {event.registrationOpen ? 'RSVP for this Event' : 'Registration Closed'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
