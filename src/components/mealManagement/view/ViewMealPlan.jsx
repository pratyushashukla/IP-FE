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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { GET_MEALPLAN, DELETE_MEALPLAN , EMAIL_MEALPLAN} from "../../../actions/mealplan/ActionCreators";
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
  const [email, setEmail] = useState(""); // Email input
  const [anchorEl, setAnchorEl] = useState(null);

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

  const handleSendEmail = () => {
    if (selectedMealPlan && email) {
      // Dispatch EMAIL_MEALPLAN action, passing selectedMealPlan ID and email
      dispatch(
        EMAIL_MEALPLAN(selectedMealPlan._id, email, () => {
          console.log("Email sent to:", email);
          handleCloseDialog();
          setEmail("");
        })
      );
    }
  };


  return (
    <Box mt={4}>
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
            {mealPlansData.map((mealPlan) => (
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
                    <MenuItem
                      onClick={() => {
                        setSelectedMealPlan(mealPlan);  
                        setDialogType("delete");
                      }}
                    >
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
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog("email")}>
                      Email
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Details, Update, Preview, Email */}
      <Dialog open={Boolean(dialogType && dialogType !== "download" && dialogType !== "delete")} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {dialogType === "email" ? "Send Email" : dialogType ? dialogType.charAt(0).toUpperCase() + dialogType.slice(1) : ""}
        </DialogTitle>
        <DialogContent>
          {dialogType === "details" && 
            <Details open={Boolean(dialogType === "details")} 
              selectedMealPlanId={selectedMealPlan?._id} 
              onClose={handleCloseDialog}
            />}
          {dialogType === "update" && (
            <UpdateMealPlan
              open={Boolean(dialogType === "update")}
              selectedMealPlanId={selectedMealPlan?._id}
              onClose={handleCloseDialog}
              onUpdate={() => {
                dispatch(GET_MEALPLAN());
                handleCloseDialog();
              }}
            />
          )}
          {dialogType === "preview" && 
            <PreviewMealPlan 
              open={Boolean(dialogType === "preview")} 
              selectedMealPlanId={selectedMealPlan?._id} 
              onClose={handleCloseDialog}
            />}
          {dialogType === "email" && (
            <>
              <DialogContentText>Enter the email address to send this meal plan.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          {dialogType === "email" && <Button onClick={handleSendEmail} color="primary">Send</Button>}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {dialogType === "delete" && (
        <Dialog open={true} onClose={handleCloseDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this meal plan?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Direct Rendering of DownloadMealPlan */}
      {dialogType === "download" && (
        <DownloadMealPlan selectedMealPlanId={selectedMealPlan?._id} />
      )}
    </Box>
  );
};

export default ViewMealPlan;
