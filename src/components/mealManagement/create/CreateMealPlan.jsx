import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  Box,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ADD_MEALPLAN, GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import { GET_INMATES } from "../../../actions/inmates/ActionCreators";
import AllergyDropdown from "../AllergyDropdown";

export const CreateMealPlan = ({ open, onClose, onCreate }) => {
  const dispatch = useDispatch();
  const [mealPlan, setMealPlan] = useState({
    inmateId: "",
    mealType: "",
    mealPlan: "",
    allergy: [],
    dietaryPreference: "",
  });

  const [errors, setErrors] = useState({});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [dialogErrorMessage, setDialogErrorMessage] = useState(""); // State for error dialog message
  const [loading, setLoading] = useState(false);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData || []);

  useEffect(() => {
    dispatch(GET_INMATES());
  }, [dispatch]);

  const validateFields = () => {
    const newErrors = {};
    if (!mealPlan.inmateId) newErrors.inmateId = "Please select an inmate.";
    if (!mealPlan.mealType) newErrors.mealType = "Please select a meal type.";
    if (!mealPlan.mealPlan) newErrors.mealPlan = "Please select a meal plan duration.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealPlan({
      ...mealPlan,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleAllergyChange = (selectedAllergies) => {
    setMealPlan({
      ...mealPlan,
      allergy: selectedAllergies,
    });
  };

  const handleCreate = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const payload = {
        inmateId: mealPlan.inmateId,
        mealType: mealPlan.mealType,
        mealPlan: mealPlan.mealPlan,
        allergyId: mealPlan.allergy.map((a) => a._id), // Extract allergy IDs
        dietaryPreferences: mealPlan.dietaryPreference,
      };

      await dispatch(ADD_MEALPLAN(payload));
      onCreate();
      dispatch(GET_MEALPLAN(1, 10));
      onClose();
      setMealPlan({
        inmateId: "",
        mealType: "",
        mealPlan: "",
        allergy: [],
        dietaryPreference: "",
      });
    } catch (error) {
      const serverError =
        error.response?.data?.message || error.message || "An unexpected error occurred.";
      setDialogErrorMessage(serverError); // Set error message for dialog
      setErrorDialogOpen(true); // Open the error dialog
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setErrorDialogOpen(false);
    setDialogErrorMessage("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Meal Plan</DialogTitle>
        <DialogContent>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="inmateId" sx={{ mb: 1, fontWeight: "bold" }}>
                    Inmate<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    id="inmateId"
                    name="inmateId"
                    value={mealPlan.inmateId}
                    onChange={handleInputChange}
                    select
                    variant="outlined"
                    required
                    placeholder="Select an Inmate"
                    error={!!errors.inmateId}
                    helperText={errors.inmateId}
                  >
                    {inmatesData.length === 0 ? (
                      <MenuItem disabled>No inmates available</MenuItem>
                    ) : (
                      inmatesData.map((inmate) => (
                        <MenuItem key={inmate._id} value={inmate._id}>
                          {`${inmate.firstName} ${inmate.lastName}`}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="mealType" sx={{ mb: 1, fontWeight: "bold" }}>
                    Meal Type<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    id="mealType"
                    name="mealType"
                    value={mealPlan.mealType}
                    onChange={handleInputChange}
                    select
                    variant="outlined"
                    required
                    placeholder="Meal Type"
                    error={!!errors.mealType}
                    helperText={errors.mealType}
                  >
                    <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="Halal">Halal</MenuItem>
                    <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                    <MenuItem value="Vegan">Vegan</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="mealPlan" sx={{ mb: 1, fontWeight: "bold" }}>
                    Meal Plan Duration<span style={{ color: "red" }}>*</span>
                  </FormLabel>
                  <TextField
                    id="mealPlan"
                    name="mealPlan"
                    value={mealPlan.mealPlan}
                    onChange={handleInputChange}
                    select
                    variant="outlined"
                    required
                    placeholder="Meal Plan Duration"
                    error={!!errors.mealPlan}
                    helperText={errors.mealPlan}
                  >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="allergy" sx={{ mb: 1, fontWeight: "bold" }}>
                    Allergy
                  </FormLabel>
                  <AllergyDropdown value={mealPlan.allergy} onChange={handleAllergyChange} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor="dietaryPreference" sx={{ mb: 1, fontWeight: "bold" }}>
                    Dietary Preference
                  </FormLabel>
                  <TextField
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={mealPlan.dietaryPreference}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="Dietary Preference (Optional)"
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "right", pb: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreate}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">{dialogErrorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateMealPlan;
