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
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  styled,
  Box,
  tableCellClasses,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_INMATE,
  GET_INMATES,
} from "../../../actions/inmates/ActionCreators";
import { formatDate } from "../../common/CommonFunctions";
import ReportDialog from "../../report/ReportDialog";

// Function to manipulate inmate data
const manipulateInmatesData = (inmates) => {
  return inmates.map((inmate) => {
    // Calculate age from date of birth
    const age = formatDate(inmate.dateOfBirth);

    // Format contact number (example formatting)
    const formattedContact = inmate.contactNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "($1) $2-$3"
    );

    // Add isActive boolean based on status
    const isActive = inmate.status.toLowerCase() === "active";

    return {
      ...inmate,
      age, // Add calculated age
      formattedContact, // Add formatted contact number
      isActive, // Boolean based on the "status" field
    };
  });
};

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "Active"
      ? theme.palette.success.main
      : theme.palette.warning.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

const ViewInmates = ({ handleUpdateModal, handleDetailsModal }) => {
  const dispatch = useDispatch();
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [inmates, setInmates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInmateId, setSelectedInmateId] = useState(null);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportInmateId, setReportInmateId] = useState(null);

   // State for popup messages
   const [popupMessage, setPopupMessage] = useState("");
   const [isPopupOpen, setIsPopupOpen] = useState(false);
 


  // Fetch inmates data from API when the component mounts
  useEffect(() => {
    dispatch(GET_INMATES());
  }, []);

  // Update inmates state after fetching data and apply manipulation
  useEffect(() => {
    if (inmatesData) {
      setInmates(manipulateInmatesData(inmatesData));
    }
  }, [inmatesData]);

  const handleOpenMenu = (event, inmateId) => {
    setAnchorEl(event.currentTarget);
    setSelectedInmateId(inmateId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedInmateId(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    handleUpdateModal(selectedInmateId);
  };

  const handleDetails = () => {
    handleCloseMenu();
    handleDetailsModal(selectedInmateId);
  };

  const handleDelete = async () => {
    handleCloseMenu();
  
    // Dispatch delete action and catch response
    try {
      const response = await dispatch(DELETE_INMATE(selectedInmateId));
  
      // Check for a successful response (status 200)
      if (response && response.status === 200) {
        // Handle success message (if applicable)
        setPopupMessage("Inmate deleted successfully.");
        setIsPopupOpen(true);
  
        // Update the table with the new data (i.e., remove the deleted inmate from the list)
        const updatedInmates = inmates.filter(
          (inmate) => inmate._id !== selectedInmateId
        );
        setInmates(updatedInmates);
      } else {
        // If response is not 200, display the message from the backend
        setPopupMessage(response?.message);
        setIsPopupOpen(true);
      }
    } catch (error) {
      // Handle any errors (e.g., network issues, server errors)
      setPopupMessage("An error occurred while deleting the inmate.");
      setIsPopupOpen(true);
    }
  };
  // Function to handle closing the popup after clicking "OK"
  const handleClosePopup = () => {
    setIsPopupOpen(false);  // Close the popup
  };
  

  const handleOpenReportDialog = (inmateId) => {
    setReportInmateId(inmateId);
    setReportModalOpen(true);
  };

  const handleCloseReportDialog = () => {
    setReportModalOpen(false);
    setReportInmateId(null);
  };

  return (
    <Box mt={4}>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Last Name</StyledTableCell>
              <StyledTableCell>Date of Birth</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Contact Number</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Sentence Duration (Months)</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ height: inmates.length > 0 ? "auto" : "300px" }}>
            {/* Adjust height as needed */}
            {inmates.length > 0 ? (
              inmates.map((inmate) => (
                <StyledTableRow key={inmate._id} hover>
                  <StyledTableCell>{inmate.firstName}</StyledTableCell>
                  <StyledTableCell>{inmate.lastName}</StyledTableCell>
                  <StyledTableCell>
                    {new Date(inmate.dateOfBirth).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell>{inmate.gender}</StyledTableCell>
                  <StyledTableCell>{inmate.contactNumber}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip
                      status={
                        inmate.status === "Active" ? "Active" : "InActive"
                      }
                      label={inmate.status}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{inmate.sentenceDuration}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Options">
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, inmate._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align="center">
                  No inmates found
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List sx={{ cursor: "pointer" }}>
            <ListItem button onClick={handleDetails}>
              <ListItemText primary="Details" />
            </ListItem>
            <ListItem button onClick={handleEdit}>
              <ListItemText primary="Update" />
            </ListItem>
            <ListItem button onClick={handleDelete}>
              <ListItemText primary="Delete" />
            </ListItem>
            <ListItem button onClick={() => handleOpenReportDialog(selectedInmateId)}>
              <ListItemText primary="Report" />
            </ListItem>
          </List>
        </Popover>
      </StyledTableContainer>

       {/* Report Dialog */}
       {reportModalOpen && (
        <ReportDialog
          inmateId={reportInmateId}
          open={reportModalOpen}
          onClose={handleCloseReportDialog}
        />
      )}

    </Box>
  );
};

export default ViewInmates;
