import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider
} from '@mui/material';
import { CheckCircle, Cancel, HelpOutline } from '@mui/icons-material';

// Services
import rsvpService from '../../services/rsvpService';

function RsvpPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [comment, setComment] = useState('');
  const [dietaryRequirements, setDietaryRequirements] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        const data = await rsvpService.verifyInvitationToken(token);
        setInvitation(data);
        // Pre-fill with existing RSVP data if available
        if (data.rsvp) {
          setRsvpStatus(data.rsvp.status);
          setComment(data.rsvp.comment || '');
          setDietaryRequirements(data.rsvp.dietaryRequirements || '');
        }
        setError(null);
      } catch (err) {
        console.error('Failed to verify invitation', err);
        setError('This invitation link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await rsvpService.submitRsvp(token, {
        status: rsvpStatus,
        comment,
        dietaryRequirements
      });
      navigate('/rsvp/confirmation', { 
        state: { 
          success: true, 
          eventName: invitation?.event?.name,
          status: rsvpStatus
        }
      });
    } catch (err) {
      console.error('Failed to submit RSVP', err);
      setError('Failed to submit your RSVP. Please try again.');
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const steps = ['Event Details', 'Your Response', 'Additional Information'];

  if (loading && !invitation) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your invitation...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            maxWidth: 500
          }}
        >
          <Cancel color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" component="h1" gutterBottom>
            Invitation Error
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            href="/"
            sx={{ mt: 2 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        p: 3
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4
          }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {invitation?.guest?.firstName ? `Hello, ${invitation.guest.firstName}!` : 'Hello!'}
            </Typography>
            <Typography variant="h5" gutterBottom>
              You're invited to {invitation?.event?.name}
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <>
              <Card sx={{ mb: 3 }}>
                {invitation?.event?.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="240"
                    image={invitation.event.imageUrl}
                    alt={invitation.event.name}
                  />
                ) : null}
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {invitation?.event?.name}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Date & Time</Typography>
                      <Typography variant="body1">
                        {invitation?.event?.startDate
                          ? new Date(invitation.event.startDate).toLocaleString()
                          : 'TBD'}
                        {invitation?.event?.endDate ? 
                          ` - ${new Date(invitation.event.endDate).toLocaleTimeString()}` : 
                          ''}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1">Location</Typography>
                      <Typography variant="body1">
                        {invitation?.event?.location || 'TBD'}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {invitation?.event?.description || 'No description available.'}
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                Will you attend?
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <RadioGroup
                  value={rsvpStatus}
                  onChange={(e) => setRsvpStatus(e.target.value)}
                >
                  <Paper 
                    elevation={rsvpStatus === 'attending' ? 3 : 1} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: rsvpStatus === 'attending' ? '2px solid #4caf50' : 'none' 
                    }}
                  >
                    <FormControlLabel
                      value="attending"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircle color="success" sx={{ mr: 1 }} />
                          <Typography variant="body1">Yes, I'll be there</Typography>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper 
                    elevation={rsvpStatus === 'declined' ? 3 : 1} 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      border: rsvpStatus === 'declined' ? '2px solid #f44336' : 'none'
                    }}
                  >
                    <FormControlLabel
                      value="declined"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Cancel color="error" sx={{ mr: 1 }} />
                          <Typography variant="body1">No, I can't make it</Typography>
                        </Box>
                      }
                    />
                  </Paper>

                  <Paper 
                    elevation={rsvpStatus === 'maybe' ? 3 : 1} 
                    sx={{ 
                      mb: 2, 
                      p: 2,
                      border: rsvpStatus === 'maybe' ? '2px solid #ff9800' : 'none'
                    }}
                  >
                    <FormControlLabel
                      value="maybe"
                      control={<Radio />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HelpOutline color="warning" sx={{ mr: 1 }} />
                          <Typography variant="body1">Maybe</Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </RadioGroup>
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!rsvpStatus}
                >
                  Next
                </Button>
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>

              <TextField
                label="Any dietary requirements or allergies?"
                fullWidth
                multiline
                rows={2}
                value={dietaryRequirements}
                onChange={(e) => setDietaryRequirements(e.target.value)}
                margin="normal"
              />

              <TextField
                label="Add a message (optional)"
                fullWidth
                multiline
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                margin="normal"
                helperText="Any questions or comments for the host?"
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={handleBack}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !rsvpStatus}
                >
                  {loading ? <CircularProgress size={24} /> : 'Submit Response'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default RsvpPage;
