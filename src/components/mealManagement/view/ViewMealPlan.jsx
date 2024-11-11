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
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled, tableCellClasses } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { GET_MEALPLAN, DELETE_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import { GET_ALLERGIES } from "../../../actions/allergies/ActionCreators";
// Import the components for Update, Details, Preview, and Download
import UpdateMealPlan from "../update/UpdateMealPlan";
import Details from "../view/Details";
import PreviewMealPlan from "../download/PreviewMealPlan";
import DownloadMealPlan from "../download/DownloadMealPlan";

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

const ViewMealPlan = () => {
  const dispatch = useDispatch();
  const mealPlansData = useSelector((state) => state.MealPlanReducer.mealPlanData || []);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    dispatch(GET_MEALPLAN());
    dispatch(GET_ALLERGIES()); // Fetch allergies data when the component mounts
  }, [dispatch]);

  // Helper function to get allergy name by ID
  const getAllergyNameById = (allergyId) => {
    if (!allergyId) return "No allergy";

    if (!Array.isArray(allergiesData)) {
      console.error("allergiesData is not an array:", allergiesData);
      return "Unknown Allergy"; // Return a fallback value
    }

    const allergy = allergiesData.find((allergy) => allergy._id === allergyId);
    return allergy ? allergy.name : "Unknown Allergy";
  };

  const handleOpenMenu = (event, mealPlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedMealPlan(mealPlan);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMealPlan(null);
  };

  const handlePreview = () => {
    setShowPreview(true);
    handleCloseMenu();
  };

  const handleDownload = () => {
    setShowDownload(true);
    handleCloseMenu();
  };

  const handleUpdate = () => {
    setShowUpdateDialog(true);
    handleCloseMenu();
  };

  const handleDetails = () => {
    setShowDetailsDialog(true);
    handleCloseMenu();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = () => {
    if (!selectedMealPlan || !selectedMealPlan._id) {
      console.error("Selected meal plan is not valid or has no ID.");
      return;
    }

    dispatch(
      DELETE_MEALPLAN(selectedMealPlan._id, () => {
        setOpenDeleteDialog(false);
        setSelectedMealPlan(null);
      })
    );
  };

  return (
    <Box mt={4}>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Inmate Name</StyledTableCell>
              <StyledTableCell>Meal Plan</StyledTableCell>
              <StyledTableCell>Meal Type</StyledTableCell>
              <StyledTableCell>Dietary Preferences</StyledTableCell>
              <StyledTableCell>Allergy</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
              <StyledTableCell align="center">Options</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlansData.map((mealPlan) => (
              <StyledTableRow key={mealPlan._id}>
                <StyledTableCell>
                  {mealPlan.inmateId?.firstName || mealPlan.inmateId?.lastName
                    ? `${mealPlan.inmateId.firstName || ""} ${mealPlan.inmateId.lastName || ""}`.trim()
                    : "N/A"}
                </StyledTableCell>
                <StyledTableCell>{mealPlan.mealPlan}</StyledTableCell>
                <StyledTableCell>{mealPlan.mealType}</StyledTableCell>
                <StyledTableCell>{mealPlan.dietaryPreferences}</StyledTableCell>
                <StyledTableCell>
                  {getAllergyNameById(mealPlan.allergyId)}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Options">
                    <IconButton
                      onClick={(e) => handleOpenMenu(e, mealPlan)}
                      sx={{ cursor: "pointer" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Preview">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedMealPlan(mealPlan);
                        handlePreview();
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Preview
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setSelectedMealPlan(mealPlan);
                        handleDownload();
                      }}
                    >
                      Download
                    </Button>
                  </Tooltip>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Options Popover Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <List>
          <ListItem button onClick={handleDetails} sx={{ cursor: "pointer" }}>
            <ListItemText primary="Details" />
          </ListItem>
          <ListItem button onClick={handleUpdate} sx={{ cursor: "pointer" }}>
            <ListItemText primary="Update" />
          </ListItem>
          <ListItem button onClick={handleDelete} sx={{ cursor: "pointer" }}>
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>

            {/* Conditional Rendering for Preview and Download */}
            {selectedMealPlan && showPreview && (
        <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
          <PreviewMealPlan selectedMealPlanId={selectedMealPlan._id} />
          <DialogActions>
            <Button onClick={() => setShowPreview(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {selectedMealPlan && showDownload && (
        <Dialog open={showDownload} onClose={() => setShowDownload(false)} maxWidth="md" fullWidth>
          <DownloadMealPlan selectedMealPlanId={selectedMealPlan._id} />
          <DialogActions>
            <Button onClick={() => setShowDownload(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Details Dialog */}
      {showDetailsDialog && (
        <Dialog open={showDetailsDialog} onClose={() => setShowDetailsDialog(false)} maxWidth="md" fullWidth>
          <Details selectedMealPlanId={selectedMealPlan ? selectedMealPlan._id : null} />
          <DialogActions>
            <Button onClick={() => setShowDetailsDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Update Dialog */}
      {showUpdateDialog && (
        <Dialog open={showUpdateDialog} onClose={() => setShowUpdateDialog(false)} maxWidth="sm" fullWidth>
          <UpdateMealPlan
            open={showUpdateDialog}
            onClose={() => setShowUpdateDialog(false)}
            onUpdate={() => dispatch(GET_MEALPLAN())}
            selectedMealPlanId={selectedMealPlan ? selectedMealPlan._id : null}
          />
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this meal plan?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
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

export default ViewMealPlan;
