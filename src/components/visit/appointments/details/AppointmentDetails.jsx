import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  Divider,
  Button,
  DialogActions,
  Box,
} from '@mui/material';

function AppointmentDetailsDialog({ open, onClose, visit }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 2, textAlign: 'center' }}>
        Appointment Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {/* Appointment Details Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
            Appointment Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Start Time:</Typography>
              <Typography>{visit.startTime ? new Date(visit.startTime).toLocaleString() : "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Estimated End Time:</Typography>
              <Typography>{visit.estimatedEndTime ? new Date(visit.estimatedEndTime).toLocaleString() : "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Status:</Typography>
              <Typography>{visit.status || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Identity Verified:</Typography>
              <Typography>{visit.identityVerified !== undefined ? (visit.identityVerified ? "Yes" : "No") : "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Flagged for Security:</Typography>
              <Typography>{visit.flaggedForSecurity !== undefined ? (visit.flaggedForSecurity ? "Yes" : "No") : "N/A"}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Remarks:</Typography>
              <Typography>{visit.remarks || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Visitor Details Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
            Visitor Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Name:</Typography>
              <Typography>{visit.visitorId ? `${visit.visitorId.firstname || "N/A"} ${visit.visitorId.lastname || "N/A"}` : "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Contact Number:</Typography>
              <Typography>{visit.visitorId?.contactNumber || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Address:</Typography>
              <Typography>{visit.visitorId?.address || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Relationship:</Typography>
              <Typography>{visit.visitorId?.relationship || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Staff Details Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600 }}>
            Staff Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Name:</Typography>
              <Typography>{visit.staffId ? `${visit.staffId.firstname || "N/A"} ${visit.staffId.lastname || "N/A"}` : "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Email:</Typography>
              <Typography>{visit.staffId?.email || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>Phone:</Typography>
              <Typography>{visit.staffId?.phone || "N/A"}</Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', p: 2 }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AppointmentDetailsDialog;
