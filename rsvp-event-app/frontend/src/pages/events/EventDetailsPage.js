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
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Share as ShareIcon,
  PersonAdd as InviteIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import defaultEventImage from '../../assets/images/default-event.jpg';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [guestList, setGuestList] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);

  useEffect(() => {
    fetchEventDetails();
    fetchGuestList();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const { data } = await api.get(`/api/events/${id}`);
      
      // Mock data
      const mockEvent = {
        id: parseInt(id),
        name: 'Annual Company Conference',
        description: 'Join us for our annual company conference where we discuss the future of our company. This all-day event includes presentations from leadership, workshops, networking opportunities, and a catered lunch. All employees are required to attend.',
        date: '2025-07-15T09:00:00',
        endDate: '2025-07-15T17:00:00',
        location: 'Convention Center',
        address: '123 Main Street, Cityville, State 12345',
        category: 'Corporate',
        status: 'upcoming',
        isPublic: true,
        imageUrl: null,
        capacity: 150,
        registeredCount: 120,
        confirmedCount: 95,
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
      
      setTimeout(() => {
        setEvent(mockEvent);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      setLoading(false);
    }
  };

  const fetchGuestList = async () => {
    try {
      // In a real app, this would be an API call
      // const { data } = await api.get(`/api/events/${id}/guests`);
      
      // Mock data
      const mockGuests = [
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'confirmed', avatar: null },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'confirmed', avatar: null },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', status: 'pending', avatar: null },
        { id: 4, name: 'Bob Brown', email: 'bob@example.com', status: 'confirmed', avatar: null },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'declined', avatar: null },
      ];
      
      setGuestList(mockGuests);
    } catch (error) {
      console.error('Error fetching guest list:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    navigate(`/events/${id}/edit`);
  };

  const openDeleteDialog = () => {
    setDeleteDialog(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleDeleteEvent = async () => {
    try {
      // In a real app, make an API call to delete the event
      // await api.delete(`/api/events/${id}`);
      
      closeDeleteDialog();
      navigate('/events', { state: { message: 'Event successfully deleted' } });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const openShareDialog = () => {
    setShareDialog(true);
  };

  const closeShareDialog = () => {
    setShareDialog(false);
  };

  const handleInviteGuests = () => {
    navigate(`/guests/invite/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6">Event not found</Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Card sx={{ mb: 4, position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={event.imageUrl || defaultEventImage}
          alt={event.name}
        />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'rgba(0, 0, 0, 0.6)', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {event.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip 
                  label={event.status === 'upcoming' ? 'Upcoming' : event.status}
                  color={event.status === 'upcoming' ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={event.category}
                  variant="outlined"
                  size="small"
                  sx={{ color: 'white', borderColor: 'white' }}
                />
              </Box>
            </Box>
            
            {hasPermission('event_host') && (
              <Box>
                <IconButton onClick={handleEditClick} sx={{ color: 'white' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={openDeleteDialog} sx={{ color: 'white' }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<ShareIcon />}
          onClick={openShareDialog}
        >
          Share
        </Button>
        
        {hasPermission('event_host') && (
          <Button
            variant="contained"
            startIcon={<InviteIcon />}
            onClick={handleInviteGuests}
          >
            Invite Guests
          </Button>
        )}
      </Box>

      {/* Event Details Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="event details tabs">
            <Tab label="Overview" />
            <Tab label="Guest List" />
            <Tab label="Agenda" />
          </Tabs>
        </Box>
        
        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Typography variant="body1" paragraph>
                  {event.description}
                </Typography>
                
                {event.additionalInfo && (
                  <>
                    <Typography variant="h6" gutterBottom>Additional Information</Typography>
                    <Typography variant="body1">
                      {event.additionalInfo}
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>Event Details</Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Date & Time</Typography>
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
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Location</Typography>
                    <Typography variant="body2">{event.location}</Typography>
                    {event.address && (
                      <Typography variant="body2" color="text.secondary">
                        {event.address}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Attendance</Typography>
                    <Typography variant="body2">
                      {event.confirmedCount} confirmed of {event.registeredCount} registered
                    </Typography>
                    {event.capacity && (
                      <Typography variant="body2" color="text.secondary">
                        Capacity: {event.capacity}
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="subtitle2">Organizer</Typography>
                    <Typography variant="body2">{event.organizerName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.organizerEmail}
                    </Typography>
                  </Box>
                </Box>
                
                {event.eventWebsite && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LinkIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2">Website</Typography>
                        <Link href={event.eventWebsite} target="_blank" rel="noopener">
                          {event.eventWebsite}
                        </Link>
                      </Box>
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Guest List Tab */}
        <TabPanel value={tabValue} index={1}>
          <Paper>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Guest List ({guestList.length})
              </Typography>
              
              {hasPermission('event_host') && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<InviteIcon />}
                  onClick={handleInviteGuests}
                >
                  Invite More
                </Button>
              )}
            </Box>
            
            <Divider />
            
            {guestList.length > 0 ? (
              <List>
                {guestList.map((guest) => (
                  <React.Fragment key={guest.id}>
                    <ListItem 
                      button 
                      onClick={() => hasPermission('event_host') && navigate(`/guests/${guest.id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar src={guest.avatar}>
                          {guest.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={guest.name}
                        secondary={guest.email}
                      />
                      <Chip 
                        label={guest.status}
                        color={
                          guest.status === 'confirmed' ? 'success' :
                          guest.status === 'pending' ? 'warning' :
                          guest.status === 'declined' ? 'error' : 'default'
                        }
                        size="small"
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No guests have been invited yet
                </Typography>
                {hasPermission('event_host') && (
                  <Button
                    variant="outlined"
                    startIcon={<InviteIcon />}
                    sx={{ mt: 2 }}
                    onClick={handleInviteGuests}
                  >
                    Invite Guests
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </TabPanel>
        
        {/* Agenda Tab */}
        <TabPanel value={tabValue} index={2}>
          {event.agenda && event.agenda.length > 0 ? (
            <Paper>
              <List>
                {event.agenda.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1">
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
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No agenda items have been added yet
              </Typography>
              {hasPermission('event_host') && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  sx={{ mt: 2 }}
                  onClick={handleEditClick}
                >
                  Edit Event to Add Agenda
                </Button>
              )}
            </Box>
          )}
        </TabPanel>
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? All related guests, RSVPs, and logistics will be deleted as well. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={shareDialog} onClose={closeShareDialog}>
        <DialogTitle>Share Event</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Share this event with others:
          </DialogContentText>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Public Link:</Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={`${window.location.origin}/events/public/${event.id}`}
                InputProps={{ readOnly: true }}
              />
              <Button
                variant="contained"
                sx={{ ml: 1 }}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/events/public/${event.id}`);
                }}
              >
                Copy
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <IconButton color="primary" aria-label="share on facebook">
              <Box component="img" src="/assets/icons/facebook.svg" width={24} height={24} />
            </IconButton>
            <IconButton color="primary" aria-label="share on twitter">
              <Box component="img" src="/assets/icons/twitter.svg" width={24} height={24} />
            </IconButton>
            <IconButton color="primary" aria-label="share on linkedin">
              <Box component="img" src="/assets/icons/linkedin.svg" width={24} height={24} />
            </IconButton>
            <IconButton color="primary" aria-label="share via email">
              <EmailIcon />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeShareDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
