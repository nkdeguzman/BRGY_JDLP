import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Card,
  CardContent,
  Dialog,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Search, Description, Close } from "@mui/icons-material";
import {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../api/documentsApi";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form state
  const [docType, setDocType] = useState("");
  const [residentName, setResidentName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [status, setStatus] = useState("Pending");
  const [formError, setFormError] = useState("");

  const loadDocs = async () => {
    try {
      const res = await getDocuments();
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      console.error("Error loading documents:", err);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) setFilteredDocs(documents);
    else {
      setFilteredDocs(
        documents.filter(
          (d) =>
            d.doc_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.resident_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.purpose.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, documents]);

  const handleDelete = async (id) => {
    await deleteDocument(id);
    loadDocs();
  };

  const handleDialogOpen = (doc = null) => {
    setEditing(doc);
    if (doc) {
      setDocType(doc.doc_type);
      setResidentName(doc.resident_name);
      setPurpose(doc.purpose);
      setStatus(doc.status || "Pending");
    } else {
      setDocType("");
      setResidentName("");
      setPurpose("");
      setStatus("Pending");
    }
    setFormError("");
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
    setEditing(null);
    setFormError("");
  };

  const handleFormSubmit = async () => {
    if (!docType.trim() || !residentName.trim() || !purpose.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const payload = {
      doc_type: docType,
      resident_name: residentName,
      purpose,
      status,
    };

    try {
      if (editing) {
        await updateDocument(editing.id, payload);
      } else {
        await createDocument(payload);
      }
      loadDocs();
      handleDialogClose();
    } catch (err) {
      console.error("Error saving document:", err);
      setFormError("Failed to save document. Try again.");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ backgroundColor: "#022954", borderRadius: 2, p: 2, mb: 1 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{ fontWeight: 600, color: "#fff", fontSize: "20px" }}
        >
          Document and Certification Management
        </Typography>
      </Box>

      {/* Search + Add */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, maxWidth: 900 }}>
          <TextField
            placeholder="Search document..."
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
          onClick={() => handleDialogOpen()}
          sx={{
            backgroundColor: "#022954",
            borderRadius: 2,
            px: 3,
            py: 1,
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: "10px",
            ml: 2,
            "&:hover": { backgroundColor: "#03346b" },
          }}
        >
          Add Document
        </Button>
      </Box>

      {/* Document Table */}
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
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Resident
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Purpose
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#022954" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((d) => (
                  <TableRow
                    key={d.id}
                    sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
                  >
                    <TableCell>{d.doc_type}</TableCell>
                    <TableCell>{d.resident_name}</TableCell>
                    <TableCell>{d.purpose}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        value={d.status}
                        onChange={async (e) => {
                          await updateDocument(d.id, {
                            ...d,
                            status: e.target.value,
                          });
                          loadDocs();
                        }}
                        size="small"
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: "#fff",
                          },
                        }}
                      >
                        {["Pending", "Approved", "Rejected"].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleDialogOpen(d)}
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
                          onClick={() => handleDelete(d.id)}
                          sx={{ textTransform: "none" }}
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
                    colSpan={5}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Description
                      sx={{ fontSize: 64, color: "#6c757d", mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      {searchTerm
                        ? "No documents found matching your search"
                        : "No documents available"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "Add a document to get started"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Floating Add/Edit Dialog */}
      <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <Box
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Close (X) Button */}
          <IconButton
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "#022954",
              "&:hover": { backgroundColor: "#f0f0f0" },
            }}
          >
            <Close />
          </IconButton>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editing ? "Edit Document" : "Add Document"}
          </Typography>

          <TextField
            label="Document Type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            required
          />
          <TextField
            label="Resident Name"
            value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            required
          />
          <TextField
            label="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <TextField
            label="Status"
            select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            {["Pending", "Approved", "Rejected"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {formError && <Typography color="error">{formError}</Typography>}

          <Button
            variant="contained"
            onClick={handleFormSubmit}
            sx={{
              backgroundColor: "#022954",
              color: "#fff",
              textTransform: "uppercase",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#03346b" },
            }}
          >
            {editing ? "Update Document" : "Save"}
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
}
