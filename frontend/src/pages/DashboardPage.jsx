import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Home as HomeIcon,
  Report as ReportIcon,
  Description as DocumentIcon,
  Assignment as CertificateIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { getNotes, addNote as apiAddNote, updateNote as apiUpdateNote, deleteNote as apiDeleteNote } from '../api/notesApi';
import { getDashboardStats, getRecentActivities } from '../api/statsApi';

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalHouseholds: 0,
    ongoingIncidents: 0,
    pendingDocuments: 0,
    completedCertificates: 0,
    monthlyGrowth: 0,
    growthPercentage: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch statistics and activities in parallel
      const [statsResponse, activitiesResponse] = await Promise.all([
        getDashboardStats(),
        getRecentActivities(),
      ]);

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

      if (activitiesResponse.data.success) {
        setRecentActivities(activitiesResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // Refetch when component mounts

  // Load notes
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const res = await getNotes();
        if (res.data && res.data.success) {
          setNotes(res.data.data);
        }
      } catch (e) {
        console.error('Error loading notes', e);
      }
    };
    loadNotes();
  }, []);

  const openAddNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
    setNoteDialogOpen(true);
  };

  const openEditNote = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title || '', content: note.content || '' });
    setNoteDialogOpen(true);
  };

  const closeNoteDialog = () => {
    setNoteDialogOpen(false);
  };

  const saveNote = async () => {
    try {
      if (editingNote) {
        await apiUpdateNote(editingNote.id, noteForm);
      } else {
        await apiAddNote(noteForm);
      }
      const res = await getNotes();
      setNotes(res.data.data || []);
      setNoteDialogOpen(false);
    } catch (e) {
      console.error('Error saving note', e);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await apiDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error('Error deleting note', e);
    }
  };

  const openViewNote = (note) => {
    setViewNote(note);
    setViewDialogOpen(true);
  };

  const closeViewDialog = () => {
    setViewDialogOpen(false);
    setViewNote(null);
  };

  // Refresh data when page becomes visible (e.g., user switches tabs back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboardData]);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const quickActions = [
    {
      title: 'Add Resident',
      icon: <PeopleIcon />,
      color: '#022954',
      path: '/residents',
    },
    {
      title: 'Add Household',
      icon: <HomeIcon />,
      color: '#022954',
      path: '/households',
    },
    {
      title: 'Report Incident',
      icon: <ReportIcon />,
      color: '#022954',
      path: '/incidents',
    },
    {
      title: 'Issue Certificate',
      icon: <CertificateIcon />,
      color: '#022954',
      path: '/certificate',
    },
    {
      title: 'Manage Documents',
      icon: <DocumentIcon />,
      color: '#022954',
      path: '/documents',
    },
  ];

  const StatCard = ({ title, value, icon }) => (
    <Card
      sx={{
        height: '100%',
        width: '210px',
        borderRadius: 2,
        backgroundColor: 'white',
        color: 'white',
        boxShadow: 'none',
        border: '1px solid #022954',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            height: '100%',
          }}
        >
          <Box>
            <Typography
              color="white"
              gutterBottom
              variant="body2"
              sx={{
                color: '#022954',
                fontSize: '10px',
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#022954',
              }}
            >
              {value.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ color: '#022954' }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Statistics Cards */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 1,
          overflowX: 'auto',
          pb: 1,
          ml: '40px',
          height: '130px',
        }}
      >
        <StatCard
          title="Total Residents"
          value={stats.totalResidents}
          icon={<PeopleIcon sx={{ fontSize: 40 }} />}
        />
        <StatCard
          title="Total Households"
          value={stats.totalHouseholds}
          icon={<HomeIcon sx={{ fontSize: 40 }} />}
        />
        <StatCard
          title="Ongoing Incidents"
          value={stats.ongoingIncidents}
          icon={<ReportIcon sx={{ fontSize: 40 }} />}
        />
        <StatCard
          title="Pending Documents"
          value={stats.pendingDocuments}
          icon={<DocumentIcon sx={{ fontSize: 40 }} />}
        />
        <StatCard
          title="Certificates Issued"
          value={stats.completedCertificates}
          icon={<CertificateIcon sx={{ fontSize: 40 }} />}
        />
      </Box>

      {/* Main Content Container - Single Row with Two Columns */}
      <Box sx={{ mb: 1, display: 'flex', flexDirection: 'row', gap: 3 }}>
        {/* Recent Activities - Left */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              height: '382px',
              display: 'flex',
              flexDirection: 'column',
              ml: 5,
              border: '1px solid #022954',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 2, color: '#022954' }}
            >
              Recent Activities
            </Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List>
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          {activity.type === 'resident' && (
                            <PeopleIcon sx={{ color: '#022954' }} />
                          )}
                          {activity.type === 'incident' && (
                            <ReportIcon sx={{ color: '#022954' }} />
                          )}
                          {activity.type === 'certificate' && (
                            <CertificateIcon sx={{ color: '#022954' }} />
                          )}
                          {activity.type === 'document' && (
                            <DocumentIcon sx={{ color: '#022954' }} />
                          )}
                          {activity.type === 'household' && (
                            <HomeIcon sx={{ color: '#022954' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={formatTimeAgo(activity.time)}
                          primaryTypographyProps={{
                            color: '#022954',
                            fontWeight: 500,
                          }}
                        />
                        <Chip
                          label={activity.status}
                          size="small"
                          sx={{
                            ml: 2,
                            backgroundColor: '#022954',
                            color: 'white',
                            borderRadius: '20px',
                          }}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No recent activities" />
                  </ListItem>
                )}
              </List>
            </Box>
          </Paper>
        </Box>

        {/* Quick Actions - Right */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              height: '170px',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #022954',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', mb: 1, color: '#022954', fontSize: 15 }}
            >
              Quick Actions
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 1, // Add padding for scrollbar space
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 1,
                  flexWrap: 'nowrap',
                  minWidth: 'max-content', // Ensure content doesn't shrink
                }}
              >
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    onClick={() => navigate(action.path)}
                    sx={{
                      width: '90px', // Fixed width for each card
                      height: '90px',
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: '1px solid #022954',
                      boxShadow: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: '#022954',
                      mt: 1,
                      ml: 0.5,
                      flexShrink: 0, // Prevent cards from shrinking
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: '#022954',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        textAlign: 'center',
                        p: 0.5,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ color: 'white', mb: 0 }}>{action.icon}</Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 'medium', color: 'white' }}
                      >
                        {action.title}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Notes Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={{ mt: 1 }}>
              <Paper
                sx={{ p: 3, borderRadius: 2, border: '1px solid #022954', width: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', color: '#022954' }}
                  >
                    Notes
                  </Typography>
                  <IconButton
                    sx={{
                      backgroundColor: '#022954',
                      color: 'white',
                      width: 25,
                      height: 25,
                      '&:hover': { backgroundColor: '#021a3d' },
                    }}
                    onClick={openAddNote}
                  >
                    <AddIcon sx={{ fontSize: '15px' }} />
                  </IconButton>
                </Box>
                {notes && notes.length > 0 ? (
                  <Box sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap' }, // para hindi mag overlapped
                    overflowX: { xs: 'visible', md: 'auto' }, // para hindi mag overlapped
                    width: '100%', // para hindi mag overlapped
                    pb: 1,
                  }}>
                    {notes.map((note) => (
                      <Card
                        key={note.id}
                        sx={{
                          width: 90,
                          height: 90,
                          border: '1px solid #022954',
                          borderRadius: 2,
                          position: 'relative',
                          overflow: 'hidden', // keep size consistent
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        onClick={() => openViewNote(note)}
                      >
                        <CardContent sx={{ p: 1, pb: 3.5 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ color: '#022954', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={note.title}
                          >
                            {note.title || 'Untitled'}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: '#022954', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={note.content}
                          >
                            {note.content}
                          </Typography>
                        </CardContent>
                        <Box sx={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); openEditNote(note); }} sx={{ color: '#022954' }}>
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }} sx={{ color: '#022954' }}>
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: 84,
                      width: '100%',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: '#999',
                    }}
                  >
                    <Typography variant="body2">No notes yet</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Dialog open={noteDialogOpen} onClose={closeNoteDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ color: '#022954', fontWeight: 700 }}>
          {editingNote ? 'Edit Note' : 'Add Note'}
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={noteForm.title}
            onChange={(e) => setNoteForm((f) => ({ ...f, title: e.target.value }))}
          />
          <TextField
            label="Content"
            fullWidth
            margin="dense"
            multiline
            minRows={3}
            value={noteForm.content}
            onChange={(e) => setNoteForm((f) => ({ ...f, content: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeNoteDialog}>Cancel</Button>
          <Button variant="contained" onClick={saveNote} sx={{ backgroundColor: '#022954' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialogOpen} onClose={closeViewDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: '#022954', fontWeight: 700 }}>
          {viewNote?.title || 'Note'}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {viewNote?.content}
          </Typography>
          {viewNote?.created_at && (
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
              Created: {new Date(viewNote.created_at).toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
          {viewNote && (
            <Button onClick={() => { closeViewDialog(); openEditNote(viewNote); }} variant="contained" sx={{ backgroundColor: '#022954' }}>
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
