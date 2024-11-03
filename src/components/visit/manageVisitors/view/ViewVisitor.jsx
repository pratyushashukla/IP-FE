import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { GET_VISITORS, DELETE_VISITOR } from "../../../../actions/visitors/ActionCreators";

const ViewVisitor = ({ handleUpdateModal }) => {
  const dispatch = useDispatch();
  const visitorsData = useSelector((state) => state.VisitorsReducer.visitorsData); // Default to an empty array
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(GET_VISITORS());
  }, [dispatch]);

  if (!Array.isArray(visitorsData)) {
    return <div>Loading visitors...</div>; // Optionally render a loading state
  }

  const handleOpenMenu = (event, visitorId) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitorId(visitorId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedVisitorId(null);
  };

  const handleUpdate = () => {
    handleCloseMenu();
    handleUpdateModal(selectedVisitorId);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(DELETE_VISITOR(selectedVisitorId, handleCloseMenu));
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <Box mt={4}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Inmate First Name</TableCell>
              <TableCell>Inmate Last Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorsData.map((visitor) => (
              <TableRow key={visitor._id}>
                <TableCell>{visitor.firstname}</TableCell>
                <TableCell>{visitor.lastname}</TableCell>
                <TableCell>{visitor.inmateId?.firstName || "N/A"}</TableCell>
                <TableCell>{visitor.inmateId?.lastName || "N/A"}</TableCell>
                <TableCell>{visitor.contactNumber}</TableCell>
                <TableCell>{visitor.address}</TableCell>
                <TableCell>{visitor.relationship}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Options">
                    <IconButton onClick={(e) => handleOpenMenu(e, visitor._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <List>
          <ListItem button onClick={handleUpdate}>
            <ListItemText primary="Update" />
          </ListItem>
          <ListItem button onClick={handleDelete}>
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this visitor?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewVisitor;