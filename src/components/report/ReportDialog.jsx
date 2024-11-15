import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import ReportHistory from "../report/view/ReportHistory";
import PreviewReport from "../report/download/PreviewReport";
import DownloadReport from "../report/download/DownloadReport";
import { useDispatch } from 'react-redux';
import { EMAIL_REPORT } from '../../actions/reports/ActionCreators';

const ReportDialog = ({ open, onClose, inmateId }) => {
  const dispatch = useDispatch();
  const [reportType, setReportType] = useState("complete");
  const [action, setAction] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ reportType: false, action: false });

  // Handle change for report type dropdown
  const handleReportTypeChange = (event) => {
    setReportType(event.target.value);
    setError((prev) => ({ ...prev, reportType: false }));
  };

  // Handle change for action dropdown
  const handleActionChange = (event) => {
    setAction(event.target.value);
    setError((prev) => ({ ...prev, action: false }));
  };

  // Execute selected action
  const executeAction = () => {
    let hasError = false;

    // Check if fields are selected
    if (!reportType) {
      setError((prev) => ({ ...prev, reportType: true }));
      hasError = true;
    }
    if (!action) {
      setError((prev) => ({ ...prev, action: true }));
      hasError = true;
    }

    if (hasError) return;

    // Perform the selected action
    switch (action) {
      case "Preview":
        setShowPreview(true);
        break;
      case "Download":
        setShowDownload(true);
        break;
      case "Email":
        setShowEmailDialog(true);
        break;
      case "Report History":
        setShowHistory(true);
        break;
      default:
        break;
    }
  };

  // Send email action
  const handleSendEmail = () => {
    dispatch(EMAIL_REPORT(inmateId, reportType, email));
    setShowEmailDialog(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Report for Inmate</DialogTitle>
        <DialogContent>
          {/* Report Type Selection */}
          <Box mb={2}>
            <Typography variant="subtitle1">Report Type</Typography>
            <Select
              fullWidth
              value={reportType}
              onChange={handleReportTypeChange}
              error={error.reportType}
            >
              <MenuItem value="complete">All</MenuItem>
              <MenuItem value="tasks">Tasks</MenuItem>
              <MenuItem value="meal">Meal</MenuItem>
              <MenuItem value="visitor">Visitor</MenuItem>
            </Select>
            {error.reportType && (
              <Typography color="error">Please select a report type.</Typography>
            )}
          </Box>

          {/* Actions Dropdown */}
          <Box mb={2}>
            <Typography variant="subtitle1">Action</Typography>
            <Select
              fullWidth
              value={action}
              onChange={handleActionChange}
              error={error.action}
            >
              <MenuItem value="Preview">Preview</MenuItem>
              <MenuItem value="Download">Download</MenuItem>
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Report History">Report History</MenuItem>
            </Select>
            {error.action && (
              <Typography color="error">Please select an action.</Typography>
            )}
          </Box>
        </DialogContent>

        {/* Execute Action Button */}
        <DialogActions>
          <Button onClick={executeAction} color="primary" variant="contained">
            Execute
          </Button>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Report Dialog */}
      {showPreview && (
        <PreviewReport
          open={showPreview}
          onClose={() => setShowPreview(false)}
          inmateId={inmateId}
          reportType={reportType}
        />
      )}

      {/* Download Report Dialog */}
      {showDownload && (
        <DownloadReport
          open={showDownload}
          onClose={() => setShowDownload(false)}
          inmateId={inmateId}
          reportType={reportType}
        />
      )}

      {/* Report History Dialog */}
      {showHistory && (
        <ReportHistory
          open={showHistory}
          onClose={() => setShowHistory(false)}
          inmateId={inmateId}
        />
      )}

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onClose={() => setShowEmailDialog(false)}>
        <DialogTitle>Send Report via Email</DialogTitle>
        <DialogContent>
          <TextField
            label="Recipient Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEmailDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSendEmail} color="primary" variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportDialog;
