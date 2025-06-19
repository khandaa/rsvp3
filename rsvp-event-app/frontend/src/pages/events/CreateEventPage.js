import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Divider,
  CircularProgress,
  FormControlLabel,
  Switch,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { 
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  name: yup.string().required('Event name is required'),
  description: yup.string().required('Description is required'),
  date: yup.date().required('Event date and time is required'),
  location: yup.string().required('Location is required'),
  category: yup.string().required('Category is required'),
});

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agendaItems, setAgendaItems] = useState([{ time: '', title: '' }]);
  
  // Sample categories for events
  const categories = ['Corporate', 'Social', 'Workshop', 'Conference', 'Other'];

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      date: new Date(),
      endDate: null,
      location: '',
      address: '',
      category: '',
      isPublic: true,
      imageUrl: '',
      capacity: '',
      organizerName: '',
      organizerEmail: '',
      eventWebsite: '',
      additionalInfo: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        
        // Format the data with agenda items
        const formattedData = {
          ...values,
          agenda: agendaItems.filter(item => item.time && item.title)
        };
        
        // In a real app, this would be an API call
        // const { data } = await api.post('/api/events', formattedData);
        
        // Mock success
        setTimeout(() => {
          console.log('Event data submitted:', formattedData);
          setLoading(false);
          navigate('/events', { state: { message: 'Event created successfully!' } });
        }, 1000);
        
      } catch (err) {
        console.error('Error creating event:', err);
        setError(err.response?.data?.message || 'Failed to create event. Please try again.');
        setLoading(false);
      }
    },
  });

  const handleAddAgendaItem = () => {
    setAgendaItems([...agendaItems, { time: '', title: '' }]);
  };

  const handleRemoveAgendaItem = (index) => {
    const newItems = [...agendaItems];
    newItems.splice(index, 1);
    setAgendaItems(newItems);
  };

  const handleAgendaItemChange = (index, field, value) => {
    const newItems = [...agendaItems];
    newItems[index][field] = value;
    setAgendaItems(newItems);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/events')}
        >
          Back to Events
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Event Details
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Event Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Event Date & Time"
                  value={formik.values.date}
                  onChange={(newValue) => {
                    formik.setFieldValue('date', newValue);
                  }}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      id: "date",
                      name: "date",
                      error: formik.touched.date && Boolean(formik.errors.date),
                      helperText: formik.touched.date && formik.errors.date
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Date & Time (Optional)"
                  value={formik.values.endDate}
                  onChange={(newValue) => {
                    formik.setFieldValue('endDate', newValue);
                  }}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      id: "endDate",
                      name: "endDate"
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location Name"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  label="Category"
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  disabled={loading}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Full Address"
                value={formik.values.address}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="capacity"
                name="capacity"
                label="Capacity (Optional)"
                type="number"
                value={formik.values.capacity}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    id="isPublic"
                    name="isPublic"
                    checked={formik.values.isPublic}
                    onChange={formik.handleChange}
                    disabled={loading}
                  />
                }
                label="Public Event (Visible on public pages)"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            Organizer Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="organizerName"
                name="organizerName"
                label="Organizer Name"
                value={formik.values.organizerName}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="organizerEmail"
                name="organizerEmail"
                label="Organizer Email"
                type="email"
                value={formik.values.organizerEmail}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="eventWebsite"
                name="eventWebsite"
                label="Event Website (Optional)"
                value={formik.values.eventWebsite}
                onChange={formik.handleChange}
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Event Agenda (Optional)
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddAgendaItem}
                disabled={loading}
              >
                Add Item
              </Button>
            </Box>
            
            {agendaItems.map((item, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Time"
                    value={item.time}
                    onChange={(e) => handleAgendaItemChange(index, 'time', e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Activity/Session Title"
                    value={item.title}
                    onChange={(e) => handleAgendaItemChange(index, 'title', e.target.value)}
                    disabled={loading}
                  />
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => handleRemoveAgendaItem(index)}
                    disabled={loading || agendaItems.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="additionalInfo"
                name="additionalInfo"
                label="Additional Information (Optional)"
                multiline
                rows={3}
                value={formik.values.additionalInfo}
                onChange={formik.handleChange}
                placeholder="Special instructions, what to bring, dress code, etc."
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="imageUrl"
                name="imageUrl"
                label="Cover Image URL (Optional)"
                value={formik.values.imageUrl}
                onChange={formik.handleChange}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/events')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Event'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
