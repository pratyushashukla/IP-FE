import React, { useState } from 'react';
import { TextField, Button, Grid, MenuItem, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { LocalizationProvider, DesktopDatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ScheduleAppointment = () => {
  const [formData, setFormData] = useState({
    visitorId: '',
    inmateId: '',
    visitDate: null,
    startTime: null,
    estimatedEndTime: null,
    status: '',
    identityVerified: false,
    flaggedForSecurity: false,
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [visitors, setVisitors] = useState([{ id: '1', name: 'John Doe' }]);
  const [inmates, setInmates] = useState([{ id: '1', name: 'Jane Doe' }]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, visitDate: date }));
  };

  const handleTimeChange = (time) => {
    const estimatedEndTime = dayjs(time).add(30, 'minute');
    setFormData((prev) => ({ ...prev, startTime: time, estimatedEndTime }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.visitorId) newErrors.visitorId = 'Visitor is required';
    if (!formData.inmateId) newErrors.inmateId = 'Inmate is required';
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (formData.remarks.length > 50) newErrors.remarks = 'Remarks should not exceed 50 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6">Schedule an Appointment</Typography>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Visitor"
              name="visitorId"
              value={formData.visitorId}
              onChange={handleChange}
              fullWidth
              error={!!errors.visitorId}
              helperText={errors.visitorId}
            >
              {visitors.map((visitor) => (
                <MenuItem key={visitor.id} value={visitor.id}>
                  {visitor.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Inmate"
              name="inmateId"
              value={formData.inmateId}
              onChange={handleChange}
              fullWidth
              error={!!errors.inmateId}
              helperText={errors.inmateId}
            >
              {inmates.map((inmate) => (
                <MenuItem key={inmate.id} value={inmate.id}>
                  {inmate.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <DesktopDatePicker
              label="Visit Date"
              value={formData.visitDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.visitDate}
                  helperText={errors.visitDate}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={handleTimeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Estimated End Time"
              value={formData.estimatedEndTime ? dayjs(formData.estimatedEndTime).format('HH:mm') : ''}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              error={!!errors.status}
              helperText={errors.status}
            >
              {['completed', 'canceled', 'scheduled', 'ongoing'].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="identityVerified"
                  checked={formData.identityVerified}
                  onChange={handleChange}
                />
              }
              label="Identity Verified"
            />
          </Grid>

          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  name="flaggedForSecurity"
                  checked={formData.flaggedForSecurity}
                  onChange={handleChange}
                />
              }
              label="Flagged for Security"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              error={!!errors.remarks}
              helperText={errors.remarks}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Schedule Appointment
            </Button>
          </Grid>
        </Grid>
      </form>
    </LocalizationProvider>
  );
};

export default ScheduleAppointment;
