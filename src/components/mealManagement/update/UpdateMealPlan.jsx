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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_MEALPLAN, GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import AllergyDropdown from "../AllergyDropdown"; // Import the custom AllergyDropdown

const UpdateMealPlan = ({ open, onClose, onUpdate, selectedMealPlanId }) => {
  const dispatch = useDispatch();
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [mealPlan, setMealPlan] = useState({
    inmateId: "",
    mealType: "",
    mealPlan: "",
    allergy: [], 
    dietaryPreferences: "N/A",
  });
  const [inmateName, setInmateName] = useState("N/A");

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find((plan) => plan._id === selectedMealPlanId);
      if (selectedMealPlan) {
        const inmateId = selectedMealPlan.inmateId._id || selectedMealPlan.inmateId;
        const inmate = inmatesData.find((inmate) => inmate._id === inmateId);
        setInmateName(inmate ? `${inmate.firstName} ${inmate.lastName}` : "N/A");

        // Sets allergies with IDs directly
        setMealPlan({
          inmateId: selectedMealPlan.inmateId,
          mealType: selectedMealPlan.mealType || "",
          mealPlan: selectedMealPlan.mealPlan || "",
          allergy: selectedMealPlan.allergyId || [], // Set IDs directly here
          dietaryPreferences: selectedMealPlan.dietaryPreferences || "N/A",
        });
      }
    }
  }, [selectedMealPlanId, mealPlanData, inmatesData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      [name]: value,
    }));
  };

  const handleAllergyChange = (selectedAllergies) => {
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      allergy: selectedAllergies,
    }));
  };

  const isFormValid = mealPlan.mealType && mealPlan.mealPlan;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Meal Plan</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            {/* Inmate Name (Read-only) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateName" sx={{ mb: 1, fontWeight: "bold" }}>
                  Inmate Name
                </FormLabel>
                <TextField
                  id="inmateName"
                  name="inmateName"
                  value={inmateName}
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

            {/* Allergy Dropdown */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="allergy" sx={{ mb: 1, fontWeight: "bold" }}>
                  Allergy
                </FormLabel>
                <AllergyDropdown
                  value={mealPlan.allergy} // This is now a list of allergy IDs
                  onChange={handleAllergyChange}
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
          onClick={() => onUpdate(mealPlan)}
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
