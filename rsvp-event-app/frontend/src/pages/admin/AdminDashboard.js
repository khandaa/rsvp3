import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material';
import { 
  Event, 
  Person, 
  CheckCircle, 
  Cancel, 
  HelpOutline,
  Warning,
  InsertInvitation,
  Mail
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Services
import eventService from '../../services/eventService';
import guestService from '../../services/guestService';
import rsvpService from '../../services/rsvpService';
import userService from '../../services/userService';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventCount: 0,
    guestCount: 0,
    upcomingEvents: 0,
    activeRsvps: 0,
    rsvpStats: {
      attending: 0,
      declined: 0,
      maybe: 0,
      noResponse: 0
    },
    recentEvents: [],
    recentActivity: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch basic statistics
        const [
          events, 
          guests, 
          rsvpSummary, 
          recentActivity
        ] = await Promise.all([
          eventService.getAllEvents(),
          guestService.getAllGuests(),
          rsvpService.getRsvpSummary(),
          userService.getRecentActivity()
        ]);
        
        const now = new Date();
        const upcomingEvents = events.filter(
          event => new Date(event.startDate) > now
        );
        
        // Calculate RSVP stats
        const totalInvites = rsvpSummary.total || 0;
        const attending = rsvpSummary.attending || 0;
        const declined = rsvpSummary.declined || 0;
        const maybe = rsvpSummary.maybe || 0;
        const noResponse = totalInvites - attending - declined - maybe;
        
        setStats({
          eventCount: events.length,
          guestCount: guests.length,
          upcomingEvents: upcomingEvents.length,
          activeRsvps: totalInvites,
          rsvpStats: {
            attending,
            declined,
            maybe,
            noResponse
          },
          recentEvents: upcomingEvents.slice(0, 5),
          recentActivity
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Prepare data for charts
  const rsvpChartData = [
    { name: 'Attending', value: stats.rsvpStats.attending, color: '#4caf50' },
    { name: 'Declined', value: stats.rsvpStats.declined, color: '#f44336' },
    { name: 'Maybe', value: stats.rsvpStats.maybe, color: '#ff9800' },
    { name: 'No Response', value: stats.rsvpStats.noResponse, color: '#9e9e9e' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Event color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.eventCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Events
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Person color="secondary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.guestCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Guests
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <InsertInvitation color="info" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.upcomingEvents}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Upcoming Events
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Mail color="warning" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h4">{stats.activeRsvps}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active RSVPs
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts & Lists */}
      <Grid container spacing={3}>
        {/* RSVP Status Chart */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="RSVP Status Overview" />
            <Divider />
            <CardContent>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {stats.activeRsvps > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rsvpChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {rsvpChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} guests`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body1" color="text.secondary" align="center">
                    No RSVP data available
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Events */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardHeader title="Upcoming Events" />
            <Divider />
            <CardContent>
              {stats.recentEvents.length > 0 ? (
                <List>
                  {stats.recentEvents.map((event) => (
                    <React.Fragment key={event.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Event color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.name}
                          secondary={`${new Date(event.startDate).toLocaleDateString()} | ${event.location || 'No location'}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography variant="body1" color="text.secondary">
                    No upcoming events
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recent Activity Log */}
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Recent System Activity" />
            <Divider />
            <CardContent>
              {stats.recentActivity.length > 0 ? (
                <List>
                  {stats.recentActivity.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          {activity.type === 'login' && <Person color="primary" />}
                          {activity.type === 'event_created' && <Event color="success" />}
                          {activity.type === 'rsvp_submitted' && <CheckCircle color="info" />}
                          {activity.type === 'error' && <Warning color="error" />}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.message}
                          secondary={new Date(activity.timestamp).toLocaleString()}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
                  <Typography variant="body1" color="text.secondary">
                    No recent activity to display
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
