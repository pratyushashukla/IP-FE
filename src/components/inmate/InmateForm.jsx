import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const InmateForm = ({ open, onClose, onSave, inmate }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    status: "",
    sentenceDuration: "",
  });

  useEffect(() => {
    if (inmate) {
      setFormData(inmate);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        status: "",
        sentenceDuration: "",
      });
    }
  }, [inmate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{inmate ? "Edit Inmate" : "Create Inmate"}</DialogTitle>
      <DialogContent>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Date of Birth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Gender"
          name="gender"
          value="Female"  // Set default and fixed value
          InputProps={{
            readOnly: true,  // Make the field read-only
          }}
          fullWidth
        />
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Sentence Duration"
          name="sentenceDuration"
          value={formData.sentenceDuration}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          {inmate ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InmateForm;
