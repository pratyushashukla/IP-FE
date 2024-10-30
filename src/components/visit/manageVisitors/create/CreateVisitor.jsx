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
} from "@mui/material";
import { useSelector } from "react-redux";

const CreateVisitor = ({ open, onClose, onCreate }) => {
  const [visitor, setVisitor] = useState({
    firstname: "",
    lastname: "",
    contactNumber: "",
    address: "",
    inmateId: "",
    relationship: "",
  });

  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVisitor({ ...visitor, [name]: value });
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
                  required
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
                />
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
                <FormLabel htmlFor="inmateId" sx={{ mb: 1, fontWeight: "bold" }}>
                  Assign to Inmate
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
                    <option key={inmate._id} value={inmate._id}>
                      {`${inmate.first_name} ${inmate.last_name}`}
                    </option>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="relationship" sx={{ mb: 1, fontWeight: "bold" }}>
                  Relationship with Inmate
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

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button
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
