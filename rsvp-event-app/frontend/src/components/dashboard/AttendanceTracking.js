import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckIcon from '@mui/icons-material/Check';
import PercentIcon from '@mui/icons-material/Percent';
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

function AttendanceTracking({ data }) {
  const theme = useTheme();

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No attendance data available for this event
        </Typography>
      </Box>
    );
  }

  const { eventName, totalExpected, totalAttended, attendanceRate, logisticsBreakdown } = data;
  
  // Stats cards data
  const statsCards = [
    {
      title: 'Expected Attendees',
      value: totalExpected,
      icon: <PeopleAltIcon fontSize="large" color="primary" />,
      color: theme.palette.primary.main
    },
    {
      title: 'Actually Attended',
      value: totalAttended,
      icon: <CheckIcon fontSize="large" color="success" />,
      color: theme.palette.success.main
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      icon: <PercentIcon fontSize="large" color="info" />,
      color: theme.palette.info.main
    }
  ];

  // Format data for the pie chart
  const pieChartData = [
    { 
      name: 'Attended', 
      value: totalAttended,
      color: theme.palette.success.main
    },
    { 
      name: 'No Show', 
      value: totalExpected - totalAttended,
      color: theme.palette.error.main
    }
  ].filter(item => item.value > 0);

  // Format data for the logistics breakdown bar chart
  const logisticsChartData = logisticsBreakdown.map(item => ({
    name: item.name,
    assigned: item.totalAssigned,
    checkedIn: item.checkedIn,
    type: item.type
  }));

  // Group data by logistics type for segmented bar chart
  const logisticsByType = {};
  logisticsBreakdown.forEach(item => {
    if (!logisticsByType[item.type]) {
      logisticsByType[item.type] = {
        type: item.type,
        assigned: 0,
        checkedIn: 0
      };
    }
    logisticsByType[item.type].assigned += item.totalAssigned;
    logisticsByType[item.type].checkedIn += item.checkedIn;
  });

  const logisticsTypeChartData = Object.values(logisticsByType);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="body2" color="textPrimary">
            {`${payload[0].payload.name || payload[0].payload.type}`}
          </Typography>
          {payload.map((p, index) => (
            <Typography key={index} variant="body2" color="textSecondary">
              {`${p.name}: ${p.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
  
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Attendance Tracking for {eventName}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} md={4} key={index}>
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
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Attendance Rate</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
              <Box sx={{ width: '100%', height: '250px' }}>
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
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Logistics Attendance Breakdown</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={logisticsTypeChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="type" 
                    angle={-45} 
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36}/>
                  <Bar dataKey="assigned" name="Assigned" fill={theme.palette.primary.main} />
                  <Bar dataKey="checkedIn" name="Checked In" fill={theme.palette.success.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table aria-label="logistics breakdown table">
              <TableHead>
                <TableRow>
                  <TableCell>Logistics Item</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="center">Assigned</TableCell>
                  <TableCell align="center">Checked In</TableCell>
                  <TableCell align="center">Checked Out</TableCell>
                  <TableCell align="right">Check-in Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logisticsBreakdown.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell align="center">{row.totalAssigned}</TableCell>
                    <TableCell align="center">{row.checkedIn}</TableCell>
                    <TableCell align="center">{row.checkedOut}</TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={row.checkInRate} 
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              bgcolor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                bgcolor: row.checkInRate > 75 ? theme.palette.success.main :
                                        row.checkInRate > 50 ? theme.palette.warning.main :
                                        theme.palette.error.main
                              }
                            }} 
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="textSecondary">{`${Math.round(row.checkInRate)}%`}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AttendanceTracking;
