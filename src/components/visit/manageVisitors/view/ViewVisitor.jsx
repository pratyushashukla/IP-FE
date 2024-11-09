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
  TextField,
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GET_VISITORS, DELETE_VISITOR, SEARCH_VISITORS } from "../../../../actions/visitors/ActionCreators";
import { styled, tableCellClasses } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear"; // Import ClearIcon for the clear search button

// Styled components for custom styling
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

const ViewVisitor = ({ handleUpdateModal }) => {
  const dispatch = useDispatch();
  const visitorsData = useSelector((state) => state.VisitorsReducer.visitorsData);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    inmateName: "",
    contactNumber: "",
  });

  useEffect(() => {
    dispatch(GET_VISITORS());
  }, [dispatch]);

  // Update searchParams state and disable other fields when one field is active
  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value,
    }));
  };

  // Trigger search with current searchParams
  const handleSearch = () => {
    dispatch(SEARCH_VISITORS(searchParams));
  };

  // Clear all search fields and reload all visitors
  const handleClearSearch = () => {
    setSearchParams({ name: "", inmateName: "", contactNumber: "" });
    dispatch(GET_VISITORS());
  };

  // Disable search fields based on active field
  const isAnyFieldActive = !!(searchParams.name || searchParams.inmateName || searchParams.contactNumber);

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
      {/* Search Bar with Clear Functionality */}
      <Box display="flex" gap={2} mb={2} alignItems="center" justifyContent={"center"}>
        <TextField
          label="Visitor Name"
          variant="outlined"
          name="name"
          value={searchParams.name}
          onChange={handleSearchChange}
          // disabled={isAnyFieldActive && !searchParams.name}
        />
        <TextField
          label="Inmate Name"
          variant="outlined"
          name="inmateName"
          value={searchParams.inmateName}
          onChange={handleSearchChange}
          // disabled={isAnyFieldActive && !searchParams.inmateName}
        />
        <TextField
          label="Contact Number"
          variant="outlined"
          name="contactNumber"
          value={searchParams.contactNumber}
          onChange={handleSearchChange}
          // disabled={isAnyFieldActive && !searchParams.contactNumber}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <Tooltip title="Clear Search">
          <IconButton color="secondary" onClick={handleClearSearch} disabled={isAnyFieldActive ? false : true}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Firstname</StyledTableCell>
              <StyledTableCell>Lastname</StyledTableCell>
              <StyledTableCell>Inmate Firstname</StyledTableCell>
              <StyledTableCell>Inmate Lastname</StyledTableCell>
              <StyledTableCell>Contact</StyledTableCell>
              <StyledTableCell>Address</StyledTableCell>
              <StyledTableCell>Relationship</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorsData.map((visitor) => (
              <StyledTableRow key={visitor._id}>
                <StyledTableCell>{visitor.firstname}</StyledTableCell>
                <StyledTableCell>{visitor.lastname}</StyledTableCell>
                <StyledTableCell>{visitor.inmateId?.firstName || "N/A"}</StyledTableCell>
                <StyledTableCell>{visitor.inmateId?.lastName || "N/A"}</StyledTableCell>
                <StyledTableCell>{visitor.contactNumber}</StyledTableCell>
                <StyledTableCell>{visitor.address}</StyledTableCell>
                <StyledTableCell>{visitor.relationship}</StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Options">
                    <IconButton onClick={(e) => handleOpenMenu(e, visitor._id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

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
