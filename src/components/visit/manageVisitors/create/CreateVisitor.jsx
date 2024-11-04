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

  // Accessing inmatesData from the Redux store
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "contactNumber") {
      // Allow only digits and check the length
      if (!/^\d*$/.test(value) || value.length > 10) {
        setErrors({
          ...errors,
          contactNumber: "Contact number must be numeric and have exactly 10 digits.",
        });
        return;
      }
    }
  
    setVisitor({
      ...visitor,
      [name]: value,
    });
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
                  Last Name
                </FormLabel>
                <TextField
                  id="lastname"
                  name="lastname"
                  value={visitor.lastname}
                  onChange={handleInputChange}
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
                  id="contactNumber"
                  name="contactNumber"
                  value={visitor.contactNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateId" sx={{ mb: 1, fontWeight: "bold" }}>
                  Assign Inmate
                </FormLabel>
                <TextField
                  id="inmateId"
                  name="inmateId"
                  value={visitor.inmateId}
                  onChange={handleInputChange}
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
                  Relationship
                </FormLabel>
                <TextField
                  id="relationship"
                  name="relationship"
                  value={visitor.relationship}
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
          onClick={() => onCreate(visitor)}
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
