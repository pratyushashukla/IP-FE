import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  Box,
  MenuItem,
} from "@mui/material";

const CreateInmates = ({ open, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Female",
    contactNumber: "",
    status: "Active",
    sentenceDuration: "",
  });

  const [errors, setErrors] = useState({
    contactNumber: "",
    dateOfBirth: "",
    sentenceDuration: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Validation for Contact Number
    if (name === "contactNumber") {
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

    // Validation for Date of Birth
    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const today = new Date();

      if (selectedDate > today) {
        setErrors({
          ...errors,
          dateOfBirth: "Date of Birth cannot be in the future.",
        });
        return;
      } else {
        setErrors({ ...errors, dateOfBirth: "" });
      }
    }

    // Validation for Sentence Duration
    if (name === "sentenceDuration") {
      const newValue = value.trim();

      // Ensure only digits are entered and handle deletion of single digits
      if (!/^\d*$/.test(newValue)) {
        setErrors({
          ...errors,
          sentenceDuration: "Only numeric characters are allowed.",
        });
        return;
      }

      // Allow zero as a valid value but ensure the value is not empty and has no leading zeros unless the value is exactly '0'
      if (newValue.length > 4 || (newValue.length > 1 && newValue.startsWith('0'))) {
        setErrors({
          ...errors,
          sentenceDuration: "Sentence duration cannot exceed 4 digits and cannot have leading zeros.",
        });
        return;
      }

      if (newValue === "0") {
        setErrors({
          ...errors,
          sentenceDuration: "Sentence duration should be greater than zero.",
        });
        return;
      }

      setErrors({ ...errors, sentenceDuration: "" });

      setFormData({
        ...formData,
        [name]: newValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "date" ? new Date(value).toISOString() : value,
      });
    }
  };

  const handleSubmit = () => {
    // Check for required fields and other errors
    if (errors.dateOfBirth || !formData.dateOfBirth) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "Please provide a valid Date of Birth.",
      }));
      return;
    }

    if (errors.sentenceDuration || !formData.sentenceDuration) {
      setErrors((prev) => ({
        ...prev,
        sentenceDuration: "Please provide a valid Sentence Duration.",
      }));
      return;
    }

    // If no errors, submit form data
    onCreate(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Inmate</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="firstName"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  First Name
                </FormLabel>
                <TextField
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="lastName"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Last Name
                </FormLabel>
                <TextField
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="dateOfBirth"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Date of Birth
                </FormLabel>
                <TextField
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={
                    formData.dateOfBirth
                      ? formData.dateOfBirth.split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.dateOfBirth)}
                  helperText={errors.dateOfBirth}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="gender"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
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
                <FormLabel
                  htmlFor="contactNumber"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Contact Number
                </FormLabel>
                <TextField
                  type="text" // Using text type for custom validation
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
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
                <TextField
                  id="status"
                  name="status"
                  value={formData.status}
                  select
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="InActive">InActive</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="sentenceDuration"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Sentence Duration (Months)
                </FormLabel>
                <TextField
                  id="sentenceDuration"
                  name="sentenceDuration"
                  type="text"
                  value={formData.sentenceDuration}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={Boolean(errors.sentenceDuration)}
                  helperText={errors.sentenceDuration}
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
        <Button
          type="button"
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateInmates;

