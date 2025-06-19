import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Divider,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpIcon from '@mui/icons-material/Help';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
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

function RsvpStatistics({ data }) {
  const theme = useTheme();

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No RSVP data available for this event
        </Typography>
      </Box>
    );
  }

  const { eventName, totalInvited, rsvpStats, responseRate } = data;
  
  // Format data for the bar chart
  const barChartData = [
    {
      name: 'Attending',
      value: rsvpStats.attending,
      color: theme.palette.success.main
    },
    {
      name: 'Plus Ones',
      value: rsvpStats.plusOnes,
      color: theme.palette.info.main
    },
    {
      name: 'Declined',
      value: rsvpStats.declined,
      color: theme.palette.error.main
    },
    {
      name: 'Maybe',
      value: rsvpStats.maybe,
      color: theme.palette.warning.main
    },
    {
      name: 'Pending',
      value: rsvpStats.pending,
      color: theme.palette.grey[500]
    }
  ];

  // Format data for the pie chart
  const pieChartData = [
    { 
      name: 'Attending', 
      value: rsvpStats.attending,
      color: theme.palette.success.main
    },
    { 
      name: 'Declined', 
      value: rsvpStats.declined,
      color: theme.palette.error.main
    },
    { 
      name: 'Maybe', 
      value: rsvpStats.maybe,
      color: theme.palette.warning.main
    },
    { 
      name: 'Pending', 
      value: rsvpStats.pending,
      color: theme.palette.grey[500]
    }
  ].filter(item => item.value > 0);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Invited',
      value: totalInvited,
      icon: <GroupIcon fontSize="large" color="primary" />,
      color: theme.palette.primary.main
    },
    {
      title: 'RSVP Attending',
      value: rsvpStats.attending,
      icon: <CheckCircleIcon fontSize="large" color="success" />,
      color: theme.palette.success.main
    },
    {
      title: 'RSVP Declined',
      value: rsvpStats.declined,
      icon: <CancelIcon fontSize="large" color="error" />,
      color: theme.palette.error.main
    },
    {
      title: 'RSVP Maybe',
      value: rsvpStats.maybe,
      icon: <HelpIcon fontSize="large" color="warning" />,
      color: theme.palette.warning.main
    },
    {
      title: 'Awaiting Response',
      value: rsvpStats.pending,
      icon: <AccessTimeIcon fontSize="large" color="action" />,
      color: theme.palette.grey[500]
    },
    {
      title: 'Expected Attendees',
      value: rsvpStats.expectedAttendees,
      icon: <GroupIcon fontSize="large" color="info" />,
      color: theme.palette.info.main,
      subtitle: 'Including +1s'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="body2" color="textPrimary">
            {`${payload[0].name}: ${payload[0].value}`}
          </Typography>
        </Paper>
      );
    }
  
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        RSVP Statistics for {eventName}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                borderLeft: `4px solid ${stat.color}`,
                boxShadow: 2
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                    {stat.subtitle && (
                      <Typography variant="caption" color="textSecondary">
                        {stat.subtitle}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>RSVP Distribution</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="value" name="Number of Guests">
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Response Rate</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
              <Typography variant="h3" color="primary">
                {responseRate}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                of invitees have responded
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              <Box sx={{ width: '100%', height: '200px' }}>
                {pieChartData.length > 0 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RsvpStatistics;
