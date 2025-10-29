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
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, Search, Home, Close } from "@mui/icons-material";
import {
  getHouseholds,
  createHousehold,
  updateHousehold,
  deleteHousehold,
} from "../api/householdsApi";

const HouseholdsPage = () => {
  const [households, setHouseholds] = useState([]);
  const [filteredHouseholds, setFilteredHouseholds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    household_no: "",
    head_of_family: "",
    members: "",
    socio_economic_classification: "",
    senior_citizens: "",
    pwds: "",
    solo_parents: "",
    indigents: "",
  });
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    const res = await getHouseholds();
    setHouseholds(res.data);
    setFilteredHouseholds(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHouseholds(households);
    } else {
      const filtered = households.filter(
        (h) =>
          h.household_no.toString().includes(searchTerm) ||
          h.head_of_family.toLowerCase().includes(searchTerm.toLowerCase()) ||
          h.socio_economic_classification
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredHouseholds(filtered);
    }
  }, [searchTerm, households]);

  const handleAdd = () => {
    setEditing(null);
    setFormData({
      household_no: "",
      head_of_family: "",
      members: "",
      socio_economic_classification: "",
      senior_citizens: "",
      pwds: "",
      solo_parents: "",
      indigents: "",
    });
    setFormError("");
    setOpenForm(true);
  };

  const handleEdit = (household) => {
    setEditing(household);
    setFormData({ ...household });
    setFormError("");
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditing(null);
    setFormError("");
  };

  const handleSubmit = async () => {
    if (!formData.household_no || !formData.head_of_family) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      if (editing) {
        await updateHousehold(editing.id, formData);
      } else {
        await createHousehold(formData);
      }
      handleCloseForm();
      loadData();
    } catch (err) {
      console.error("Error saving household:", err);
      setFormError("Failed to save. Try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this household?")) {
      await deleteHousehold(id);
      loadData();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#022954", borderRadius: 2, p: 2, mb: 1 }}>
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ fontWeight: 600, color: "#fff", fontSize: '20px'}}>
          Household & Demographic Profiling
        </Typography>
      </Box>

      {/* Search and Add */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, maxWidth: 900 }}>
          <TextField
            placeholder="Search household..."
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
            <Search sx={{ color: "#ffffff" }} />
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
          Add Household
        </Button>
      </Box>

      {/* ✅ Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <Box sx={{ position: "relative", p: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <IconButton
            onClick={handleCloseForm}
            sx={{ position: "absolute", top: 8, right: 8, color: "#022954" }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editing ? "Edit Household" : "Add New Household"}
          </Typography>

          {/* Form Fields */}
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Household No"
              value={formData.household_no}
              onChange={(e) => setFormData({ ...formData, household_no: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Head of Family"
              value={formData.head_of_family}
              onChange={(e) => setFormData({ ...formData, head_of_family: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Members"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              fullWidth
            />

            {/* ✅ Dropdown for Socio-Economic Class */}
            <TextField
              select
              label="Socio-Economic Class"
              value={formData.socio_economic_classification}
              onChange={(e) =>
                setFormData({ ...formData, socio_economic_classification: e.target.value })
              }
              fullWidth
            >
              <MenuItem value="Low Income">Low Income</MenuItem>
              <MenuItem value="Lower-Middle Income">Lower-Middle Income</MenuItem>
              <MenuItem value="Middle Income">Middle Income</MenuItem>
              <MenuItem value="Upper-Middle Income">Upper-Middle Income</MenuItem>
              <MenuItem value="High Income">High Income</MenuItem>
            </TextField>

            {/* Other Fields as Normal Text Inputs */}
            <TextField
              label="Senior Citizens"
              value={formData.senior_citizens}
              onChange={(e) => setFormData({ ...formData, senior_citizens: e.target.value })}
              fullWidth
            />
            <TextField
              label="PWDs"
              value={formData.pwds}
              onChange={(e) => setFormData({ ...formData, pwds: e.target.value })}
              fullWidth
            />
            <TextField
              label="Solo Parents"
              value={formData.solo_parents}
              onChange={(e) => setFormData({ ...formData, solo_parents: e.target.value })}
              fullWidth
            />
            <TextField
              label="Indigents"
              value={formData.indigents}
              onChange={(e) => setFormData({ ...formData, indigents: e.target.value })}
              fullWidth
            />
          </Box>

          {formError && <Typography color="error">{formError}</Typography>}

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#022954",
              color: "#fff",
              fontWeight: 700,
              alignSelf: "flex-end",
              mt: 1,
            }}
            onClick={handleSubmit}
          >
            {editing ? "Save Changes" : "Save"}
          </Button>
        </Box>
      </Dialog>

      {/* ✅ Table */}
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
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Household No</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Head of Family</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Members</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Socio-Economic Class
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Senior</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>PWDs</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Solo Parents</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Indigents</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHouseholds.length > 0 ? (
                filteredHouseholds.map((h) => (
                  <TableRow key={h.id} sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}>
                    <TableCell>{h.household_no}</TableCell>
                    <TableCell>{h.head_of_family}</TableCell>
                    <TableCell>{h.members}</TableCell>
                    <TableCell>{h.socio_economic_classification}</TableCell>
                    <TableCell>{h.senior_citizens}</TableCell>
                    <TableCell>{h.pwds}</TableCell>
                    <TableCell>{h.solo_parents}</TableCell>
                    <TableCell>{h.indigents}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEdit(h)}
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
                          onClick={() => handleDelete(h.id)}
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
                    colSpan={9}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Home sx={{ fontSize: 64, color: "#6c757d", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {searchTerm
                        ? "No households found matching your search"
                        : "No households available"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Add a household to get started"}
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
};

export default HouseholdsPage;
