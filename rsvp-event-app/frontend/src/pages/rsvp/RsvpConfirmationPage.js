import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Divider,
} from '@mui/material';
import { CheckCircle, Cancel, HelpOutline } from '@mui/icons-material';

function RsvpConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { success, eventName, status } = location.state || {};

  // Determine which icon to show based on RSVP status
  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'attending':
        return <CheckCircle sx={{ fontSize: 60 }} color="success" />;
      case 'declined':
        return <Cancel sx={{ fontSize: 60 }} color="error" />;
      case 'maybe':
        return <HelpOutline sx={{ fontSize: 60 }} color="warning" />;
      default:
        return <CheckCircle sx={{ fontSize: 60 }} color="primary" />;
    }
  };

  // Get the message based on RSVP status
  const getStatusMessage = () => {
    switch (status?.toLowerCase()) {
      case 'attending':
        return `We look forward to seeing you at ${eventName || 'the event'}!`;
      case 'declined':
        return `Sorry you can't make it to ${eventName || 'the event'}. You'll be missed!`;
      case 'maybe':
        return `Thanks for letting us know you might attend ${eventName || 'the event'}. We hope you can make it!`;
      default:
        return `Thank you for responding to the invitation for ${eventName || 'the event'}.`;
    }
  };

  // If there's no state or success is false, show an error
  if (!location.state || !success) {
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
            Something Went Wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We couldn't find your RSVP confirmation. Please try again or contact the event organizer.
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
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 3 }}>
            {getStatusIcon()}
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            Response Confirmed!
          </Typography>
          
          <Typography variant="body1" paragraph>
            Your RSVP has been successfully submitted.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            {getStatusMessage()}
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="body2" color="text.secondary" paragraph>
            You can update your response at any time by clicking on the invitation link again.
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/')}
            >
              Done
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default RsvpConfirmationPage;
