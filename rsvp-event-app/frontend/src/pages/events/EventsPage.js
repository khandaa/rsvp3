import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Chip,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import defaultEventImage from '../../assets/images/default-event.jpg';

export default function EventsPage() {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, eventId: null });

  // Sample event categories for filter
  const eventCategories = ['All', 'Corporate', 'Social', 'Workshop', 'Conference', 'Other'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchEvents();
  }, [page, sortBy, selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // In a real app, replace this with an actual API call
      // const { data } = await api.get('/api/events', { 
      //   params: { 
      //     page, 
      //     sort: sortBy,
      //     category: selectedCategory !== 'All' ? selectedCategory : undefined,
      //     search: searchTerm || undefined
      //   } 
      // });
      
      // Mock data
      const mockEvents = [
        {
          id: 1,
          name: 'Annual Company Conference',
          description: 'Join us for our annual company conference where we discuss the future of our company.',
          date: '2025-07-15T09:00:00',
          location: 'Convention Center',
          category: 'Corporate',
          status: 'upcoming',
          isPublic: true,
          imageUrl: null,
          guestsCount: 120,
          confirmedCount: 95
        },
        {
          id: 2,
          name: 'Product Launch',
          description: 'Be the first to see our newest product line and enjoy exclusive launch day discounts.',
          date: '2025-06-28T14:00:00',
          location: 'Main Office',
          category: 'Corporate',
          status: 'upcoming',
          isPublic: true,
          imageUrl: null,
          guestsCount: 75,
          confirmedCount: 52
        },
        {
          id: 3,
          name: 'Customer Appreciation Day',
          description: 'A day dedicated to our valued customers with food, entertainment, and networking.',
          date: '2025-07-02T11:00:00',
          location: 'City Park',
          category: 'Social',
          status: 'upcoming',
          isPublic: true,
          imageUrl: null,
          guestsCount: 85,
          confirmedCount: 40
        },
        {
          id: 4,
          name: 'Team Building Workshop',
          description: 'Strengthen team bonds and develop new skills in this interactive workshop.',
          date: '2025-08-10T10:00:00',
          location: 'Training Center',
          category: 'Workshop',
          status: 'upcoming',
          isPublic: false,
          imageUrl: null,
          guestsCount: 30,
          confirmedCount: 25
        }
      ];
      
      setTimeout(() => {
        setEvents(mockEvents);
        setTotalPages(1); // Mocked total pages
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setPage(1); // Reset to first page on new search
    fetchEvents();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const openDeleteDialog = (eventId) => {
    setDeleteDialog({ open: true, eventId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, eventId: null });
  };

  const handleDeleteEvent = async () => {
    try {
      // In a real app, make an API call to delete the event
      // await api.delete(`/api/events/${deleteDialog.eventId}`);
      
      // Update local state
      setEvents(events.filter(event => event.id !== deleteDialog.eventId));
      closeDeleteDialog();
      
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        
        {hasPermission('event_host') && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/create')}
          >
            Create Event
          </Button>
        )}
      </Box>
      
      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  &times;
                </IconButton>
              </InputAdornment>
            )
          }}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: '300px' } }}
        />
        
        <TextField
          select
          label="Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          size="small"
          sx={{ minWidth: '150px' }}
        >
          {eventCategories.map(category => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          select
          label="Sort by"
          value={sortBy}
          onChange={handleSortChange}
          size="small"
          sx={{ minWidth: '150px' }}
        >
          <MenuItem value="date">Date (Soonest)</MenuItem>
          <MenuItem value="-date">Date (Latest)</MenuItem>
          <MenuItem value="name">Name (A-Z)</MenuItem>
          <MenuItem value="-name">Name (Z-A)</MenuItem>
        </TextField>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredEvents.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No events found
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters, or create a new event.
          </Typography>
          {hasPermission('event_host') && (
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              sx={{ mt: 2 }}
              onClick={() => navigate('/events/create')}
            >
              Create Event
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredEvents.map(event => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.imageUrl || defaultEventImage}
                    alt={event.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {event.name}
                      </Typography>
                      <Chip 
                        label={event.status === 'upcoming' ? 'Upcoming' : event.status}
                        color={event.status === 'upcoming' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.description.length > 100 
                        ? `${event.description.substring(0, 100)}...` 
                        : event.description}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <CalendarIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">
                        {event.location}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Button 
                        size="small" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        Details
                      </Button>
                    </Box>
                    
                    {hasPermission('event_host') && (
                      <Box>
                        <IconButton 
                          aria-label="edit"
                          size="small"
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="delete"
                          size="small"
                          onClick={() => openDeleteDialog(event.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
              />
            </Box>
          )}
        </>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this event? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEvent} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
