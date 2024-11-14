import React, { useState } from 'react';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { DOWNLOAD_REPORT } from '../../../actions/reports/ActionCreators';

const DownloadReport = ({ inmateId, reportType }) => {
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(true);

  const handleDownload = () => {
    dispatch(DOWNLOAD_REPORT(inmateId, reportType)).catch((error) => {
      setError("Error downloading the report.");
    });
    setConfirmDialogOpen(false);
  };

  const handleConfirmClose = () => setConfirmDialogOpen(false);

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}

      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <Typography>Do you want to download this report as a PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDownload} color="primary" variant="contained">
            Yes, Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadReport;
