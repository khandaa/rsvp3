import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [agendaItems, setAgendaItems] = useState([{ time: '', title: '' }]);
  const [originalEvent, setOriginalEvent] = useState(null);
  
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
        setSaving(true);
        setError('');
        
        // Format the data with agenda items
        const formattedData = {
          ...values,
          agenda: agendaItems.filter(item => item.time && item.title)
        };
        
        // In a real app, this would be an API call
        // const { data } = await api.put(`/api/events/${id}`, formattedData);
        
        // Mock success
        setTimeout(() => {
          console.log('Event updated:', formattedData);
          setSaving(false);
          navigate(`/events/${id}`, { state: { message: 'Event updated successfully!' } });
        }, 1000);
        
      } catch (err) {
        console.error('Error updating event:', err);
        setError(err.response?.data?.message || 'Failed to update event. Please try again.');
        setSaving(false);
      }
    },
  });

  useEffect(() => {
    fetchEventDetails();
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
        date: new Date('2025-07-15T09:00:00'),
        endDate: new Date('2025-07-15T17:00:00'),
        location: 'Convention Center',
        address: '123 Main Street, Cityville, State 12345',
        category: 'Corporate',
        status: 'upcoming',
        isPublic: true,
        imageUrl: '',
        capacity: 150,
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
        setOriginalEvent(mockEvent);
        
        // Set form values
        formik.setValues({
          name: mockEvent.name,
          description: mockEvent.description,
          date: mockEvent.date,
          endDate: mockEvent.endDate,
          location: mockEvent.location,
          address: mockEvent.address,
          category: mockEvent.category,
          isPublic: mockEvent.isPublic,
          imageUrl: mockEvent.imageUrl || '',
          capacity: mockEvent.capacity || '',
          organizerName: mockEvent.organizerName || '',
          organizerEmail: mockEvent.organizerEmail || '',
          eventWebsite: mockEvent.eventWebsite || '',
          additionalInfo: mockEvent.additionalInfo || ''
        });
        
        // Set agenda items
        if (mockEvent.agenda && mockEvent.agenda.length > 0) {
          setAgendaItems(mockEvent.agenda);
        }
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching event details:', error);
      setError('Failed to load event details. Please try again.');
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Event
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/events/${id}`)}
        >
          Back to Event
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
                disabled={saving}
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
                disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
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
                  disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                    disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                disabled={saving}
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
                    disabled={saving}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Activity/Session Title"
                    value={item.title}
                    onChange={(e) => handleAgendaItemChange(index, 'title', e.target.value)}
                    disabled={saving}
                  />
                </Grid>
                <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    onClick={() => handleRemoveAgendaItem(index)}
                    disabled={saving || agendaItems.length <= 1}
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
                disabled={saving}
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
                disabled={saving}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/events/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              {saving ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
