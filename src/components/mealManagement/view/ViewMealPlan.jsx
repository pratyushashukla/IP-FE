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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Menu,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { styled, tableCellClasses } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PreviewMealPlan from "../download/PreviewMealPlan";
import DownloadMealPlan from "../download/DownloadMealPlan";
import Details from "./Details";
import UpdateForm from "../update/UpdateMealPlan";

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

const ViewMealPlan = ({
  handleDetailPage = (id) => alert(`Navigate to details page for meal plan ID: ${id}`),
  handleUpdatePage = (id) => alert(`Navigate to update form for meal plan ID: ${id}`),
}) => {
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openUpdateFormDialog, setOpenUpdateFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Using dummy data for now
    const dummyData = [
      {
        id: 1,
        inmateName: "John Doe",
        mealType: "Lunch",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        dietaryPreference: "Low-carb",
        allergies: ["Peanuts", "Dairy"],
      },
      {
        id: 2,
        inmateName: "Jane Smith",
        mealType: "Dinner",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        dietaryPreference: "Vegetarian",
        allergies: ["Gluten"],
      },
    ];
    setMealPlans(dummyData);
  }, []);

  const handlePreview = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenPreviewDialog(true);
  };

  const handleDownload = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenDownloadDialog(true);
  };

  const handleDetails = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenDetailsDialog(true);
  };

  const handleUpdate = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenUpdateFormDialog(true);
  };

  const handleDelete = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDownload = () => {
    setOpenDownloadDialog(false);
    alert(`Downloading meal plan: ${selectedMealPlan.inmateName}`);
  };

  const handleConfirmDelete = () => {
    alert(`Deleted meal plan: ${selectedMealPlan.inmateName}`);
    setOpenDeleteDialog(false);
  };

  const handleMenuOpen = (event, mealPlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedMealPlan(mealPlan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMealPlan(null);
  };

  return (
    <Box mt={4}>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Inmate Name</StyledTableCell>
              <StyledTableCell>Meal Type</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Dietary Preferences</StyledTableCell>
              <StyledTableCell>Allergies</StyledTableCell>
              <StyledTableCell align="center">Options</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlans.length > 0 ? (
              mealPlans.map((mealPlan) => (
                <StyledTableRow key={mealPlan.id}>
                  <StyledTableCell>{mealPlan.inmateName}</StyledTableCell>
                  <StyledTableCell>{mealPlan.mealType}</StyledTableCell>
                  <StyledTableCell>{mealPlan.startDate}</StyledTableCell>
                  <StyledTableCell>{mealPlan.endDate}</StyledTableCell>
                  <StyledTableCell>{mealPlan.dietaryPreference}</StyledTableCell>
                  <StyledTableCell>{mealPlan.allergies.join(", ")}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Actions">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, mealPlan)}
                        style={{ cursor: "pointer" }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={() => handleDetails(selectedMealPlan)}>Details</MenuItem>
                      <MenuItem onClick={() => handleUpdate(selectedMealPlan)}>Update</MenuItem>
                      <MenuItem onClick={() => handleDelete(selectedMealPlan)}>Delete</MenuItem>
                    </Menu>
                    <Tooltip title="Preview">
                    <PreviewMealPlan
                    open={openPreviewDialog}
                    onClose={() => setOpenPreviewDialog(false)}
                            mealPlan={selectedMealPlan || { dummyData: "Dummy preview content" }}
                            />
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton onClick={() => handleDownload(mealPlan)} style={{ cursor: "pointer" }}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No meal plans available
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Download Confirmation Dialog */}
      <Dialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to download this meal plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDownloadDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDownload} color="primary" autoFocus>
          <DownloadMealPlan
                    open={openPreviewDialog}
                    onClose={() => setOpenDownloadDialog(false)}
                            mealPlan={selectedMealPlan || { dummyData: "Dummy Download content" }}
                            />
            </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Meal Plan Details</DialogTitle>
        <DialogContent>
          {selectedMealPlan ? (
            <Details mealPlan={selectedMealPlan} />
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Form Dialog */}
      <UpdateForm
        open={openUpdateFormDialog}
        onClose={() => setOpenUpdateFormDialog(false)}
        selectedMealPlanId={selectedMealPlan ? selectedMealPlan.id : null}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this meal plan?
          </DialogContentText>
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
