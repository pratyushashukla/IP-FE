import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

const InmateDetail = ({ open, onClose, inmate, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
  };

  const handleDelete = () => {
    onDelete();
    setConfirmDelete(false); // Close confirmation dialog after delete
    onClose(); // Close inmate detail view
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Inmate Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">First Name: {inmate.firstName}</Typography>
          <Typography variant="h6">Last Name: {inmate.lastName}</Typography>
          <Typography variant="h6">Date of Birth: {inmate.dateOfBirth}</Typography>
          <Typography variant="h6">Gender: {inmate.gender}</Typography>
          <Typography variant="h6">Contact Number: {inmate.contactNumber}</Typography>
          <Typography variant="h6">Status: {inmate.status}</Typography>
          <Typography variant="h6">Sentence Duration: {inmate.sentenceDuration}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onEdit}>Edit</Button>
          <Button color="secondary" onClick={handleConfirmDelete}>Delete</Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this inmate?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="secondary" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InmateDetail;
