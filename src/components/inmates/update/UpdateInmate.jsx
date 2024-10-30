import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

import { useSelector } from "react-redux";

// Utility function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
};

const UpdateInmate = ({ open, onClose, onUpdate, selectedInmateId }) => {
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Female", // Set default gender as "Female"
    contactNumber: "",
    status: "Active", // Set default status as "Active"
    sentenceDuration: "",
  });

  useEffect(() => {
    if (selectedInmateId) {
      const selectedInmate = inmatesData.find(
        (inmate) => inmate._id === selectedInmateId
      );
      if (selectedInmate) {
        setFormData({
          ...selectedInmate,
          dateOfBirth: formatDate(selectedInmate?.dateOfBirth),
        });
      }
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "Female",
        contactNumber: "",
        status: "Active",
        sentenceDuration: "",
      });
    }
  }, [selectedInmateId, inmatesData]);

  const [errors, setErrors] = useState({
    contactNumber: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "contactNumber") {
      // Allow only digits and check the length
      if (!/^\d*$/.test(value)) {
        setErrors({
          ...errors,
          contactNumber: "Only numeric characters are allowed.",
        });
        return;
      } else if (value.length > 10) {
        setErrors({
          ...errors,
          contactNumber: "Contact number cannot exceed 10 digits.",
        });
        return;
      } else {
        setErrors({ ...errors, contactNumber: "" });
      }
    }

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Inmate</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="firstName" sx={{ mb: 1, fontWeight: "bold" }}>
                  First Name
                </FormLabel>
                <TextField
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="lastName" sx={{ mb: 1, fontWeight: "bold" }}>
                  Last Name
                </FormLabel>
                <TextField
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="dateOfBirth" sx={{ mb: 1, fontWeight: "bold" }}>
                  Date of Birth
                </FormLabel>
                <TextField
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="gender" sx={{ mb: 1, fontWeight: "bold" }}>
                  Gender
                </FormLabel>
                <TextField
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  InputProps={{
                    readOnly: true, // Make the field read-only
                  }}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="contactNumber" sx={{ mb: 1, fontWeight: "bold" }}>
                  Contact Number
                </FormLabel>
                <TextField
                  type="text" // Using text type for custom validation
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  variant="outlined"
                  error={Boolean(errors.contactNumber)}
                  helperText={errors.contactNumber}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="status" sx={{ mb: 1, fontWeight: "bold" }}>
                  Status
                </FormLabel>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  variant="outlined"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="sentenceDuration" sx={{ mb: 1, fontWeight: "bold" }}>
                  Sentence Duration (Years)
                </FormLabel>
                <TextField
                  type="number"
                  id="sentenceDuration"
                  name="sentenceDuration"
                  value={formData.sentenceDuration}
                  onChange={handleChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "right", pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateInmate;
