import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Edit, Delete, Email, Phone, LocationOn, ArrowBack, Event } from '@mui/icons-material';
import { toast } from 'react-toastify';

// Services
import guestService from '../../services/guestService';
import rsvpService from '../../services/rsvpService';
import eventService from '../../services/eventService';

function GuestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guest, setGuest] = useState(null);
  const [events, setEvents] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const guestData = await guestService.getGuestById(id);
        setGuest(guestData);

        // Load related events and RSVPs
        const guestRsvps = await rsvpService.getRsvpsByGuestId(id);
        setRsvps(guestRsvps);

        const eventIds = guestRsvps.map(rsvp => rsvp.eventId);
        const eventsData = await eventService.getEventsByIds(eventIds);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading guest details:', error);
        toast.error('Failed to load guest details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditGuest = () => {
    navigate(`/guests/${id}/edit`);
  };

  const handleDeleteGuest = async () => {
    if (window.confirm('Are you sure you want to delete this guest? This action cannot be undone.')) {
      try {
        await guestService.deleteGuest(id);
        toast.success('Guest deleted successfully');
        navigate('/guests');
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast.error('Failed to delete guest');
      }
    }
  };

  const getInitials = (firstName, lastName) => {
    return (
      (firstName ? firstName[0].toUpperCase() : '') + 
      (lastName ? lastName[0].toUpperCase() : '')
    );
  };

  const getRsvpStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'attending':
        return 'success';
      case 'declined':
        return 'error';
      case 'maybe':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!guest) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4">Guest not found</Typography>
        <Button 
          startIcon={<ArrowBack />} 
          variant="contained" 
          sx={{ mt: 2 }} 
          onClick={() => navigate('/guests')}
        >
          Back to Guests
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          variant="outlined" 
          onClick={() => navigate('/guests')}
        >
          Back to Guests
        </Button>
        <Box>
          <Button 
            startIcon={<Edit />} 
            variant="outlined" 
            sx={{ mr: 1 }} 
            onClick={handleEditGuest}
          >
            Edit
          </Button>
          <Button 
            startIcon={<Delete />} 
            variant="outlined" 
            color="error" 
            onClick={handleDeleteGuest}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3} md={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar 
                sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '2rem' }}
              >
                {getInitials(guest.firstName, guest.lastName)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <Typography variant="h4" gutterBottom>
                {guest.firstName} {guest.lastName}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {guest.email && (
                  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">{guest.email}</Typography>
                  </Grid>
                )}
                {guest.phone && (
                  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">{guest.phone}</Typography>
                  </Grid>
                )}
                {(guest.city || guest.state || guest.country) && (
                  <Grid item xs={12} sm={6} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {[guest.city, guest.state, guest.country].filter(Boolean).join(', ')}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {guest.tags && guest.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  {guest.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              )}

              {guest.isVip && (
                <Chip 
                  label="VIP" 
                  color="primary" 
                  sx={{ mt: 1 }} 
                />
              )}
            </Grid>
          </Grid>

          {guest.notes && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Notes</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2">{guest.notes}</Typography>
              </Paper>
            </Box>
          )}
        </CardContent>
      </Card>

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Events & RSVPs" />
          <Tab label="Custom Fields" />
        </Tabs>
        
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {rsvps.length > 0 ? (
              <List>
                {rsvps.map((rsvp) => {
                  const event = events.find(e => e.id === rsvp.eventId) || {};
                  return (
                    <ListItem
                      key={rsvp.id}
                      secondaryAction={
                        <Chip 
                          label={rsvp.status} 
                          color={getRsvpStatusColor(rsvp.status)} 
                          size="small"
                        />
                      }
                      divider
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {event.name || 'Unknown Event'}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Event fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                            <Typography variant="body2" color="text.secondary">
                              {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date not available'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                No RSVPs found for this guest
              </Typography>
            )}
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            {guest.customFields && Object.keys(guest.customFields).length > 0 ? (
              <List>
                {Object.entries(guest.customFields).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText
                      primary={key}
                      secondary={String(value)}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
                No custom fields for this guest
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default GuestDetailsPage;
