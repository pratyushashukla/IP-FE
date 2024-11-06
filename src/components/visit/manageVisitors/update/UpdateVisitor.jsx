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
  const visitorsData = useSelector(
    (state) => state.VisitorsReducer.visitorsData
  );
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData); // Assuming inmates are stored here
  const [visitor, setVisitor] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    address: "",
    relationship: "",
    inmateId: "", // Added inmateId here
  });

  const [errors, setErrors] = useState({
    relationship: "",
    contactNumber: "",
  });

  useEffect(() => {
    if (selectedVisitorId) {
      const selectedVisitor = visitorsData.find(
        (visitor) => visitor._id === selectedVisitorId
      );
      if (selectedVisitor) {
        const inmate = inmatesData.find(
          (inmate) => inmate._id === selectedVisitor.inmateId._id
        );
        if (inmate) {
          setVisitor({
            ...selectedVisitor,
            inmateId: `${inmate.firstName} ${inmate.lastName}`,
            firstname: selectedVisitor.firstname,
            lastname: selectedVisitor.lastname,
          });
        }
      }
    }
  }, [selectedVisitorId, visitorsData, inmatesData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "relationship") {
      if (value === "") {
        setErrors({
          ...errors,
          relationship: "Please select a relationship",
        });
      } else {
        setErrors({
          ...errors,
          relationship: "",
        });
      }
    }

    if (name === "contactNumber") {
      if (value.length === 10 && /^\d+$/.test(value)) {
        setErrors({
          ...errors,
          contactNumber: "",
        });
      } else {
        setErrors({
          ...errors,
          contactNumber: "Contact number must be 10 digits",
        });
      }
    }

    setVisitor({
      ...visitor,
      [name]: value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Visitor</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Inmate Name</FormLabel>
                <TextField
                  name="inmateId"
                  value={visitor.inmateId}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Relationship</FormLabel>
                <Select
                  name="relationship"
                  value={visitor.relationship}
                  onChange={handleInputChange}
                  variant="outlined"
                  error={errors.relationship !== ""}
                >
                  <MenuItem value="">Select a relationship</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                  <MenuItem value="friend">Friend</MenuItem>
                  {/* Add more relationships as needed */}
                </Select>
                {errors.relationship !== "" && (
                  <div style={{ color: "red" }}>{errors.relationship}</div>
                )}
              </FormControl>
            </Grid>

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
                  error={errors.contactNumber !== ""}
                />
                {errors.contactNumber !== "" && (
                  <div style={{ color: "red" }}>{errors.contactNumber}</div>
                )}
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
          disabled={
            !visitor.firstname ||
            !visitor.lastname ||
            !visitor.contactNumber ||
            !visitor.address ||
            !visitor.relationship ||
            !visitor.inmateId ||
            errors.relationship !== "" ||
            errors.contactNumber !== ""
          }
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateVisitor;
