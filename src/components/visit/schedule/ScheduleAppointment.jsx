import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { ADD_VISIT } from "../../../actions/visits/ActionCreators";

const ScheduleAppointment = () => {
  const dispatch = useDispatch();

  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const visitorsData = useSelector(
    (state) => state.VisitorsReducer.visitorsData
  );

  const [formData, setFormData] = useState({
    visitorId: null,
    inmateId: null,
    startTime: null,
    estimatedEndTime: null,
    identityVerified: false,
    flaggedForSecurity: false,
    remarks: "",
    staffId: localStorage.getItem("userId"),
  });

  const [filteredVisitors, setFilteredVisitors] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (formData.inmateId) {
      // Filter visitors based on selected inmate ID
      const filtered = visitorsData.filter(
        (visitor) => visitor.inmateId._id === formData.inmateId
      );
      setFilteredVisitors(filtered);
    } else {
      setFilteredVisitors([]);
    }
  }, [formData.inmateId, visitorsData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDateTimeChange = (dateTime) => {
    const now = dayjs(); // Current date and time
    const todayStart = dayjs().startOf("day"); // Start of today

    if (dateTime) {
      if (dayjs(dateTime).isBefore(now)) {
        // If the selected date and time are in the past
        setErrors((prev) => ({
          ...prev,
          startTime: "Visit date and time cannot be in the past",
        }));
        setFormData((prev) => ({
          ...prev,
          startTime: null,
          estimatedEndTime: null,
        }));
      } else {
        // Valid date and time
        const estimatedEndTime = dayjs(dateTime).add(30, "minute");
        setErrors((prev) => ({
          ...prev,
          startTime: null, // Clear any existing error
        }));
        setFormData((prev) => ({
          ...prev,
          startTime: dateTime,
          estimatedEndTime: estimatedEndTime.toDate(), // Convert to JavaScript Date
        }));
      }
    } else {
      // If no dateTime is provided (null value)
      setErrors((prev) => ({
        ...prev,
        startTime: "Visit date and time are required",
      }));
      setFormData((prev) => ({
        ...prev,
        startTime: null,
        estimatedEndTime: null,
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      visitorId: null,
      inmateId: null,
      startTime: null,
      estimatedEndTime: null,
      identityVerified: false,
      flaggedForSecurity: false,
      remarks: "",
      staffId: localStorage.getItem("userId"),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.visitorId) newErrors.visitorId = "Visitor is required";
    if (!formData.inmateId) newErrors.inmateId = "Inmate is required";
    if (!formData.startTime) newErrors.startTime = "Visit date is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.remarks)
      newErrors.status = "Remarks is required regarding visitor";
    if (formData.remarks.length > 50)
      newErrors.remarks = "Remarks should not exceed 50 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      dispatch(ADD_VISIT(formData, resetForm));
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
                <Autocomplete
                  options={inmatesData}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                  filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                      option.lastName
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  }
                  onChange={(e, value) => {
                    const obj = {
                      target: {
                        name: "inmateId",
                        value: value ? value._id : "",
                      },
                    };
                    return handleChange(obj);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Inmate"
                      fullWidth
                      error={!!errors.inmateId}
                      helperText={errors.inmateId}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  disabled={!formData.inmateId}
                  options={filteredVisitors}
                  value={
                    formData.visitorId
                      ? filteredVisitors.find(
                          (visitor) => visitor._id === formData.visitorId
                        )
                      : null
                  }
                  getOptionLabel={(option) =>
                    `${option.firstname} ${option.lastname}`
                  }
                  filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                      option.lastname
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  }
                  onChange={(e, value) => {
                    const visitorId = value ? value._id : "";
                    setFormData((prev) => ({
                      ...prev,
                      visitorId,
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Visitor"
                      fullWidth
                      error={!!errors.visitorId}
                      helperText={errors.visitorId}
                      required
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <DateTimePicker
                  minDateTime={dayjs()} // Restrict to today and the current time
                  disableCloseOnSelect={true} // Prevent picker from closing on selection
                  sx={{ width: "100%" }}
                  label="Visit Date & Time"
                  value={formData.startTime}
                  onChange={handleDateTimeChange}
                  ampm={false} // Use 24-hour format
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
                  value={
                    formData.estimatedEndTime
                      ? dayjs(formData.estimatedEndTime).format("HH:mm") // 24-hour format
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
                  required
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
