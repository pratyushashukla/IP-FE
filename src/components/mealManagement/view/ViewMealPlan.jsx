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
  Chip,
  TextField,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Box,
  InputAdornment,
  Select,
  Snackbar, 
  Alert,
  MenuItem as MuiMenuItem
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ClearIcon from "@mui/icons-material/Clear"; // For Clear Icon
import { useDispatch, useSelector } from "react-redux";
import { GET_MEALPLAN, DELETE_MEALPLAN, EMAIL_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import { GET_ALLERGIES } from "../../../actions/allergies/ActionCreators";
import UpdateMealPlan from "../update/UpdateMealPlan";
import Details from "../view/Details";
import PreviewMealPlan from "../download/PreviewMealPlan";
import DownloadMealPlan from "../download/DownloadMealPlan";

const ViewMealPlan = () => {
  const dispatch = useDispatch();
  const mealPlansData = useSelector((state) => state.MealPlanReducer.mealPlanData || []);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [selectedMealPlan, setSelectedMealPlan] = useState(null);
  const [dialogType, setDialogType] = useState(null);
  const [email, setEmail] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Filter states
  const [inmateNameFilter, setInmateNameFilter] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState("");
  const [mealPlanFilter, setMealPlanFilter] = useState("");
  const [allergyFilter, setAllergyFilter] = useState("");


  const [openSnackbar, setOpenSnackbar] = useState(false);  // Controls Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Message content for the Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // 'success' or 'error' for different message styles


  useEffect(() => {
    dispatch(GET_MEALPLAN());
    dispatch(GET_ALLERGIES());
  }, [dispatch]);

  const getAllergyNames = (allergyIds) => {
    if (!allergyIds || !allergyIds.length) return ["No allergy"];
    return allergyIds.map((id) => {
      const allergy = allergiesData.find((allergy) => allergy._id === id);
      return allergy ? allergy.allergyName : "Unknown Allergy";
    });
  };

  const handleMenuOpen = (event, mealPlan) => {
    setAnchorEl(event.currentTarget);
    setSelectedMealPlan(mealPlan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogType(null);
    setSelectedMealPlan(null);
  };

  const handleConfirmDelete = () => {
    if (selectedMealPlan && selectedMealPlan._id) {
      dispatch(
        DELETE_MEALPLAN(selectedMealPlan._id, () => {
          handleCloseDialog();
        })
      );
    }
  };

  const handleSendEmail = async () => {
    if (selectedMealPlan && selectedMealPlan._id && email) {
      try {
        // Show loading state or send immediate response to user
        setSnackbarMessage("Sending email...");
        setSnackbarSeverity("info");
        setOpenSnackbar(true);  // Show the Snackbar with info
  
        // Dispatch email action asynchronously without waiting for the result
        await dispatch(EMAIL_MEALPLAN(selectedMealPlan._id, email));
  
        // On success, show a success snackbar
        setSnackbarMessage(`Email sent to: ${email}`);
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
  
        handleCloseDialog();  // Close the dialog after sending email
  
        setEmail(""); // Clear the email field
      } catch (error) {
        // Show error message in Snackbar if the email fails to send
        setSnackbarMessage("Failed to send email. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } else {
      setSnackbarMessage("Please ensure meal plan and email are valid.");
      setSnackbarSeverity("warning");
      setOpenSnackbar(true);
    }
  };
  

  const handleClearFilters = () => {
    setInmateNameFilter("");
    setMealTypeFilter("");
    setMealPlanFilter("");
    setAllergyFilter("");
  };

  // Filter mealPlans based on selected filters
  const filteredMealPlans = mealPlansData.filter((mealPlan) => {
    return (
      (inmateNameFilter ? `${mealPlan.inmateId.firstName} ${mealPlan.inmateId.lastName}`.toLowerCase().includes(inmateNameFilter.toLowerCase()) : true) &&
      (mealTypeFilter ? mealPlan.mealType === mealTypeFilter : true) &&
      (mealPlanFilter ? mealPlan.mealPlan === mealPlanFilter : true) &&
      (allergyFilter ? getAllergyNames(mealPlan.allergyId).some(allergy => allergy.toLowerCase().includes(allergyFilter.toLowerCase())) : true)
    );
  });

  return (
    <Box mt={4}>
      {/* Search Filters */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          label="Inmate Name"
          value={inmateNameFilter}
          onChange={(e) => setInmateNameFilter(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Select
          label="Meal Type"
          value={mealTypeFilter}
          onChange={(e) => setMealTypeFilter(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MuiMenuItem value="">All</MuiMenuItem>
          <MuiMenuItem value="Vegetarian">Vegetarian</MuiMenuItem>
          <MuiMenuItem value="Vegan">Vegan</MuiMenuItem>
          <MuiMenuItem value="Non-Veg">Non-Veg</MuiMenuItem>
          <MuiMenuItem value="Halal">Halal</MuiMenuItem>
        </Select>
        <Select
          label="Meal Plan"
          value={mealPlanFilter}
          onChange={(e) => setMealPlanFilter(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MuiMenuItem value="">All</MuiMenuItem>
          <MuiMenuItem value="Weekly">Weekly</MuiMenuItem>
          <MuiMenuItem value="Monthly">Monthly</MuiMenuItem>
        </Select>
        <TextField
          label="Allergy"
          value={allergyFilter}
          onChange={(e) => setAllergyFilter(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <IconButton onClick={handleClearFilters} color="secondary">
          <ClearIcon />
        </IconButton>
      </Stack>

      <TableContainer component={Paper} sx={{ margin: "20px auto", maxWidth: "1200px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Inmate Name</strong></TableCell>
              <TableCell><strong>Meal Plan</strong></TableCell>
              <TableCell><strong>Meal Type</strong></TableCell>
              <TableCell><strong>Dietary Preferences</strong></TableCell>
              <TableCell><strong>Allergy</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
              <TableCell align="center"><strong>Options</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMealPlans.map((mealPlan) => (
              <TableRow key={mealPlan._id}>
                <TableCell>
                  {mealPlan.inmateId?.firstName || mealPlan.inmateId?.lastName
                    ? `${mealPlan.inmateId.firstName || ""} ${mealPlan.inmateId.lastName || ""}`.trim()
                    : "N/A"}
                </TableCell>
                <TableCell>{mealPlan.mealPlan}</TableCell>
                <TableCell>{mealPlan.mealType}</TableCell>
                <TableCell>{mealPlan.dietaryPreferences || "N/A"}</TableCell>
                <TableCell>
                  {getAllergyNames(mealPlan.allergyId).map((allergyName, index) => (
                    <Chip key={`${allergyName}-${index}`} label={allergyName} variant="outlined" />
                  ))}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuOpen(e, mealPlan)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedMealPlan?._id === mealPlan._id)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleOpenDialog("details")}>
                      <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Details</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenDialog("update")}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Update</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={() => handleOpenDialog("delete")}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>
                  </Menu>
                  
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={() => {
                        setSelectedMealPlan(mealPlan);  
                        handleOpenDialog("preview");
                      }}
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={() => setDialogType("download")}
                    >
                      Download
                    </Button>
                    <Button variant="contained" color="primary" onClick={() =>  {
                        setSelectedMealPlan(mealPlan);  
                        handleOpenDialog("email");
                      }}>
                      Email
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
              
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogType === "delete"} onClose={handleCloseDialog}>
        <DialogTitle>Delete Meal Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this meal plan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogType === "details"} onClose={handleCloseDialog}>
        <DialogTitle>Meal Plan Details</DialogTitle>
        <DialogContent>
          <Details mealPlan={selectedMealPlan} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogType === "update"} onClose={handleCloseDialog}>
        <DialogTitle>Update Meal Plan</DialogTitle>
        <DialogContent>
          <UpdateMealPlan mealPlan={selectedMealPlan} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogType === "email"} onClose={handleCloseDialog}>
        <DialogTitle>Send Meal Plan via Email</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the recipient's email address to send the meal plan.
          </DialogContentText>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button mealPlan={selectedMealPlan} onClick={handleSendEmail} color="secondary">
            Send Email
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} // Auto-hide after 6 seconds
        onClose={() => setOpenSnackbar(false)} // Close the snackbar
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


      {dialogType === "details" && (
        <Details 
          open 
          selectedMealPlanId={selectedMealPlan?._id} 
          onClose={handleCloseDialog}
        />
      )}
      {dialogType === "update" && (
        <UpdateMealPlan
          open
          selectedMealPlanId={selectedMealPlan?._id}
          onClose={handleCloseDialog}
          onUpdate={() => {
            dispatch(GET_MEALPLAN());
            handleCloseDialog();
          }}
        />
      )}
      {dialogType === "preview" && (
        <PreviewMealPlan 
          open 
          selectedMealPlanId={selectedMealPlan?._id} 
          onClose={handleCloseDialog}
        />
      )}
      {dialogType === "download" && (
        <DownloadMealPlan selectedMealPlanId={selectedMealPlan?._id} />
      )}
    </Box>
    
  );
};

export default ViewMealPlan;
