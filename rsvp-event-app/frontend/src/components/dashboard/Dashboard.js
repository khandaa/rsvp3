import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
  Button
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import RsvpStatistics from './RsvpStatistics';
import AttendanceTracking from './AttendanceTracking';
import GuestDemographics from './GuestDemographics';
import EventComparison from './EventComparison';
import CustomReportGenerator from './CustomReportGenerator';
import ExportReports from './ExportReports';
import api from '../../utils/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
      style={{ marginTop: '20px' }}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [value, setValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [eventData, setEventData] = useState({
    rsvpStats: null,
    attendanceData: null,
    demographicsData: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load all events for the selector
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        if (response.data && response.data.data) {
          setEvents(response.data.data);
          
          // Auto-select the first event if available
          if (response.data.data.length > 0) {
            setSelectedEvent(response.data.data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to load events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setLoading(true);
      setError(null);
      
      // Fetch different types of data for the dashboard tabs
      const fetchData = async () => {
        try {
          // RSVP Statistics data
          const rsvpResponse = await api.get(`/reporting/events/${selectedEvent}/rsvp-stats`);
          
          // Attendance Tracking data
          const attendanceResponse = await api.get(`/reporting/events/${selectedEvent}/attendance`);
          
          // Demographics data
          const demographicsResponse = await api.get(`/reporting/events/${selectedEvent}/demographics`);
          
          // Update all data at once to minimize re-renders
          setEventData({
            rsvpStats: rsvpResponse.data.data,
            attendanceData: attendanceResponse.data.data,
            demographicsData: demographicsResponse.data.data
          });
        } catch (err) {
          console.error('Error fetching event data:', err);
          setError('Failed to load event data. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [selectedEvent]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  if (loading && !events.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <DashboardIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Event Dashboard & Reporting
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="event-select-label">Select Event</InputLabel>
                <Select
                  labelId="event-select-label"
                  id="event-select"
                  value={selectedEvent}
                  label="Select Event"
                  onChange={handleEventChange}
                  disabled={loading || !events.length}
                >
                  {events.map((event) => (
                    <MenuItem key={event.id} value={event.id}>
                      {event.name} ({new Date(event.eventDate).toLocaleDateString()})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Button 
                variant="outlined" 
                startIcon={<FileDownloadIcon />}
                disabled={!selectedEvent || loading}
              >
                Export Reports
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={value} 
              onChange={handleChange} 
              aria-label="dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
              orientation={isMobile ? "vertical" : "horizontal"}
              sx={{
                ...(isMobile && {
                  '& .MuiTabs-flexContainer': {
                    alignItems: 'flex-start',
                  },
                  '& .MuiTab-root': {
                    justifyContent: 'flex-start',
                    minHeight: 'auto',
                    py: 1.5,
                  }
                })
              }}
            >
              <Tab label="RSVP Statistics" />
              <Tab label="Attendance Tracking" />
              <Tab label="Guest Demographics" />
              <Tab label="Event Comparison" />
              <Tab label="Custom Reports" />
              <Tab label="Export Reports" />
            </Tabs>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : !selectedEvent ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography>Please select an event to view dashboard data</Typography>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <TabPanel value={value} index={0}>
                <RsvpStatistics data={eventData.rsvpStats} />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <AttendanceTracking data={eventData.attendanceData} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <GuestDemographics data={eventData.demographicsData} />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <EventComparison currentEventId={selectedEvent} />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <CustomReportGenerator eventId={selectedEvent} />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <ExportReports eventId={selectedEvent} />
              </TabPanel>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
