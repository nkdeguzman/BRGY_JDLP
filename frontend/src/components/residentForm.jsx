import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  Avatar,
  Box,
  Typography
} from '@mui/material'
import { createResident, updateResident } from '../api/residentsApi'

const initialForm = {
  first_name: '',
  middle_name: '',
  last_name: '',
  dob: '',
  gender: '',
  civil_status: '',
  place_of_birth: '',
  address: '',
  household_no: '',
  phone: '',
  email: '',
  photo: null
}

export default function ResidentForm({ open, resident, onClose }) {
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    if (resident && resident.id) {
      setForm({
        ...resident,
        dob: resident.dob ? String(resident.dob).substring(0, 10) : '',
        photo: null // Reset for new upload
      })
      setPreview(resident.photo ? `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}${resident.photo}` : null)
    } else {
      setForm(initialForm)
      setPreview(null)
      setError('')
    }
  }, [open, resident])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm(prev => ({ ...prev, photo: file }))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setError('')
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setError('First name and last name are required.')
      return
    }

    setLoading(true)
    try {
      if (resident && resident.id) {
        await updateResident(resident.id, form)
      } else {
        await createResident(form)
      }
      setLoading(false)
      if (onClose) onClose()
      setForm(initialForm)
      setPreview(null)
    } catch (err) {
      setLoading(false)
      const msg = err?.response?.data?.message || err.message || 'Failed to save resident'
      setError(msg)
    }
  }

  const handleCancel = () => {
    setForm(initialForm)
    setPreview(null)
    setError('')
    if (onClose) onClose()
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle 
        sx={{ 
          backgroundColor: '#022954',
          color: '#ffffff',
          fontWeight: 700,
          textAlign: 'center',
          position: 'relative',
          '& .MuiIconButton-root': {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#ffffff'
          }
        }}
      >
        {resident ? 'Edit Resident' : 'Add New Resident'}
      </DialogTitle>
      <DialogContent dividers>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          {/* Photo Upload - dashed box */}
          <Grid item xs={12}>
            <Box 
              component="label"
              htmlFor="resident-photo-input"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 140,
                border: '2px dashed #022954',
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: '#fafbff'
              }}
            >
              {preview ? (
                <Avatar src={preview} alt="Resident photo" sx={{ width: 96, height: 96 }} />
              ) : (
                <Box textAlign="center" sx={{ color: '#022954' }}>
                  <Box sx={{ fontSize: 48, lineHeight: 1, mb: 1 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </Box>
                  <Typography variant="body2">Click to upload photo</Typography>
                </Box>
              )}
              <input id="resident-photo-input" hidden accept="image/*" type="file" onChange={handleFileChange} />
            </Box>
          </Grid>

          {/* Section: Personal Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#022954' }}>
              Personal Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} fullWidth required size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Middle Name" name="middle_name" value={form.middle_name} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} fullWidth required size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select label="Gender" name="gender" value={form.gender} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}}>
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Civil Status" name="civil_status" value={form.civil_status} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Place of Birth" name="place_of_birth" value={form.place_of_birth} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#022954' }}>
              Address & Contact Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Address" name="address" value={form.address} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Household No." name="household_no" value={form.household_no} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth size="small" sx={{'& .MuiOutlinedInput-root': { borderRadius: 2, '& fieldset': { borderColor: '#022954' }, '&:hover fieldset': { borderColor: '#022954' }, '&.Mui-focused fieldset': { borderColor: '#022954', borderWidth: 2 }}}} />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleCancel} disabled={loading} variant="outlined" sx={{ borderColor: '#022954', color: '#022954', textTransform: 'none', borderRadius: 2, px: 2 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} /> : null}
          sx={{ backgroundColor: '#022954', textTransform: 'none', borderRadius: 2, px: 2, '&:hover': { backgroundColor: '#022954' } }}
        >
          {loading ? 'Saving...' : 'Save Resident'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ResidentForm.propTypes = {
  open: PropTypes.bool,
  resident: PropTypes.object,
  onClose: PropTypes.func
}
