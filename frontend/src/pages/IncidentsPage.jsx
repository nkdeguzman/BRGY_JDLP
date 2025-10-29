import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Card,
  CardContent,
  TextField,
  Dialog,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Search, ReportProblem, Close } from "@mui/icons-material";
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from "../api/incidentsApi";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    type: "",
    persons_involved: "",
    resolution_status: "",
    mediation_records: "",
    outcome: "",
  });
  const [formError, setFormError] = useState("");

  const loadIncidents = async () => {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
      setFilteredIncidents(res.data);
    } catch (err) {
      console.error("Error loading incidents:", err);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredIncidents(incidents);
    } else {
      const filtered = incidents.filter(
        (i) =>
          i.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.persons_involved.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.resolution_status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIncidents(filtered);
    }
  }, [searchTerm, incidents]);

  // ✅ Open form for add
  const handleAdd = () => {
    setEditing(null);
    setFormData({
      date: "",
      type: "",
      persons_involved: "",
      resolution_status: "",
      mediation_records: "",
      outcome: "",
    });
    setFormError("");
    setOpenForm(true);
  };

  // ✅ Open form for edit
  const handleEdit = (incident) => {
    setEditing(incident);
    setFormData({ ...incident });
    setFormError("");
    setOpenForm(true);
  };

  // ✅ Close form
  const handleCloseForm = () => {
    setOpenForm(false);
    setEditing(null);
    setFormError("");
  };

  // ✅ Submit form
  const handleSubmit = async () => {
    if (!formData.type || !formData.persons_involved) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      if (editing) {
        await updateIncident(editing.id, formData);
      } else {
        await createIncident(formData);
      }
      handleCloseForm();
      loadIncidents();
    } catch (err) {
      console.error("Error saving incident:", err);
      setFormError("Failed to save. Try again.");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this incident?")) {
      await deleteIncident(id);
      loadIncidents();
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
          Incident & Blotter Records
        </Typography>
      </Box>

      {/* Search + Add */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, maxWidth: 900 }}>
          <TextField
            placeholder="Search incident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px 0 0 12px",
                backgroundColor: "#fff",
                border: "2px solid #022954",
                borderRight: "none",
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{ sx: { height: 40 } }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#022954",
              borderRadius: "0 12px 12px 0",
              minWidth: 40,
              height: 40,
            }}
          >
            <Search sx={{ color: "#fff" }} />
          </Button>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{
            backgroundColor: "#022954",
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: "10px",
            ml: 2,
            '&:hover': { backgroundColor: '#03346b' },
          }}
        >
          Add Incident
        </Button>
      </Box>

      {/* Floating Add/Edit Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <Box sx={{ position: "relative", p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <IconButton
            onClick={handleCloseForm}
            sx={{ position: "absolute", top: 8, right: 8, color: "#022954" }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editing ? "Edit Incident" : "Add New Incident"}
          </Typography>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Persons Involved"
              value={formData.persons_involved}
              onChange={(e) => setFormData({ ...formData, persons_involved: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Resolution Status"
              value={formData.resolution_status}
              onChange={(e) => setFormData({ ...formData, resolution_status: e.target.value })}
              fullWidth
            />
            <TextField
              label="Mediation Records"
              value={formData.mediation_records}
              onChange={(e) => setFormData({ ...formData, mediation_records: e.target.value })}
              fullWidth
            />
            <TextField
              label="Outcome"
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              fullWidth
            />
          </Box>

          {formError && <Typography color="error">{formError}</Typography>}

          <Button
            variant="contained"
            sx={{ backgroundColor: "#022954", color: "#fff", fontWeight: 700 }}
            onClick={handleSubmit}
          >
            {editing ? "Save Changes" : "Save"}
          </Button>
        </Box>
      </Dialog>

      {/* Table */}
      <Card
        sx={{
          borderRadius: 2,
          border: "2px solid #022954",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Persons Involved</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Records</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Outcome</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((i) => (
                  <TableRow
                    key={i.id}
                    sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                  >
                    <TableCell>{new Date(i.date).toLocaleDateString()}</TableCell>
                    <TableCell>{i.type}</TableCell>
                    <TableCell>{i.persons_involved}</TableCell>
                    <TableCell>{i.resolution_status}</TableCell>
                    <TableCell>{i.mediation_records || "—"}</TableCell>
                    <TableCell>{i.outcome}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(i)}
                          sx={{
                            borderColor: "#022954",
                            color: "#022954",
                            "&:hover": {
                              backgroundColor: "#022954",
                              color: "#fff",
                            },
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(i.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <ReportProblem sx={{ fontSize: 64, color: "#6c757d", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm
                        ? "No incidents found matching your search"
                        : "No incidents available"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Add an incident to get started"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
}
