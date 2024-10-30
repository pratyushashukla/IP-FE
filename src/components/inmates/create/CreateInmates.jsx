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
  });

  const handleInputChange = (e) => {
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

    setFormData({
      ...formData,
      [name]: type === "date" ? new Date(value).toISOString() : value,
    });
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
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="sentenceDuration"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Sentence Duration (Years)
                </FormLabel>
                <TextField
                  id="sentenceDuration"
                  name="sentenceDuration"
                  type="number"
                  value={formData.sentenceDuration}
                  onChange={handleInputChange}
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
        <Button
          type="button"
          onClick={() => onCreate(formData)}
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
