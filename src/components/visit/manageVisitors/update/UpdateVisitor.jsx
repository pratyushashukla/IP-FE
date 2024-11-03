import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import { useSelector } from "react-redux";

const UpdateVisitor = ({ open, onClose, onUpdate, selectedVisitorId }) => {
  const visitorsData = useSelector((state) => state.VisitorsReducer.visitorsData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData); // Assuming inmates are stored here
  const [visitor, setVisitor] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    address: "",
    relationship: "",
    inmateId: "", // Added inmateId here
  });

  useEffect(() => {
    if (selectedVisitorId) {
      const selectedVisitor = visitorsData.find(
        (visitor) => visitor._id === selectedVisitorId
      );
      if (selectedVisitor) setVisitor(selectedVisitor);
    }
  }, [selectedVisitorId, visitorsData]);

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

  const handleInmateChange = (e) => {
    setVisitor({ ...visitor, inmateId: e.target.value });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Visitor</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>First Name</FormLabel>
                <TextField
                  name="firstname"
                  value={visitor.firstname}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Last Name</FormLabel>
                <TextField
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
                <FormLabel sx={{ mb: 1 }}>Contact Number</FormLabel>
                <TextField
                  name="contactNumber"
                  value={visitor.contactNumber}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Address</FormLabel>
                <TextField
                  name="address"
                  value={visitor.address}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Relationship</FormLabel>
                <TextField
                  name="relationship"
                  value={visitor.relationship}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* Dropdown for Inmate Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Assign Inmate</FormLabel>
                <Select
                  value={visitor.inmateId || ""}
                  onChange={handleInmateChange}
                  displayEmpty
                  variant="outlined"
                >
                  <MenuItem value="" disabled>
                    Select an Inmate
                  </MenuItem>
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {inmate.firstName} {inmate.lastName}
                    </MenuItem>
                  ))}
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
          onClick={() => onUpdate(visitor)}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateVisitor;
