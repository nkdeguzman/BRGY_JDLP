import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Person,
  Close,
  UploadFile,
} from '@mui/icons-material';
import {
  getResidents,
  deleteResident,
  createResident,
  updateResident,
} from '../api/residentsApi';

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [editing, setEditing] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, resident: null });
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getResidents();
      setResidents(res.data);
      setFilteredResidents(res.data);
    } catch (err) {
      console.error('Error loading residents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResidents(residents);
    } else {
      const filtered = residents.filter(
        (r) =>
          `${r.first_name} ${r.middle_name || ''} ${r.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          r.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResidents(filtered);
    }
  }, [searchTerm, residents]);

  const handleDelete = async (resident) => setDeleteDialog({ open: true, resident });
  const handleCloseDeleteDialog = () => setDeleteDialog({ open: false, resident: null });

  const confirmDelete = async () => {
    try {
      await deleteResident(deleteDialog.resident.id);
      load();
      setDeleteDialog({ open: false, resident: null });
    } catch (err) {
      console.error('Error deleting resident:', err);
    }
  };

  const handleOpenForm = (resident = null) => {
    setEditing(
      resident || {
        first_name: '',
        middle_name: '',
        last_name: '',
        dob: '',
        place_of_birth: '',
        civil_status: '',
        gender: '',
        household_no: '',
        email: '',
        address: '',
        phone: '',
        photo: null,
        photoPreview: null,
      }
    );
    setFormError('');
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditing(null);
    setFormError('');
    load();
  };

  const handleFormSubmit = async () => {
    if (
      !editing.first_name.trim() ||
      !editing.last_name.trim() ||
      !editing.gender.trim() ||
      !editing.address.trim()
    ) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      if (editing.id) {
        await updateResident(editing.id, editing);
      } else {
        await createResident(editing);
      }
      handleCloseForm();
    } catch (err) {
      console.error('Error saving resident:', err);
      setFormError('Failed to save resident. Try again.');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: '#022954', borderRadius: 2, p: 2, mb: 1 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: 600, color: '#fff', fontSize: '20px' }}
        >
          Residents
        </Typography>
      </Box>

      {/* Search + Add */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, maxWidth: 900 }}>
          <TextField
            placeholder="Search resident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px 0 0 12px',
                backgroundColor: '#fff',
                border: '2px solid #022954',
                borderRight: 'none',
                '& fieldset': { border: 'none' },
              },
            }}
            InputProps={{ sx: { height: 40 } }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#022954',
              borderRadius: '0 12px 12px 0',
              minWidth: 40,
              height: 40,
            }}
          >
            <Search sx={{ color: '#fff' }} />
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenForm()}
          sx={{
            backgroundColor: '#022954',
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: 'uppercase',
            fontWeight: 700,
            fontSize: '10px',
            ml: 2,
            '&:hover': { backgroundColor: '#03346b' },
          }}
        >
          Add Resident
        </Button>
      </Box>

      {/* Residents Table */}
      <Card
        sx={{
          borderRadius: 2,
          border: '2px solid #022954',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 600, color: '#022954' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#022954' }}>Photo</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#022954' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#022954' }}>Address</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#022954' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredResidents.length > 0 ? (
                filteredResidents.map((r) => (
                  <TableRow key={r.id} sx={{ '&:hover': { backgroundColor: '#f8f9fa' } }}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>
                      <Avatar src={r.photo || null} sx={{ width: 50, height: 50, mr: 1 }}>
                        <Person />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      {r.first_name} {r.middle_name || ''} {r.last_name}
                    </TableCell>
                    <TableCell>{r.address}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpenForm(r)}
                        sx={{
                          mr: 1,
                          textTransform: 'none',
                          borderColor: '#022954',
                          color: '#022954',
                          '&:hover': { backgroundColor: '#022954', color: '#fff' },
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(r)}
                        sx={{ textTransform: 'none' }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 8, backgroundColor: '#f8f9fa' }}>
                    <Person sx={{ fontSize: 64, color: '#6c757d', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchTerm ? 'No residents found matching your search' : 'No residents found'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'Try adjusting your search terms' : 'Add your first resident to get started'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ------------------- FLOATING FORM ------------------- */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <Box sx={{ position: 'relative', p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <IconButton
            onClick={handleCloseForm}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: '#022954',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editing?.id ? 'Edit Resident' : 'Add New Resident'}
          </Typography>

          {/* Photo */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Avatar
              src={editing?.photoPreview || editing?.photo || null}
              sx={{ width: 100, height: 100, mb: 1 }}
            >
              <Person />
            </Avatar>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFile />}
              sx={{
                textTransform: 'none',
                color: '#022954',
                borderColor: '#022954',
                '&:hover': { backgroundColor: '#022954', color: '#fff' },
              }}
            >
              Click to Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditing({
                      ...editing,
                      photo: file,
                      photoPreview: URL.createObjectURL(file),
                    });
                  }
                }}
              />
            </Button>
          </Box>

          {/* Personal Information */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Personal Information
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr 1fr" gap={2}>
              <TextField label="First Name" value={editing?.first_name || ''} onChange={(e) => setEditing({ ...editing, first_name: e.target.value })} fullWidth required />
              <TextField label="Middle Name" value={editing?.middle_name || ''} onChange={(e) => setEditing({ ...editing, middle_name: e.target.value })} fullWidth />
              <TextField label="Last Name" value={editing?.last_name || ''} onChange={(e) => setEditing({ ...editing, last_name: e.target.value })} fullWidth required />
              <TextField label="Birthdate" type="date" value={editing?.dob || ''} onChange={(e) => setEditing({ ...editing, dob: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Place of Birth" value={editing?.place_of_birth || ''} onChange={(e) => setEditing({ ...editing, place_of_birth: e.target.value })} fullWidth />
              <TextField select label="Civil Status" value={editing?.civil_status || ''} onChange={(e) => setEditing({ ...editing, civil_status: e.target.value })} fullWidth required>
                {['Single', 'Married', 'Widowed', 'Divorced', 'Separated'].map(option => (<MenuItem key={option} value={option}>{option}</MenuItem>))}
              </TextField>
              <TextField select label="Gender" value={editing?.gender || ''} onChange={(e) => setEditing({ ...editing, gender: e.target.value })} fullWidth required>
                {['Male', 'Female', 'Other'].map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>

          {/* Address & Contact Information */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Address & Contact Information
            </Typography>
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField label="Address" value={editing?.address || ''} onChange={(e) => setEditing({ ...editing, address: e.target.value })} fullWidth required />
              <TextField label="Contact Number" value={editing?.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} fullWidth />
              <TextField label="Household No." value={editing?.household_no || ''} onChange={(e) => setEditing({ ...editing, household_no: e.target.value })} fullWidth />
              <TextField label="Email" type="email" value={editing?.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} fullWidth />
            </Box>
          </Box>

          {formError && <Typography color="error">{formError}</Typography>}

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#022954',
              color: '#fff',
              fontWeight: 700,
              textTransform: 'uppercase',
              '&:hover': { backgroundColor: '#03346b' },
            }}
            onClick={handleFormSubmit}
          >
            {editing?.id ? 'Save Changes' : 'Save'}
          </Button>
        </Box>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deleteDialog.resident?.first_name} {deleteDialog.resident?.last_name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
