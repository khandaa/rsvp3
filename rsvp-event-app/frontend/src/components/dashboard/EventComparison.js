import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  OutlinedInput,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import api from '../../utils/api';

function EventComparison({ currentEventId }) {
  const theme = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        if (response.data && response.data.data) {
          setEvents(response.data.data);
          
          // Auto-select the current event if provided
          if (currentEventId) {
            setSelectedEvents([currentEventId]);
          }
        }
      } catch (error) {
        console.error('Failed to load events', error);
        setError('Failed to load events. Please try again later.');
      }
    };

    fetchEvents();
  }, [currentEventId]);
  
  // Fetch comparison data when selectedEvents change
  useEffect(() => {
    const fetchComparisonData = async () => {
      // Only fetch if we have at least 2 events selected
      if (selectedEvents.length < 2) {
        setComparisonData(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/reporting/events/compare', {
          params: { eventIds: selectedEvents }
        });
        
        if (response.data && response.data.data) {
          setComparisonData(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load comparison data', error);
        setError('Failed to load comparison data. Please try again later.');
        setComparisonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [selectedEvents]);

  const handleEventSelectionChange = (event) => {
    const { value } = event.target;
    setSelectedEvents(value);
  };

  // Transform data for chart components
  const prepareChartData = (comparisonData) => {
    if (!comparisonData) return [];
    
    // RSVP comparison data
    const rsvpData = comparisonData.map(event => ({
      eventName: event.name,
      attending: event.rsvpStats.attending,
      declined: event.rsvpStats.declined,
      maybe: event.rsvpStats.maybe,
      pending: event.rsvpStats.pending,
      responseRate: parseFloat(event.responseRate)
    }));
    
    // Attendance comparison data
    const attendanceData = comparisonData.map(event => ({
      eventName: event.name,
      expected: event.rsvpStats.expectedAttendees,
      actualAttendance: event.checkedIn,
      attendanceRate: parseFloat(event.attendanceRate)
    }));
    
    // Radar chart data (normalize metrics for comparison)
    const maxValues = {
      totalInvited: Math.max(...comparisonData.map(e => e.totalInvited)),
      attending: Math.max(...comparisonData.map(e => e.rsvpStats.attending)),
      responseRate: 100, // Max is always 100%
      attendanceRate: 100, // Max is always 100%
      plusOnes: Math.max(...comparisonData.map(e => e.rsvpStats.plusOnes))
    };
    
    const radarData = comparisonData.map(event => ({
      eventName: event.name,
      'Total Invited': (event.totalInvited / maxValues.totalInvited) * 100,
      'Attending': (event.rsvpStats.attending / maxValues.attending) * 100,
      'Response Rate': parseFloat(event.responseRate),
      'Attendance Rate': parseFloat(event.attendanceRate),
      'Plus Ones': maxValues.plusOnes ? (event.rsvpStats.plusOnes / maxValues.plusOnes) * 100 : 0
    }));
    
    return { rsvpData, attendanceData, radarData };
  };

  const chartData = comparisonData ? prepareChartData(comparisonData) : null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <CompareArrowsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Event Comparison
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={9}>
            <FormControl fullWidth>
              <InputLabel id="compare-events-label">Select Events to Compare</InputLabel>
              <Select
                labelId="compare-events-label"
                id="compare-events"
                multiple
                value={selectedEvents}
                onChange={handleEventSelectionChange}
                input={<OutlinedInput label="Select Events to Compare" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const event = events.find(e => e.id === value);
                      return (
                        <Chip 
                          key={value} 
                          label={event ? event.name : value} 
                          size="small"
                          icon={<CalendarTodayIcon fontSize="small" />}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.name} ({new Date(event.eventDate).toLocaleDateString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              disabled={selectedEvents.length < 2 || loading}
              onClick={() => {
                if (selectedEvents.length >= 2) {
                  // The comparison happens automatically via the useEffect
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Compare Events'}
            </Button>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="textSecondary">
            Please select at least 2 events to compare. Maximum 5 events recommended for clear visualization.
          </Typography>
        </Box>
      </Paper>
      
      {error && (
        <Paper sx={{ p: 3, mb: 4, bgcolor: theme.palette.error.light }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && comparisonData && chartData && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>RSVP Comparison</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.rsvpData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="eventName" 
                      angle={-45} 
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.palette.info.main} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="attending" name="Attending" fill={theme.palette.success.main} />
                    <Bar yAxisId="left" dataKey="declined" name="Declined" fill={theme.palette.error.main} />
                    <Bar yAxisId="left" dataKey="maybe" name="Maybe" fill={theme.palette.warning.main} />
                    <Bar yAxisId="left" dataKey="pending" name="Pending" fill={theme.palette.grey[500]} />
                    <Bar yAxisId="right" dataKey="responseRate" name="Response Rate (%)" fill={theme.palette.info.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Attendance Comparison</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData.attendanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="eventName" 
                      angle={-45} 
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke={theme.palette.primary.main} />
                    <YAxis yAxisId="right" orientation="right" stroke={theme.palette.info.main} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="expected" name="Expected Attendees" fill={theme.palette.primary.main} />
                    <Bar yAxisId="left" dataKey="actualAttendance" name="Actual Attendance" fill={theme.palette.success.main} />
                    <Bar yAxisId="right" dataKey="attendanceRate" name="Attendance Rate (%)" fill={theme.palette.info.main} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Event Performance Radar</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={150} data={chartData.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="eventName" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    {['Total Invited', 'Attending', 'Response Rate', 'Attendance Rate', 'Plus Ones'].map((key, index) => (
                      <Radar
                        key={key}
                        name={key}
                        dataKey={key}
                        stroke={theme.palette[['primary', 'secondary', 'success', 'info', 'warning'][index % 5]].main}
                        fill={theme.palette[['primary', 'secondary', 'success', 'info', 'warning'][index % 5]].main}
                        fillOpacity={0.3}
                      />
                    ))}
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TableContainer component={Paper}>
              <Table aria-label="event comparison table">
                <TableHead>
                  <TableRow>
                    <TableCell>Event</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="right">Total Invited</TableCell>
                    <TableCell align="right">Attending</TableCell>
                    <TableCell align="right">Response Rate</TableCell>
                    <TableCell align="right">Attendance Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonData.map((event) => (
                    <TableRow
                      key={event.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      hover
                    >
                      <TableCell component="th" scope="row">
                        {event.name}
                      </TableCell>
                      <TableCell align="center">{new Date(event.date).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{event.totalInvited}</TableCell>
                      <TableCell align="right">{event.rsvpStats.attending}</TableCell>
                      <TableCell align="right">{event.responseRate}%</TableCell>
                      <TableCell align="right">{event.attendanceRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
      
      {!loading && selectedEvents.length < 2 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            Please select at least 2 events to compare
          </Typography>
        </Paper>
      )}
    </Box>
  );
}

export default EventComparison;
