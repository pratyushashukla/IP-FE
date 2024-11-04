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
import { styled, tableCellClasses } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ClearIcon from "@mui/icons-material/Clear"; // Import ClearIcon for the clear search button
import {
  DELETE_VISIT,
  GET_VISITS,
  SEARCH_VISITS,
} from "../../../../actions/visits/ActionCreators";

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

const ViewAppointments = ({ handleDetailsModal }) => {
  const dispatch = useDispatch();

  const visitsData = useSelector((state) => state.VisitsReducer.visitsData);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: "",
    inmateName: "",
    status: "",
  });

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
    dispatch(SEARCH_VISITS(searchParams));
  };

  // Clear all search fields and reload all visitors
  const handleClearSearch = () => {
    setSearchParams({ name: "", inmateName: "", status: "" });
    dispatch(GET_VISITS());
  };

  // Disable search fields based on active field
  const isAnyFieldActive = !!(
    searchParams.name ||
    searchParams.inmateName ||
    searchParams.contactNumber
  );

  const handleOpenMenu = (event, visit) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(visit?._id);
    setSelectedRow(visit);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedId(null);
    setSelectedRow(null);
  };

  const handleDetails = () => {
    handleCloseMenu();
    handleDetailsModal(selectedRow);
  };

  const handleDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    dispatch(DELETE_VISIT(selectedId, handleCloseMenu));
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <Box mt={4}>
      {/* Search Bar with Clear Functionality */}
      <Box display="flex" gap={2} mb={2} alignItems="center">
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
          label="Status"
          variant="outlined"
          name="status"
          value={searchParams.status}
          onChange={handleSearchChange}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <Tooltip title="Clear Search">
          <IconButton
            color="secondary"
            onClick={handleClearSearch}
            disabled={isAnyFieldActive ? false : true}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Visitor Name</StyledTableCell>
              <StyledTableCell>Inmate Name</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitsData.map((visit) => (
              <StyledTableRow key={visit._id}>
                <StyledTableCell>
                  {`${visit.visitorId?.firstname || "N/A"} ${
                    visit.visitorId?.lastname || "N/A"
                  }`}
                </StyledTableCell>
                <StyledTableCell>
                  {`${visit.inmateId?.firstName || "N/A"} ${
                    visit.inmateId?.lastName || "N/A"
                  }`}
                </StyledTableCell>
                <StyledTableCell>
                  {new Date(visit.startTime).toLocaleString()}
                </StyledTableCell>
                <StyledTableCell>{visit.status}</StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Options">
                    <IconButton onClick={(e) => handleOpenMenu(e, visit)}>
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
          <ListItem button onClick={handleDetails}>
            <ListItemText primary="Details" />
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
            Are you sure you want to delete this appointment?
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

export default ViewAppointments;
