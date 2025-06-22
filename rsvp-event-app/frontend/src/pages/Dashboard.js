import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Paper,
  useTheme
} from '@mui/material';
import {
  Event as EventIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as PendingIcon,
  AccessTime as UpcomingIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Dashboard() {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalGuests: 0,
    confirmedGuests: 0,
    pendingGuests: 0,
    upcomingEvents: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch real dashboard data from the public endpoint for development
        // API client will use the base URL from the .env file (http://localhost:5010)
        const response = await api.get('/api/dashboard/stats/public');
        
        if (response.data && response.data.success) {
          // Use real data from the API
          setStats(response.data.data);
        } else {
          // Fallback to default values if API response is invalid
          console.error('Invalid API response format:', response.data);
          setStats({
            totalEvents: 0,
            activeEvents: 0,
            totalGuests: 0,
            confirmedGuests: 0,
            pendingGuests: 0,
            upcomingEvents: []
          });
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data if API call fails
        setStats({
          totalEvents: 0,
          activeEvents: 0,
          totalGuests: 0,
          confirmedGuests: 0,
          pendingGuests: 0,
          upcomingEvents: []
        });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data for RSVP status
  const rsvpData = {
    labels: ['Confirmed', 'Pending'],
    datasets: [
      {
        data: [stats.confirmedGuests, stats.pendingGuests],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for events
  const eventData = {
    labels: ['Active Events', 'Past Events'],
    datasets: [
      {
        label: 'Events',
        data: [stats.activeEvents, stats.totalEvents - stats.activeEvents],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.grey[400],
        ],
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
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
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Events
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalEvents}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Guests
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalGuests}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon fontSize="large" color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Confirmed RSVPs
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.confirmedGuests}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          {/* Charts and Lists */}
          <Grid container spacing={3}>
            {/* RSVP Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  RSVP Status
                </Typography>
                <Box sx={{ height: 280, display: 'flex', justifyContent: 'center' }}>
                  <Doughnut 
                    data={rsvpData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
            
            {/* Events Chart */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Event Status
                </Typography>
                <Box sx={{ height: 280, display: 'flex', justifyContent: 'center' }}>
                  <Bar 
                    data={eventData} 
                    options={{ 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }} 
                  />
                </Box>
              </Paper>
            </Grid>
            
            {/* Upcoming Events */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Upcoming Events
                </Typography>
                {stats.upcomingEvents.length === 0 ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                    No upcoming events
                  </Typography>
                ) : (
                  <List>
                    {stats.upcomingEvents.map((event, index) => (
                      <React.Fragment key={event.id}>
                        <ListItem 
                          button
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          <ListItemIcon>
                            <UpcomingIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={event.name}
                            secondary={
                              <Box component="span" sx={{ display: 'block' }}>
                                <Typography variant="body2" component="span">
                                  Date: {new Date(event.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                  Location: {event.location}
                                </Typography>
                                <Typography variant="body2" component="span" sx={{ display: 'block' }}>
                                  RSVPs: {event.confirmedCount}/{event.guestsCount}
                                </Typography>
                              </Box>
                            }
                          />
                          <Button 
                            size="small" 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/events/${event.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </ListItem>
                        {index < stats.upcomingEvents.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
