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
import { UPDATE_MEALPLAN } from "../../../actions/mealplan/ActionCreators";
import AllergyDropdown from "../AllergyDropdown";

const UpdateMealPlan = ({ open, onClose, onUpdate, selectedMealPlanId }) => {
  const dispatch = useDispatch();
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const allergies = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [mealPlan, setMealPlan] = useState({
    _id: "",
    inmateId: "",
    mealType: "",
    mealPlan: "",
    allergy: [],
    dietaryPreferences: "N/A",
  });

  const [inmateName, setInmateName] = useState("N/A");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find((plan) => plan._id === selectedMealPlanId);
      if (selectedMealPlan) {
        const inmateId = selectedMealPlan.inmateId._id || selectedMealPlan.inmateId;
        const inmate = inmatesData.find((inmate) => inmate._id === inmateId);
        setInmateName(inmate ? `${inmate.firstName} ${inmate.lastName}` : "N/A");

        setMealPlan({
          _id: selectedMealPlan._id, // Include ID for update
          inmateId: selectedMealPlan.inmateId,
          mealType: selectedMealPlan.mealType || "",
          mealPlan: selectedMealPlan.mealPlan || "",
          allergy: selectedMealPlan.allergyId || [], // Store allergy IDs
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
    const allergyIds = selectedAllergies.map((allergy) => allergy._id);
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      allergy: allergyIds,
    }));
  };

  const handleSubmit = async () => {
    if (mealPlan.mealType && mealPlan.mealPlan) {
      try {
        const payload = {
          mealPlan: mealPlan.mealPlan,
          mealType: mealPlan.mealType,
          dietaryPreferences: mealPlan.dietaryPreferences || "None",
          allergyId: mealPlan.allergy.filter((id) => id), // Validate allergy IDs
        };
        console.log("Submitting Payload:", payload); // Debugging

        await dispatch(UPDATE_MEALPLAN(mealPlan._id, payload, onClose));
        setErrorMessage("");
      } catch (error) {
        const message =
          error.response?.data?.message || "An error occurred while updating.";
        setErrorMessage(message);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Meal Plan</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errorMessage}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateName">Inmate Name</FormLabel>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealType">Meal Type</FormLabel>
                <TextField
                  id="mealType"
                  name="mealType"
                  value={mealPlan.mealType}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
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
                <FormLabel htmlFor="mealPlan">Meal Plan Duration</FormLabel>
                <TextField
                  id="mealPlan"
                  name="mealPlan"
                  value={mealPlan.mealPlan}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                >
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                </TextField>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="allergy">Allergy</FormLabel>
                <AllergyDropdown
                  value={allergies.filter((a) => mealPlan.allergy.includes(a._id))}
                  onChange={handleAllergyChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="dietaryPreferences">Dietary Preference</FormLabel>
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
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMealPlan;

