import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract page name from pathname
  const pageName = location.pathname.split('/')[1];
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {formattedPageName} Feature Coming Soon
        </Typography>
        <Typography variant="body1" paragraph>
          We're working hard on the {formattedPageName.toLowerCase()} module. This feature will be available in a future update.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Check back soon for updates.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
}
