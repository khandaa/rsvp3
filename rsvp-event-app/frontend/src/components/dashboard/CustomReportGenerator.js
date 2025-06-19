import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel,
  Alert,
  useTheme,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DateRangePicker from '@mui/lab/DateRangePicker';
import api from '../../utils/api';

function CustomReportGenerator({ eventId }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState(null);
  
  // Report configuration state
  const [reportConfig, setReportConfig] = useState({
    title: '',
    description: '',
    dataModules: {
      rsvpStatistics: true,
      attendanceTracking: false,
      demographicData: false,
      guestList: false,
      logisticsItems: false,
      notifications: false
    },
    filters: {
      timeRange: null,
      rsvpStatus: [],
      guestGroups: [],
      customFilters: []
    },
    format: 'excel', // excel, pdf, csv
    scheduling: {
      scheduled: false,
      frequency: 'once', // once, daily, weekly, monthly
      recipients: []
    }
  });

  const handleDataModuleChange = (event) => {
    setReportConfig({
      ...reportConfig,
      dataModules: {
        ...reportConfig.dataModules,
        [event.target.name]: event.target.checked
      }
    });
  };

  const handleFormatChange = (event) => {
    setReportConfig({
      ...reportConfig,
      format: event.target.value
    });
  };

  const handleRsvpStatusChange = (event) => {
    const { value } = event.target;
    setReportConfig({
      ...reportConfig,
      filters: {
        ...reportConfig.filters,
        rsvpStatus: value
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportConfig({
      ...reportConfig,
      [name]: value
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setReportGenerated(false);
  };

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would make an API call to generate the report
      // For demo, we'll simulate a report generation
      
      // Create the report configuration to send to the backend
      const reportRequest = {
        eventId,
        ...reportConfig
      };
      
      // This would be a real API call in production
      // const response = await api.post('/reporting/custom-report', reportRequest);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setReportGenerated(true);
      setActiveStep(3);
    } catch (error) {
      console.error('Failed to generate report', error);
      setError('Failed to generate the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    // In a real app, this would trigger the download of the generated report
    console.log('Downloading report with configuration:', reportConfig);
    
    // For demo, show an alert that download would start
    alert('In a real app, this would download your report.');
  };

  const steps = ['Select Data Modules', 'Configure Filters', 'Format & Schedule', 'Generate Report'];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        <AssessmentIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Custom Report Generator
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          {activeStep === 0 && (
            <>
              <Typography variant="h6" gutterBottom>Select Data Modules</Typography>
              <Typography paragraph color="textSecondary">
                Choose what information you want to include in your custom report.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" variant="standard" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.rsvpStatistics} 
                            onChange={handleDataModuleChange} 
                            name="rsvpStatistics" 
                          />
                        }
                        label="RSVP Statistics"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.attendanceTracking} 
                            onChange={handleDataModuleChange} 
                            name="attendanceTracking" 
                          />
                        }
                        label="Attendance Tracking"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.demographicData} 
                            onChange={handleDataModuleChange} 
                            name="demographicData" 
                          />
                        }
                        label="Demographic Data"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" variant="standard" fullWidth>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.guestList} 
                            onChange={handleDataModuleChange} 
                            name="guestList" 
                          />
                        }
                        label="Guest List"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.logisticsItems} 
                            onChange={handleDataModuleChange} 
                            name="logisticsItems" 
                          />
                        }
                        label="Logistics Items"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={reportConfig.dataModules.notifications} 
                            onChange={handleDataModuleChange} 
                            name="notifications" 
                          />
                        }
                        label="Notification History"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <TextField
                    name="title"
                    label="Report Title"
                    value={reportConfig.title}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    name="description"
                    label="Report Description"
                    value={reportConfig.description}
                    onChange={handleInputChange}
                    multiline
                    rows={2}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </>
          )}
          
          {activeStep === 1 && (
            <>
              <Typography variant="h6" gutterBottom>
                <FilterAltIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Configure Filters
              </Typography>
              <Typography paragraph color="textSecondary">
                Apply filters to narrow down the data included in your report.
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>RSVP Status Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel id="rsvp-status-label">RSVP Status</InputLabel>
                    <Select
                      labelId="rsvp-status-label"
                      id="rsvp-status"
                      multiple
                      value={reportConfig.filters.rsvpStatus}
                      onChange={handleRsvpStatusChange}
                      label="RSVP Status"
                    >
                      <MenuItem value="attending">Attending</MenuItem>
                      <MenuItem value="declined">Declined</MenuItem>
                      <MenuItem value="maybe">Maybe</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Guest Group Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary">
                    Select guest groups to include in the report. Leave empty to include all groups.
                  </Typography>
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="guest-groups-label">Guest Groups</InputLabel>
                    <Select
                      labelId="guest-groups-label"
                      id="guest-groups"
                      multiple
                      value={reportConfig.filters.guestGroups}
                      onChange={(e) => setReportConfig({
                        ...reportConfig,
                        filters: {
                          ...reportConfig.filters,
                          guestGroups: e.target.value
                        }
                      })}
                      label="Guest Groups"
                    >
                      <MenuItem value="family">Family</MenuItem>
                      <MenuItem value="friends">Friends</MenuItem>
                      <MenuItem value="colleagues">Colleagues</MenuItem>
                      <MenuItem value="vip">VIP</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Custom Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="textSecondary" paragraph>
                    Add any additional custom filters for your report.
                  </Typography>
                  <Button variant="outlined" size="small">
                    Add Custom Filter
                  </Button>
                </AccordionDetails>
              </Accordion>
            </>
          )}
          
          {activeStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom>Format & Schedule</Typography>
              <Typography paragraph color="textSecondary">
                Choose the report format and set up scheduling if needed.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Report Format</Typography>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="report-format-label">Format</InputLabel>
                      <Select
                        labelId="report-format-label"
                        id="report-format"
                        value={reportConfig.format}
                        onChange={handleFormatChange}
                        label="Format"
                      >
                        <MenuItem value="excel">Excel (.xlsx)</MenuItem>
                        <MenuItem value="pdf">PDF Document</MenuItem>
                        <MenuItem value="csv">CSV File</MenuItem>
                        <MenuItem value="html">HTML Report</MenuItem>
                      </Select>
                    </FormControl>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Report Scheduling</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={reportConfig.scheduling.scheduled}
                          onChange={(e) => setReportConfig({
                            ...reportConfig,
                            scheduling: {
                              ...reportConfig.scheduling,
                              scheduled: e.target.checked
                            }
                          })}
                        />
                      }
                      label="Schedule this report"
                    />
                    
                    {reportConfig.scheduling.scheduled && (
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="schedule-frequency-label">Frequency</InputLabel>
                        <Select
                          labelId="schedule-frequency-label"
                          id="schedule-frequency"
                          value={reportConfig.scheduling.frequency}
                          onChange={(e) => setReportConfig({
                            ...reportConfig,
                            scheduling: {
                              ...reportConfig.scheduling,
                              frequency: e.target.value
                            }
                          })}
                          label="Frequency"
                        >
                          <MenuItem value="once">One time</MenuItem>
                          <MenuItem value="daily">Daily</MenuItem>
                          <MenuItem value="weekly">Weekly</MenuItem>
                          <MenuItem value="monthly">Monthly</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Paper>
                </Grid>
                
                {reportConfig.scheduling.scheduled && (
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Recipients</Typography>
                      <TextField
                        label="Email Recipients"
                        placeholder="Enter email addresses separated by commas"
                        fullWidth
                        margin="normal"
                      />
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </>
          )}
          
          {activeStep === 3 && (
            <>
              <Typography variant="h6" gutterBottom>Generate Report</Typography>
              <Typography paragraph color="textSecondary">
                Review your report configuration and generate the report.
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>Report Configuration Summary</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2"><strong>Title:</strong> {reportConfig.title || 'Untitled Report'}</Typography>
                    <Typography variant="body2"><strong>Format:</strong> {reportConfig.format.toUpperCase()}</Typography>
                    <Typography variant="body2">
                      <strong>Data Modules:</strong> {Object.keys(reportConfig.dataModules)
                        .filter(key => reportConfig.dataModules[key])
                        .map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))
                        .join(', ')}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2">
                      <strong>RSVP Filters:</strong> {reportConfig.filters.rsvpStatus.length ? 
                        reportConfig.filters.rsvpStatus.join(', ') : 'All'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Guest Groups:</strong> {reportConfig.filters.guestGroups.length ? 
                        reportConfig.filters.guestGroups.join(', ') : 'All'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Scheduled:</strong> {reportConfig.scheduling.scheduled ? 
                        `Yes (${reportConfig.scheduling.frequency})` : 'No'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
              )}
              
              {!reportGenerated ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateReport}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AssessmentIcon />}
                >
                  {loading ? 'Generating...' : 'Generate Report'}
                </Button>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Your report has been successfully generated!
                  </Alert>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadReport}
                    startIcon={<FileDownloadIcon />}
                  >
                    Download Report
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          
          {activeStep === steps.length - 1 ? (
            reportGenerated && (
              <Button onClick={handleReset}>Create New Report</Button>
            )
          ) : (
            <Button onClick={handleNext} variant="contained">
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default CustomReportGenerator;
