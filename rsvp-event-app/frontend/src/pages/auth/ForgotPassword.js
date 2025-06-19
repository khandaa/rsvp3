import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import * as yup from 'yup';
import { useFormik } from 'formik';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');
        await forgotPassword(values.email);
        setSuccess(true);
      } catch (err) {
        console.error('Password reset request error:', err);
        setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box sx={{ width: '100%' }}>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Reset Your Password
      </Typography>
      
      <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
        Enter your email address and we'll send you a link to reset your password.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset instructions have been sent to your email address.
          </Alert>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Please check your inbox and follow the instructions to reset your password.
          </Typography>
          <Button
            fullWidth
            component={RouterLink}
            to="/login"
            variant="outlined"
            sx={{ mt: 3 }}
          >
            Return to Login
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link component={RouterLink} to="/login" variant="body2">
                Back to Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
