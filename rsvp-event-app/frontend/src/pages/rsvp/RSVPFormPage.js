import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  response: yup.string().required('Please select if you can attend'),
  dietaryRestrictions: yup.string(),
  comments: yup.string()
});

export default function RSVPFormPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [guestData, setGuestData] = useState(null);

  useEffect(() => {
    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const { data } = await api.get(`/api/rsvp/${token}`);
      
      // Mock data
      const mockEvent = {
        id: 123,
        name: 'Annual Company Conference',
        date: '2025-07-15T09:00:00',
        location: 'Convention Center',
        description: 'Join us for our annual company conference',
        imageUrl: null,
        endDate: '2025-07-15T17:00:00',
        organizerName: 'Events Team'
      };
      
      const mockGuest = {
        id: 456,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        plusOne: true,
        response: null,
        dietaryRestrictions: '',
        comments: ''
      };
      
      // Simulate network delay
      setTimeout(() => {
        setEvent(mockEvent);
        setGuestData(mockGuest);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching invitation:', error);
      setError('Failed to load invitation details. The link may be expired or invalid.');
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      response: '',
      bringingPlusOne: 'no',
      plusOneName: '',
      dietaryRestrictions: '',
      comments: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setSubmitting(true);
        setError('');
        
        // Format the data
        const formattedData = {
          ...values,
          bringingPlusOne: values.bringingPlusOne === 'yes',
          eventId: event.id,
          token
        };
        
        // In a real app, this would be an API call
        // const { data } = await api.post('/api/rsvp/submit', formattedData);
        
        // Mock success
        console.log('RSVP submitted:', formattedData);
        
        // Simulate network delay
        setTimeout(() => {
          setSubmitting(false);
          setSuccess(true);
        }, 1000);
        
      } catch (err) {
        console.error('Error submitting RSVP:', err);
        setError(err.response?.data?.message || 'Failed to submit RSVP. Please try again.');
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (guestData) {
      formik.setValues({
        firstName: guestData.firstName || '',
        lastName: guestData.lastName || '',
        email: guestData.email || '',
        response: guestData.response || '',
        bringingPlusOne: 'no',
        plusOneName: '',
        dietaryRestrictions: guestData.dietaryRestrictions || '',
        comments: guestData.comments || ''
      });
    }
  }, [guestData]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
          >
            Back to Homepage
          </Button>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md">
        <Card sx={{ mt: 4, mb: 4, p: 2 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Thank You!
            </Typography>
            <Typography variant="body1" paragraph>
              Your RSVP for <strong>{event.name}</strong> has been submitted successfully.
            </Typography>
            {formik.values.response === 'attending' ? (
              <Typography variant="body1">
                We look forward to seeing you on {new Date(event.date).toLocaleDateString()}.
              </Typography>
            ) : (
              <Typography variant="body1">
                We're sorry you can't make it. Thanks for letting us know.
              </Typography>
            )}
            <Button 
              variant="contained" 
              sx={{ mt: 3 }}
              onClick={() => navigate('/')}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, my: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {event.name}
          </Typography>
          <Chip 
            icon={<Box component="span" sx={{ mr: 0.5 }}>📅</Box>} 
            label={new Date(event.date).toLocaleDateString()} 
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Chip 
            icon={<Box component="span" sx={{ mr: 0.5 }}>📍</Box>} 
            label={event.location}
            variant="outlined"
          />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please respond by {new Date(new Date(event.date).getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Typography variant="h5" gutterBottom>RSVP Form</Typography>
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
            
            <Grid item xs={12}>
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
            
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend">Will you be attending?</FormLabel>
                <RadioGroup
                  name="response"
                  value={formik.values.response}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel 
                    value="attending" 
                    control={<Radio />} 
                    label="Yes, I will attend" 
                    disabled={submitting}
                  />
                  <FormControlLabel 
                    value="not_attending" 
                    control={<Radio />} 
                    label="No, I cannot attend" 
                    disabled={submitting}
                  />
                </RadioGroup>
                {formik.touched.response && formik.errors.response && (
                  <Typography color="error" variant="caption">
                    {formik.errors.response}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            {guestData?.plusOne && formik.values.response === 'attending' && (
              <>
                <Grid item xs={12}>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel component="legend">Will you be bringing a guest?</FormLabel>
                    <RadioGroup
                      name="bringingPlusOne"
                      value={formik.values.bringingPlusOne}
                      onChange={formik.handleChange}
                    >
                      <FormControlLabel 
                        value="yes" 
                        control={<Radio />} 
                        label="Yes" 
                        disabled={submitting}
                      />
                      <FormControlLabel 
                        value="no" 
                        control={<Radio />} 
                        label="No" 
                        disabled={submitting}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                
                {formik.values.bringingPlusOne === 'yes' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="plusOneName"
                      name="plusOneName"
                      label="Guest's Name"
                      value={formik.values.plusOneName}
                      onChange={formik.handleChange}
                      disabled={submitting}
                    />
                  </Grid>
                )}
              </>
            )}
            
            {formik.values.response === 'attending' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  label="Dietary Restrictions or Special Needs"
                  value={formik.values.dietaryRestrictions}
                  onChange={formik.handleChange}
                  multiline
                  rows={2}
                  placeholder="Please list any allergies, dietary restrictions, or special accommodations"
                  disabled={submitting}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="comments"
                name="comments"
                label="Additional Comments"
                value={formik.values.comments}
                onChange={formik.handleChange}
                multiline
                rows={3}
                disabled={submitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={submitting}
                  sx={{ minWidth: 120 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit RSVP'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
