import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string()
});

export default function GuestFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Sample guest groups
  const guestGroups = ['Family', 'Friends', 'Colleagues', 'VIP', 'Business', 'Other'];

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      group: '',
      plusOne: false,
      notes: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError('');
        
        // In a real app, this would be an API call
        if (isEditing) {
          // const { data } = await api.put(`/api/guests/${id}`, values);
          console.log('Updating guest:', values);
        } else {
          // const { data } = await api.post('/api/guests', values);
          console.log('Creating guest:', values);
        }
        
        // Mock success
        setTimeout(() => {
          setSubmitting(false);
          navigate('/guests', { 
            state: { 
              message: isEditing ? 'Guest updated successfully!' : 'Guest added successfully!' 
            } 
          });
        }, 1000);
        
      } catch (err) {
        console.error('Error saving guest:', err);
        setError(err.response?.data?.message || 'Failed to save guest. Please try again.');
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing) {
      fetchGuestDetails();
    }
  }, [id]);

  const fetchGuestDetails = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const { data } = await api.get(`/api/guests/${id}`);
      
      // Mock data
      const mockGuest = {
        id: parseInt(id),
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        group: 'Friends',
        plusOne: true,
        notes: 'Allergic to nuts'
      };
      
      setTimeout(() => {
        // Set form values
        formik.setValues({
          firstName: mockGuest.firstName,
          lastName: mockGuest.lastName,
          email: mockGuest.email,
          phone: mockGuest.phone,
          group: mockGuest.group,
          plusOne: mockGuest.plusOne,
          notes: mockGuest.notes
        });
        
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching guest details:', error);
      setError('Failed to load guest details. Please try again.');
      setLoading(false);
    }
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
          {isEditing ? 'Edit Guest' : 'Add New Guest'}
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/guests')}
        >
          Back to Guests
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone Number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="group-label">Guest Group</InputLabel>
                <Select
                  labelId="group-label"
                  id="group"
                  name="group"
                  value={formik.values.group}
                  onChange={formik.handleChange}
                  label="Guest Group"
                  disabled={submitting}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {guestGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    id="plusOne"
                    name="plusOne"
                    checked={formik.values.plusOne}
                    onChange={formik.handleChange}
                    disabled={submitting}
                  />
                }
                label="Allow Plus One"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                multiline
                rows={4}
                value={formik.values.notes}
                onChange={formik.handleChange}
                placeholder="Add any special notes, dietary restrictions, or other information about this guest"
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/guests')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                  sx={{ minWidth: 120 }}
                >
                  {submitting ? <CircularProgress size={24} /> : isEditing ? 'Save Changes' : 'Add Guest'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
