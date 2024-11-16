import React, { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  styled,
  tableCellClasses,
  Collapse,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GET_INMATE_BY_ID } from "../../../actions/inmates/ActionCreators";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: "20px auto",
  maxWidth: "1200px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "150px", // Adjust this value as needed
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function InmateDetails({ open, onClose }) {

  const inmateData = useSelector((state) => state.InmatesReducer.inmateById);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 2,
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Inmate Details
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {/* Inmate Details Section */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
          >
            Inmate Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Name:
              </Typography>
              <Typography>{`${inmateData?.firstName || "N/A"} ${
                inmateData?.lastName || "N/A"
              }`}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Date of Birth:
              </Typography>
              <Typography>
                {inmateData?.dateOfBirth
                  ? new Date(inmateData?.dateOfBirth).toLocaleDateString()
                  : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Gender:
              </Typography>
              <Typography>{inmateData?.gender || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Contact Number:
              </Typography>
              <Typography>{inmateData?.contactNumber || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Status:
              </Typography>
              <Typography>{inmateData?.status || "N/A"}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                Sentence Duration:
              </Typography>
              <Typography>
                {inmateData?.sentenceDuration || "N/A"} months
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {inmateData?.mealPlan && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
            >
              Meal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Meal Type:
                </Typography>
                <Typography>
                  {inmateData?.mealPlan.mealType || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Meal Plan:
                </Typography>
                <Typography>
                  {inmateData?.mealPlan.mealPlan || "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                  Dietary Preferences:
                </Typography>
                <Typography>
                  {inmateData?.mealPlan.dietaryPreferences || "N/A"}
                </Typography>
              </Grid>
            </Grid>

            {/* Allergies Table */}
            {inmateData?.mealPlan.allergyId &&
              inmateData?.mealPlan.allergyId.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Allergies:
                  </Typography>
                  <StyledTableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Allergy</StyledTableCell>
                          <StyledTableCell>description</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inmateData?.mealPlan.allergyId.map(
                          (allergy, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell>
                                {allergy.allergyName || "N/A"}
                              </StyledTableCell>
                              <Tooltip title={allergy.description || "N/A"} arrow>
                                <StyledTableCell>
                                  {allergy.description || "N/A"}
                                </StyledTableCell>
                              </Tooltip>
                            </StyledTableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </Box>
              )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Appointments Table */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
          >
            Appointments
          </Typography>
          <AppointmentsTable appointments={inmateData?.appointments} />
          {/* <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Start Time</StyledTableCell>
                  <StyledTableCell>Estimated End Time</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Identity Verified</StyledTableCell>
                  <StyledTableCell>Flagged for Security</StyledTableCell>
                  <StyledTableCell>Remarks</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inmateData?.appointments?.map((appointment) => (
                  <StyledTableRow key={appointment._id}>
                    <StyledTableCell>
                      {new Date(appointment.startTime).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(appointment.estimatedEndTime).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell>{appointment.status}</StyledTableCell>
                    <StyledTableCell>
                      {appointment.identityVerified ? "Yes" : "No"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {appointment.flaggedForSecurity ? "Yes" : "No"}
                    </StyledTableCell>
                    <Tooltip title={appointment.remarks || "N/A"} arrow>
                      <StyledTableCell>
                        {appointment.remarks || "N/A"}
                      </StyledTableCell>
                    </Tooltip>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer> */}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Visitors Table */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
          >
            Visitors
          </Typography>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Contact Number</StyledTableCell>
                  <StyledTableCell>Address</StyledTableCell>
                  <StyledTableCell>Relationship</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inmateData?.visitors?.map((visitor) => (
                  <StyledTableRow key={visitor._id}>
                    <Tooltip
                      title={`${visitor.firstname} ${visitor.lastname}`}
                      arrow
                    >
                      <StyledTableCell>{`${visitor.firstname} ${visitor.lastname}`}</StyledTableCell>
                    </Tooltip>
                    <StyledTableCell>{visitor.contactNumber}</StyledTableCell>
                    <Tooltip title={visitor.address || "N/A"} arrow>
                      <StyledTableCell>
                        {visitor.address || "N/A"}
                      </StyledTableCell>
                    </Tooltip>
                    <StyledTableCell>{visitor.relationship}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Tasks Table */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1, color: "primary.main", fontWeight: 600 }}
          >
            Tasks Assigned
          </Typography>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Progress Notes</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inmateData?.tasksAssigned?.map((task) => (
                  <StyledTableRow key={task._id}>
                    <Tooltip title={task.taskId?.title} arrow>
                      <StyledTableCell>{task.taskId?.title}</StyledTableCell>
                    </Tooltip>
                    <Tooltip title={task.taskId?.description} arrow>
                      <StyledTableCell>
                        {task.taskId?.description}
                      </StyledTableCell>
                    </Tooltip>
                    <StyledTableCell>
                      {task.completionStatus ? "Completed" : "In Progress"}
                    </StyledTableCell>
                    <Tooltip title={task.progressNotes || "N/A"} arrow>
                      <StyledTableCell>
                        {task.progressNotes || "N/A"}
                      </StyledTableCell>
                    </Tooltip>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", p: 2 }}>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InmateDetails;

function AppointmentRow(props) {
  const { appointment } = props;
  const [open, setOpen] = React.useState(false);
  const visitor = appointment.visitorId;

  return (
    <React.Fragment>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell>{appointment.status}</StyledTableCell>
        <StyledTableCell>{new Date(appointment.startTime).toLocaleString()}</StyledTableCell>
        <StyledTableCell>{new Date(appointment.estimatedEndTime).toLocaleString()}</StyledTableCell>
        <StyledTableCell>{appointment.identityVerified ? "Yes" : "No"}</StyledTableCell>
        <StyledTableCell>{appointment.flaggedForSecurity ? "Yes" : "No"}</StyledTableCell>
      </StyledTableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Visitor Information
              </Typography>
              {visitor ? (
                <Table size="small" aria-label="visitor details">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>First Name</StyledTableCell>
                      <StyledTableCell>Last Name</StyledTableCell>
                      <StyledTableCell>Contact Number</StyledTableCell>
                      <StyledTableCell>Address</StyledTableCell>
                      <StyledTableCell>Relationship</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell>{visitor.firstname || "N/A"}</StyledTableCell>
                      <StyledTableCell>{visitor.lastname || "N/A"}</StyledTableCell>
                      <StyledTableCell>{visitor.contactNumber || "N/A"}</StyledTableCell>
                      <StyledTableCell>{visitor.address || "N/A"}</StyledTableCell>
                      <StyledTableCell>{visitor.relationship || "N/A"}</StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2">No visitor associated with this appointment.</Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
function AppointmentsTable({ appointments }) {
  return (
    <StyledTableContainer component={Paper}>
      <Table aria-label="appointments table">
        <TableHead>
          <TableRow>
            <TableCell />
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Start Time</StyledTableCell>
            <StyledTableCell>Estimated End Time</StyledTableCell>
            <StyledTableCell>Identity Verified</StyledTableCell>
            <StyledTableCell>Flagged for Security</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments?.map((appointment) => (
            <AppointmentRow key={appointment._id} appointment={appointment} />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
