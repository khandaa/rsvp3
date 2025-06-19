import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Mail as MailIcon,
  FileUpload as FileUploadIcon,
  FileDownload as FileDownloadIcon,
} from '@mui/icons-material';
import api from '../../services/api';

export default function GuestsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalGuests, setTotalGuests] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGuests();
  }, [page, rowsPerPage, searchQuery]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const { data } = await api.get('/api/guests', {
      //   params: { page, limit: rowsPerPage, search: searchQuery }
      // });

      // Mock data
      const mockGuests = [
        { 
          id: 1, 
          firstName: 'John', 
          lastName: 'Doe', 
          email: 'john.doe@example.com', 
          phone: '123-456-7890', 
          status: 'invited',
          rsvpStatus: 'pending',
          group: 'Friends',
          plusOne: true,
          notes: 'Allergic to nuts'
        },
        { 
          id: 2, 
          firstName: 'Jane', 
          lastName: 'Smith', 
          email: 'jane.smith@example.com', 
          phone: '987-654-3210', 
          status: 'invited',
          rsvpStatus: 'confirmed',
          group: 'Family',
          plusOne: false,
          notes: 'Vegetarian'
        },
        { 
          id: 3, 
          firstName: 'Bob', 
          lastName: 'Johnson', 
          email: 'bob.johnson@example.com', 
          phone: '555-123-4567', 
          status: 'invited',
          rsvpStatus: 'declined',
          group: 'Colleagues',
          plusOne: false,
          notes: ''
        },
        { 
          id: 4, 
          firstName: 'Sarah', 
          lastName: 'Williams', 
          email: 'sarah.w@example.com', 
          phone: '555-987-6543', 
          status: 'invited',
          rsvpStatus: 'pending',
          group: 'Friends',
          plusOne: true,
          notes: 'Bringing kids'
        },
        { 
          id: 5, 
          firstName: 'Michael', 
          lastName: 'Brown', 
          email: 'michael.b@example.com', 
          phone: '123-789-4560', 
          status: 'draft',
          rsvpStatus: 'pending',
          group: 'Business',
          plusOne: false,
          notes: ''
        }
      ];
      
      const filteredGuests = searchQuery
        ? mockGuests.filter(guest => 
            `${guest.firstName} ${guest.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            guest.group.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : mockGuests;
      
      setTimeout(() => {
        setGuests(filteredGuests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
        setTotalGuests(filteredGuests.length);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching guests:', error);
      setError('Failed to load guests. Please try again.');
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleAddGuest = () => {
    navigate('/guests/add');
  };

  const handleEditGuest = (id) => {
    navigate(`/guests/edit/${id}`);
  };

  const handleOpenDeleteDialog = (guest) => {
    setGuestToDelete(guest);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGuestToDelete(null);
  };

  const handleDeleteGuest = async () => {
    if (!guestToDelete) return;
    
    try {
      // In a real app, this would be an API call
      // await api.delete(`/api/guests/${guestToDelete.id}`);
      
      // Mock success
      console.log(`Deleting guest ${guestToDelete.id}`);
      
      // Update local state
      setGuests(guests.filter(guest => guest.id !== guestToDelete.id));
      setTotalGuests(totalGuests - 1);
      
      handleCloseDeleteDialog();
      // Show success notification
      
    } catch (error) {
      console.error('Error deleting guest:', error);
      setError('Failed to delete guest. Please try again.');
      handleCloseDeleteDialog();
    }
  };

  const handleImportGuests = () => {
    // Implementation for importing guests
    console.log('Import guests');
  };

  const handleExportGuests = () => {
    // Implementation for exporting guests
    console.log('Export guests');
  };

  const handleSendInvitations = () => {
    // Implementation for sending invitations
    console.log('Send invitations');
  };

  const getRsvpStatusChipColor = (status) => {
    switch(status) {
      case 'confirmed': return 'success';
      case 'declined': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Guests
        </Typography>
        
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddGuest}
            sx={{ mr: 1 }}
          >
            Add Guest
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={handleImportGuests}
          >
            Import Guests
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search guests by name, email, or group"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportGuests}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<MailIcon />}
              onClick={handleSendInvitations}
            >
              Send Invitations
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>RSVP Status</TableCell>
                <TableCell>Plus One</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : guests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      {searchQuery ? 'No guests match your search criteria.' : 'No guests added yet.'}
                    </Typography>
                    <Button
                      variant="text"
                      startIcon={<AddIcon />}
                      onClick={handleAddGuest}
                      sx={{ mt: 1 }}
                    >
                      Add your first guest
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                guests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      {guest.firstName} {guest.lastName}
                    </TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.phone}</TableCell>
                    <TableCell>{guest.group}</TableCell>
                    <TableCell>
                      <Chip 
                        label={guest.rsvpStatus.charAt(0).toUpperCase() + guest.rsvpStatus.slice(1)} 
                        size="small"
                        color={getRsvpStatusChipColor(guest.rsvpStatus)}
                      />
                    </TableCell>
                    <TableCell>{guest.plusOne ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton 
                          size="small"
                          onClick={() => handleEditGuest(guest.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDeleteDialog(guest)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalGuests}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Guest</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {guestToDelete ? `${guestToDelete.firstName} ${guestToDelete.lastName}` : 'this guest'}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteGuest} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
