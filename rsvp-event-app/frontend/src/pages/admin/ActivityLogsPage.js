import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  FilterList as FilterIcon, 
  Clear as ClearIcon, 
  SearchOutlined as SearchIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

// Services
import logsService from '../../services/logsService';

function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    logType: '',
    username: '',
    severity: ''
  });
  
  // Showing filter panel
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [page, rowsPerPage]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      
      const queryParams = {
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      };
      
      // Format dates for API
      if (filters.startDate) {
        queryParams.startDate = format(filters.startDate, 'yyyy-MM-dd');
      }
      
      if (filters.endDate) {
        queryParams.endDate = format(filters.endDate, 'yyyy-MM-dd');
      }
      
      const data = await logsService.getActivityLogs(queryParams);
      setLogs(data.logs || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const applyFilters = () => {
    setPage(0);
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({
      startDate: null,
      endDate: null,
      logType: '',
      username: '',
      severity: ''
    });
    setPage(0);
  };

  const exportLogs = async () => {
    try {
      await logsService.exportLogs(filters);
    } catch (err) {
      console.error('Error exporting logs:', err);
    }
  };

  const getSeverityChip = (severity) => {
    switch (severity.toLowerCase()) {
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      case 'warning':
        return <Chip label="Warning" color="warning" size="small" />;
      case 'info':
        return <Chip label="Info" color="info" size="small" />;
      case 'debug':
        return <Chip label="Debug" color="default" size="small" />;
      default:
        return <Chip label={severity} size="small" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Activity Logs</Typography>
        <Box>
          <Button 
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportLogs}
          >
            Export
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(newValue) => handleFilterChange('startDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(newValue) => handleFilterChange('endDate', newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </LocalizationProvider>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Log Type</InputLabel>
                <Select
                  value={filters.logType}
                  label="Log Type"
                  onChange={(e) => handleFilterChange('logType', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="auth">Authentication</MenuItem>
                  <MenuItem value="user">User Activity</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="rsvp">RSVP</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Username"
                fullWidth
                value={filters.username}
                onChange={(e) => handleFilterChange('username', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  label="Severity"
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="error">Error</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="debug">Debug</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ mr: 1 }}>
                Clear
              </Button>
              <Button variant="contained" onClick={applyFilters} startIcon={<SearchIcon />}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Severity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.type}</TableCell>
                      <TableCell>{log.username || 'System'}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.ipAddress}</TableCell>
                      <TableCell>{getSeverityChip(log.severity)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={-1}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default ActivityLogsPage;
