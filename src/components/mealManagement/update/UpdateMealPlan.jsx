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
import AllergyDropdown from "../AllergyDropdown"; 
import { UPDATE_MEALPLAN, GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";

const UpdateMealPlan = ({ open, onClose, onUpdate, selectedMealPlanId }) => {
  const dispatch = useDispatch();
  const [mealPlan, setMealPlan] = useState({
    inmateId: "", // Read-only field populated from existing data
    mealType: "",
    mealPlan: "",
    allergy: [],
    dietaryPreferences: "",
  });
  const [error, setError] = useState(null); // Error state

  // Fetch meal plan data if not already available in Redux store
  useEffect(() => {
    if (selectedMealPlanId) {
      dispatch(
        GET_MEALPLAN(selectedMealPlanId, (data) => {
          if (data) {
            setMealPlan({
              ...data,
              inmateId: data.inmate._id, // Set inmate ID as readonly field
            });
          } else {
            setError("Meal plan data not found.");
          }
        })
      );
    }
  }, [selectedMealPlanId, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    if (mealPlan.mealType && mealPlan.mealPlan) {
      dispatch(
        UPDATE_MEALPLAN(mealPlan, () => {
          onUpdate(); // Callback after update
          onClose();  // Close the dialog
        })
      );
    } else {
      setError("Please fill in all required fields.");
    }
  };

  const isFormValid = mealPlan.mealType && mealPlan.mealPlan;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Meal Plan</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>} {/* Display error if any */}
        <Box>
          <Grid container spacing={2}>
            {/* Inmate Field (Read-only) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateId" sx={{ mb: 1, fontWeight: "bold" }}>
                  Inmate
                </FormLabel>
                <TextField
                  id="inmateId"
                  name="inmateId"
                  value={mealPlan.inmateId}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Meal Type Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealType" sx={{ mb: 1, fontWeight: "bold" }}>
                  Meal Type
                </FormLabel>
                <TextField
                  id="mealType"
                  name="mealType"
                  value={mealPlan.mealType}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  required
                >
                  <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="Halal">Halal</MenuItem>
                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                  <MenuItem value="Vegan">Vegan</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            {/* Meal Plan Duration Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealPlan" sx={{ mb: 1, fontWeight: "bold" }}>
                  Meal Plan Duration
                </FormLabel>
                <TextField
                  id="mealPlan"
                  name="mealPlan"
                  value={mealPlan.mealPlan}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  required
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            {/* Allergy Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="allergy" sx={{ mb: 1, fontWeight: "bold" }}>
                  Allergy
                </FormLabel>
                <AllergyDropdown
                  value={mealPlan.allergy}
                  onChange={(selectedAllergies) =>
                    setMealPlan({ ...mealPlan, allergy: selectedAllergies })
                  }
                />
              </FormControl>
            </Grid>

            {/* Dietary Preference Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="dietaryPreference" sx={{ mb: 1, fontWeight: "bold" }}>
                  Dietary Preference
                </FormLabel>
                <TextField
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  value={mealPlan.dietaryPreferences}
                  onChange={handleInputChange}
                  variant="outlined"
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
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          disabled={!isFormValid}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMealPlan;
