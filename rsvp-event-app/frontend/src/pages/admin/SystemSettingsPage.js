import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Backup as BackupIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

// Services
import settingsService from '../../services/settingsService';

function SystemSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'RSVP Event App',
      timeZone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      maxUploadSize: 5,
      logoUrl: ''
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: '',
      fromName: 'RSVP Event App',
      useSmtp: true
    },
    notifications: {
      sendEventReminders: true,
      reminderDaysBeforeEvent: 1,
      sendRsvpConfirmations: true,
      allowGuestEmails: true,
      notifyAdminsOnNewRsvp: true
    },
    security: {
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      requirePasswordReset: 90,
      allowUserRegistration: false,
      allowSocialLogin: false
    },
    backup: {
      autoBackupEnabled: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      retentionPeriod: 30
    }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSystemSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load system settings. Please try again.');
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChange = (section, setting, value) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [setting]: value
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await settingsService.updateSystemSettings(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmailConnection = async () => {
    try {
      setSaving(true);
      await settingsService.testEmailConnection(settings.email);
      toast.success('Email connection successful');
    } catch (err) {
      console.error('Error testing email connection:', err);
      toast.error('Email connection failed');
    } finally {
      setSaving(false);
    }
  };

  const handleBackupNow = async () => {
    try {
      setSaving(true);
      await settingsService.createBackup();
      toast.success('Backup created successfully');
    } catch (err) {
      console.error('Error creating backup:', err);
      toast.error('Failed to create backup');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">System Settings</Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SettingsIcon />} label="General" />
          <Tab icon={<EmailIcon />} label="Email" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<BackupIcon />} label="Backup & Recovery" />
        </Tabs>

        {/* General Settings */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              General Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Site Name"
                  fullWidth
                  value={settings.general.siteName}
                  onChange={(e) => handleChange('general', 'siteName', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Zone</InputLabel>
                  <Select
                    value={settings.general.timeZone}
                    label="Time Zone"
                    onChange={(e) => handleChange('general', 'timeZone', e.target.value)}
                  >
                    <MenuItem value="UTC">UTC</MenuItem>
                    <MenuItem value="America/New_York">Eastern Time</MenuItem>
                    <MenuItem value="America/Chicago">Central Time</MenuItem>
                    <MenuItem value="America/Denver">Mountain Time</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                    <MenuItem value="Asia/Kolkata">India Standard Time</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Date Format</InputLabel>
                  <Select
                    value={settings.general.dateFormat}
                    label="Date Format"
                    onChange={(e) => handleChange('general', 'dateFormat', e.target.value)}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Time Format</InputLabel>
                  <Select
                    value={settings.general.timeFormat}
                    label="Time Format"
                    onChange={(e) => handleChange('general', 'timeFormat', e.target.value)}
                  >
                    <MenuItem value="12h">12 Hour (AM/PM)</MenuItem>
                    <MenuItem value="24h">24 Hour</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Max Upload Size (MB)"
                  type="number"
                  fullWidth
                  value={settings.general.maxUploadSize}
                  onChange={(e) => handleChange('general', 'maxUploadSize', Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Logo URL"
                  fullWidth
                  value={settings.general.logoUrl}
                  onChange={(e) => handleChange('general', 'logoUrl', e.target.value)}
                  helperText="Leave empty to use default logo"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Email Settings */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Email Settings</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EmailIcon />}
                onClick={handleTestEmailConnection}
                disabled={saving}
              >
                Test Connection
              </Button>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.email.useSmtp}
                  onChange={(e) => handleChange('email', 'useSmtp', e.target.checked)}
                />
              }
              label="Use SMTP Server"
              sx={{ mb: 2 }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Host"
                  fullWidth
                  value={settings.email.smtpHost}
                  onChange={(e) => handleChange('email', 'smtpHost', e.target.value)}
                  disabled={!settings.email.useSmtp}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Port"
                  type="number"
                  fullWidth
                  value={settings.email.smtpPort}
                  onChange={(e) => handleChange('email', 'smtpPort', Number(e.target.value))}
                  disabled={!settings.email.useSmtp}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Username"
                  fullWidth
                  value={settings.email.smtpUsername}
                  onChange={(e) => handleChange('email', 'smtpUsername', e.target.value)}
                  disabled={!settings.email.useSmtp}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="SMTP Password"
                  type="password"
                  fullWidth
                  value={settings.email.smtpPassword}
                  onChange={(e) => handleChange('email', 'smtpPassword', e.target.value)}
                  disabled={!settings.email.useSmtp}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="From Email Address"
                  fullWidth
                  value={settings.email.fromEmail}
                  onChange={(e) => handleChange('email', 'fromEmail', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="From Name"
                  fullWidth
                  value={settings.email.fromName}
                  onChange={(e) => handleChange('email', 'fromName', e.target.value)}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Notification Settings */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sendEventReminders}
                      onChange={(e) => handleChange('notifications', 'sendEventReminders', e.target.checked)}
                    />
                  }
                  label="Send Event Reminders"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Reminder Days Before Event"
                  type="number"
                  fullWidth
                  value={settings.notifications.reminderDaysBeforeEvent}
                  onChange={(e) => handleChange('notifications', 'reminderDaysBeforeEvent', Number(e.target.value))}
                  disabled={!settings.notifications.sendEventReminders}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.sendRsvpConfirmations}
                      onChange={(e) => handleChange('notifications', 'sendRsvpConfirmations', e.target.checked)}
                    />
                  }
                  label="Send RSVP Confirmation Emails"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.allowGuestEmails}
                      onChange={(e) => handleChange('notifications', 'allowGuestEmails', e.target.checked)}
                    />
                  }
                  label="Allow Guest Email Communications"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications.notifyAdminsOnNewRsvp}
                      onChange={(e) => handleChange('notifications', 'notifyAdminsOnNewRsvp', e.target.checked)}
                    />
                  }
                  label="Notify Administrators on New RSVP"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Backup & Recovery */}
        {tabValue === 3 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Backup & Recovery</Typography>
              <Button
                variant="outlined"
                startIcon={<BackupIcon />}
                onClick={handleBackupNow}
                disabled={saving}
              >
                Backup Now
              </Button>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.backup.autoBackupEnabled}
                      onChange={(e) => handleChange('backup', 'autoBackupEnabled', e.target.checked)}
                    />
                  }
                  label="Enable Automatic Backups"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth disabled={!settings.backup.autoBackupEnabled}>
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select
                    value={settings.backup.backupFrequency}
                    label="Backup Frequency"
                    onChange={(e) => handleChange('backup', 'backupFrequency', e.target.value)}
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Backup Time"
                  type="time"
                  fullWidth
                  value={settings.backup.backupTime}
                  onChange={(e) => handleChange('backup', 'backupTime', e.target.value)}
                  disabled={!settings.backup.autoBackupEnabled}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Retention Period (days)"
                  type="number"
                  fullWidth
                  value={settings.backup.retentionPeriod}
                  onChange={(e) => handleChange('backup', 'retentionPeriod', Number(e.target.value))}
                  disabled={!settings.backup.autoBackupEnabled}
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default SystemSettingsPage;
