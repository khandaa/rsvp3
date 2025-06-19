import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  FormControl,
  FormControlLabel,
  Checkbox, 
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';

import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import ShareIcon from '@mui/icons-material/Share';
import api from '../../utils/api';

function ExportReports({ eventId }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // Export configuration
  const [exportConfig, setExportConfig] = useState({
    reportType: 'rsvpStatistics', // rsvpStatistics, attendanceTracking, demographics, guestList
    format: 'excel', // excel, pdf, csv, json
    includeCharts: true,
    includeRawData: true,
    email: '',
  });
  
  // Sample saved reports data (in a real app, this would come from an API)
  const [savedReports] = useState([
    { 
      id: 1, 
      name: 'Monthly RSVP Summary',
      type: 'rsvpStatistics',
      format: 'excel',
      createdAt: '2023-10-15T14:23:45',
      size: '245KB'
    },
    { 
      id: 2, 
      name: 'Q3 Attendance Report',
      type: 'attendanceTracking',
      format: 'pdf',
      createdAt: '2023-09-30T09:12:30',
      size: '1.2MB'
    },
    { 
      id: 3, 
      name: 'Demographics Analysis',
      type: 'demographics',
      format: 'excel',
      createdAt: '2023-10-01T16:45:22',
      size: '380KB'
    },
    { 
      id: 4, 
      name: 'Guest List Export',
      type: 'guestList',
      format: 'csv',
      createdAt: '2023-10-10T11:05:15',
      size: '156KB'
    }
  ]);

  const handleExportConfigChange = (field, value) => {
    setExportConfig({
      ...exportConfig,
      [field]: value
    });
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setExportSuccess(false);
    
    try {
      // In a real app, this would make an API call to export the report
      console.log('Exporting report with configuration:', exportConfig);
      
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If email is provided, simulate sending email
      if (exportConfig.email) {
        console.log(`Sending report to ${exportConfig.email}`);
        // In a real app: await api.post('/reporting/send-email', { email: exportConfig.email, reportConfig: exportConfig });
      }
      
      setExportSuccess(true);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Failed to export the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSavedReport = (reportId) => {
    console.log(`Downloading saved report with ID: ${reportId}`);
    // In a real app, this would trigger the download of the saved report
  };

  const handleShareSavedReport = (reportId) => {
    console.log(`Sharing saved report with ID: ${reportId}`);
    // In a real app, this would open a sharing dialog
  };

  const handleDeleteSavedReport = (reportId) => {
    console.log(`Deleting saved report with ID: ${reportId}`);
    // In a real app, this would make an API call to delete the saved report
  };

  // Helper to get the appropriate icon for report format
  const getFormatIcon = (format) => {
    switch (format) {
      case 'excel':
        return <TableChartIcon color="success" />;
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'csv':
        return <InsertDriveFileIcon color="primary" />;
      case 'json':
        return <CodeIcon color="secondary" />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <DownloadIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Export Reports
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Generate New Export
            </Typography>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                id="report-type"
                value={exportConfig.reportType}
                onChange={(e) => handleExportConfigChange('reportType', e.target.value)}
                label="Report Type"
              >
                <MenuItem value="rsvpStatistics">RSVP Statistics</MenuItem>
                <MenuItem value="attendanceTracking">Attendance Tracking</MenuItem>
                <MenuItem value="demographics">Guest Demographics</MenuItem>
                <MenuItem value="guestList">Guest List</MenuItem>
                <MenuItem value="complete">Complete Event Report</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="export-format-label">Export Format</InputLabel>
              <Select
                labelId="export-format-label"
                id="export-format"
                value={exportConfig.format}
                onChange={(e) => handleExportConfigChange('format', e.target.value)}
                label="Export Format"
              >
                <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="csv">CSV File</MenuItem>
                <MenuItem value="json">JSON Data</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportConfig.includeCharts}
                    onChange={(e) => handleExportConfigChange('includeCharts', e.target.checked)}
                  />
                }
                label="Include Charts and Visualizations"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={exportConfig.includeRawData}
                    onChange={(e) => handleExportConfigChange('includeRawData', e.target.checked)}
                  />
                }
                label="Include Raw Data Tables"
              />
            </Box>
            
            <TextField
              label="Email Report (Optional)"
              fullWidth
              margin="normal"
              value={exportConfig.email}
              onChange={(e) => handleExportConfigChange('email', e.target.value)}
              placeholder="Enter email address to send report"
              helperText="Leave blank to download directly"
              type="email"
            />
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
            )}
            
            {exportSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Report exported successfully!
                {exportConfig.email && ` Email sent to ${exportConfig.email}`}
              </Alert>
            )}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                onClick={handleExport}
                disabled={loading}
                fullWidth
              >
                {loading ? 'Exporting...' : 'Export Report'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Saved Reports
            </Typography>
            
            {savedReports.length === 0 ? (
              <Typography color="textSecondary" align="center" sx={{ my: 4 }}>
                No saved reports found
              </Typography>
            ) : (
              <List>
                {savedReports.map((report) => (
                  <ListItem
                    key={report.id}
                    secondaryAction={
                      <Box>
                        <IconButton edge="end" onClick={() => handleDownloadSavedReport(report.id)}>
                          <DownloadIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleShareSavedReport(report.id)}>
                          <EmailIcon />
                        </IconButton>
                        <IconButton edge="end" onClick={() => handleDeleteSavedReport(report.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      {getFormatIcon(report.format)}
                    </ListItemIcon>
                    <ListItemText
                      primary={report.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {new Date(report.createdAt).toLocaleDateString()} - {report.size}
                          </Typography>
                          <br />
                          <Chip
                            label={report.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            size="small"
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        </>
                      }
                      primaryTypographyProps={{ fontWeight: 'medium' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                onClick={() => {
                  console.log('Manage sharing settings');
                  // In a real app, this would open a sharing settings dialog
                }}
              >
                Manage Sharing Settings
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ExportReports;
