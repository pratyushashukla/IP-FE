// src/components/visitorManagement/create/CreateVisitor.jsx
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
  MenuItem,
  Box,
  Select,
} from "@mui/material";
import { useSelector } from "react-redux";

const CreateVisitor = ({ open, onClose, onCreate }) => {
  const [visitor, setVisitor] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    address: "",
    relationship: "",
    inmateId: "",
  });

  const [errors, setErrors] = useState({});

  // Accessing inmatesData from the Redux store
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "contactNumber") {
      // Allow only numeric input and prevent entering more than 10 digits
      if (/^\d*$/.test(value) && value.length <= 10) {
        setVisitor({
          ...visitor,
          [name]: value,
        });
  
        // Clear the error for contact number
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "",
        }));
      }
    } else {
      setVisitor({
        ...visitor,
        [name]: value,
      });
  
      // Clear errors for other fields
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };
  

  const validateFields = () => {
    const newErrors = {};
    if (!visitor.lastname.trim()) newErrors.lastname = "Last Name is required.";
    if (!visitor.contactNumber.trim()) {
      newErrors.contactNumber = "Contact Number is required.";
    } else if (!/^\d{10}$/.test(visitor.contactNumber)) {
      newErrors.contactNumber =
        "Contact Number must be numeric and exactly 10 digits.";
    }
    if (!visitor.inmateId.trim()) newErrors.inmateId = "Assigning an inmate is required.";
    if (!visitor.relationship.trim())
      newErrors.relationship = "Relationship is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onCreate(visitor);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Visitor</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="firstname" sx={{ mb: 1, fontWeight: "bold" }}>
                  First Name
                </FormLabel>
                <TextField
                  id="firstname"
                  name="firstname"
                  value={visitor.firstname}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="lastname" sx={{ mb: 1, fontWeight: "bold" }}>
                  Last Name<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  id="lastname"
                  name="lastname"
                  value={visitor.lastname}
                  onChange={handleInputChange}
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="contactNumber" sx={{ mb: 1, fontWeight: "bold" }}>
                  Contact Number<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  id="contactNumber"
                  name="contactNumber"
                  value={visitor.contactNumber}
                  onChange={handleInputChange}
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateId" sx={{ mb: 1, fontWeight: "bold" }}>
                  Assign Inmate<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <TextField
                  id="inmateId"
                  name="inmateId"
                  value={visitor.inmateId}
                  onChange={handleInputChange}
                  error={!!errors.inmateId}
                  helperText={errors.inmateId}
                  select
                  variant="outlined"
                  required
                >
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {`${inmate.firstName} ${inmate.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="address" sx={{ mb: 1, fontWeight: "bold" }}>
                  Address
                </FormLabel>
                <TextField
                  id="address"
                  name="address"
                  value={visitor.address}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="relationship" sx={{ mb: 1, fontWeight: "bold" }}>
                  Relationship<span style={{ color: "red" }}>*</span>
                </FormLabel>
                <Select
                  id="relationship"
                  name="relationship"
                  value={visitor.relationship}
                  onChange={handleInputChange}
                  error={!!errors.relationship}
                  helperText={errors.inmateId}
                  variant="outlined"
                >
                  <MenuItem value="">Select a relationship</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="friend">Friend</MenuItem>                  
                </Select>
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

export default CreateVisitor;
