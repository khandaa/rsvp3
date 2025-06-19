import React from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  useTheme,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
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
  Cell,
  LabelList,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar
} from 'recharts';

function GuestDemographics({ data }) {
  const theme = useTheme();

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No demographic data available for this event
        </Typography>
      </Box>
    );
  }

  const { eventName, totalAttendees, demographics } = data;
  
  // Generate colors for charts
  const generateColors = (count) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
      theme.palette.grey[600],
      theme.palette.primary.light,
      theme.palette.secondary.light,
      theme.palette.success.light
    ];
    
    if (count <= colors.length) {
      return colors.slice(0, count);
    }
    
    // If we need more colors than we have prepared
    const result = [...colors];
    for (let i = colors.length; i < count; i++) {
      const r = Math.floor(Math.random() * 200);
      const g = Math.floor(Math.random() * 200);
      const b = Math.floor(Math.random() * 200);
      result.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return result;
  };

  // Process gender distribution data
  const genderData = Object.entries(demographics.genderDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));
  
  // Process age distribution data
  const ageData = Object.entries(demographics.ageDistribution || {}).map(([name, value]) => ({
    name: name === 'under18' ? 'Under 18' : 
          name === 'over65' ? 'Over 65' : name,
    value
  })).filter(item => item.value > 0);
  
  // Process location distribution data
  const locationData = Object.entries(demographics.locationDistribution || {})
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value) // Sort by count, descending
    .slice(0, 10); // Take top 10 locations
  
  // Process dietary preferences data
  const dietaryData = Object.entries(demographics.dietaryPreferences || {})
    .map(([name, value]) => ({
      name,
      value
    }))
    .sort((a, b) => b.value - a.value); // Sort by count, descending

  const genderColors = generateColors(genderData.length);
  const ageColors = generateColors(ageData.length);
  const locationColors = generateColors(locationData.length);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="body2" color="textPrimary">
            {`${payload[0].name}: ${payload[0].value}`}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {`${((payload[0].value / totalAttendees) * 100).toFixed(1)}% of total`}
          </Typography>
        </Paper>
      );
    }
  
    return null;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Guest Demographics for {eventName}
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Total Attendees: {totalAttendees}
      </Typography>
      
      <Grid container spacing={3}>
        {/* Gender Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Gender Distribution</Typography>
            <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={genderColors[index % genderColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No gender data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Age Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Age Distribution</Typography>
            <Box sx={{ height: 300 }}>
              {ageData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ageData}
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
                    <Bar dataKey="value" name="Attendees" radius={[4, 4, 0, 0]}>
                      {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ageColors[index % ageColors.length]} />
                      ))}
                      <LabelList dataKey="value" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No age data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Location Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Top Guest Locations</Typography>
            <Box sx={{ height: 400 }}>
              {locationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="value" name="Attendees" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]}>
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={locationColors[index % locationColors.length]} />
                      ))}
                      <LabelList dataKey="value" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography color="textSecondary">No location data available</Typography>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Dietary Preferences */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Dietary Preferences</Typography>
              {dietaryData.length > 0 ? (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <List dense>
                    {dietaryData.map((item, index) => (
                      <ListItem key={index} divider={index < dietaryData.length - 1}>
                        <ListItemText 
                          primary={item.name} 
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                        <Chip 
                          label={item.value} 
                          size="small" 
                          color={index < 3 ? 'primary' : 'default'} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ) : (
                <Typography color="textSecondary">No dietary preference data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Demographic Insights</Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                <strong>Key Demographics:</strong> This event attracted {totalAttendees} attendees
                {genderData.length > 0 && (() => {
                  // Find the most common gender
                  const topGender = genderData.reduce((prev, current) => 
                    prev.value > current.value ? prev : current, { value: 0 });
                  
                  return `, with ${topGender.name} making up ${((topGender.value / totalAttendees) * 100).toFixed(0)}% of attendees`;
                })()}
                {ageData.length > 0 && (() => {
                  // Find the most common age group
                  const topAge = ageData.reduce((prev, current) => 
                    prev.value > current.value ? prev : current, { value: 0 });
                  
                  return `. The largest age group was ${topAge.name} (${((topAge.value / totalAttendees) * 100).toFixed(0)}%)`;
                })()}.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Geographic Reach:</strong>
                {locationData.length > 0 
                  ? ` Guests came from ${locationData.length} different locations, with the most attendees from ${locationData[0].name} (${locationData[0].value} guests).`
                  : ' No geographic data available for this event.'}
              </Typography>
              
              <Typography variant="body2">
                <strong>Dietary Considerations:</strong>
                {dietaryData.length > 0 
                  ? ` ${dietaryData.length} dietary preferences were recorded, with the most common being ${dietaryData[0].name} (${dietaryData[0].value} guests).`
                  : ' No dietary preference data was recorded for this event.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GuestDemographics;
