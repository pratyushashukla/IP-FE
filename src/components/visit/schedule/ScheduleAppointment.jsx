import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const ScheduleAppointment = () => {
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const [formData, setFormData] = useState({
    visitorId: "",
    inmateId: "",
    startTime: null,
    estimatedEndTime: null,
    identityVerified: false,
    flaggedForSecurity: false,
    remarks: "",
  });

  const [errors, setErrors] = useState({});
  const [visitors, setVisitors] = useState([{ id: "1", name: "John Doe" }]);
  const [inmates, setInmates] = useState([{ id: "1", name: "Jane Doe" }]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateTimeChange = (dateTime) => {
    const estimatedEndTime = dayjs(dateTime).add(30, "minute");
    setFormData((prev) => ({
      ...prev,
      startTime: new Date(dateTime),
      estimatedEndTime: new Date(estimatedEndTime),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.visitorId) newErrors.visitorId = "Visitor is required";
    if (!formData.inmateId) newErrors.inmateId = "Inmate is required";
    if (!formData.visitDate) newErrors.visitDate = "Visit date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (formData.remarks.length > 50)
      newErrors.remarks = "Remarks should not exceed 50 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    } else {
      console.log("feewfwefwe",formData);
    }
  };

  return (
    <Grid container>
      <Grid xs={2}></Grid>
      <Grid xs={8}>
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
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {`${inmate.firstName} ${inmate.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <DateTimePicker
                  sx={{ width: "100%" }}
                  label="Visit Date & Time"
                  value={formData.visitDateTime}
                  onChange={handleDateTimeChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.visitDateTime}
                      helperText={errors.visitDateTime}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Estimated End Time"
                  value={
                    formData.estimatedEndTime
                      ? dayjs(formData.estimatedEndTime).format("HH:mm")
                      : ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              {/* <Grid item xs={6}>
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
          </Grid> */}

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
      </Grid>
      <Grid xs={2}></Grid>
    </Grid>
  );
};

export default ScheduleAppointment;
