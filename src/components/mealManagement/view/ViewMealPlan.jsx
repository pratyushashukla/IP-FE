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
  Typography,
} from "@mui/material";
import { styled, tableCellClasses } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { GET_MEALPLAN, DELETE_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import { useDispatch, useSelector } from "react-redux";
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

const ViewMealPlan = () => {
  const dispatch = useDispatch();
  const mealPlansData = useSelector((state) => state.MealPlanReducer.mealPlansData || []);
  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openUpdateFormDialog, setOpenUpdateFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    dispatch(GET_MEALPLAN());
  }, [dispatch]);

  const handleOpenMenu = (event, mealPlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedMealPlan(mealPlan);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMealPlan(null);
  };

  const handlePreview = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenPreviewDialog(true);
  };

  const handleDownload = (mealPlan) => {
    setSelectedMealPlan(mealPlan);
    setOpenDownloadDialog(true);
  };

  const handleDetails = () => {
    setOpenDetailsDialog(true);
    handleCloseMenu();
  };

  const handleUpdate = () => {
    setOpenUpdateFormDialog(true);
    handleCloseMenu();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleCloseMenu();
  };

  const handleConfirmDelete = () => {
    dispatch(
      DELETE_MEALPLAN(selectedMealPlan.id, () => {
        setOpenDeleteDialog(false);
        handleCloseMenu();
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
              <StyledTableCell>Dietary Preferences</StyledTableCell>
              <StyledTableCell>Allergies</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
              <StyledTableCell align="center">Options</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mealPlansData.map((mealPlan) => (
              <StyledTableRow key={mealPlan.id}>
                <StyledTableCell>{mealPlan.inmateName}</StyledTableCell>
                <StyledTableCell>{mealPlan.mealPlan}</StyledTableCell>
                <StyledTableCell>{mealPlan.dietaryPreference}</StyledTableCell>
                <StyledTableCell>{mealPlan.allergies.join(", ")}</StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Options">
                    <IconButton onClick={(e) => handleOpenMenu(e, mealPlan)}>
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Tooltip title="Preview">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handlePreview(mealPlan)}
                      style={{ marginRight: 8 }}
                    >
                      Preview
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDownload(mealPlan)}
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
          <ListItem button onClick={handleUpdate}>
            <ListItemText primary="Update" />
          </ListItem>
          <ListItem button onClick={handleDelete}>
            <ListItemText primary="Delete" />
          </ListItem>
        </List>
      </Popover>

      {/* Preview Dialog */}
      <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview Meal Plan</DialogTitle>
        <DialogContent>
          {selectedMealPlan ? <PreviewMealPlan mealPlan={selectedMealPlan} /> : <Typography>No details available</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreviewDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Dialog */}
      <Dialog open={openDownloadDialog} onClose={() => setOpenDownloadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Download Meal Plan</DialogTitle>
        <DialogContent>
          {selectedMealPlan ? <DownloadMealPlan mealPlan={selectedMealPlan} /> : <Typography>No details available</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDownloadDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Meal Plan Details</DialogTitle>
        <DialogContent>
          {selectedMealPlan ? <Details mealPlan={selectedMealPlan} /> : <Typography>No details available</Typography>}
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
