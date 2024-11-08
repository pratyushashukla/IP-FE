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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSelector } from "react-redux";
import AllergyDropdown from "../AllergyDropdown"; // Adjust the import path as needed

// Utility function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
};

const UpdateMealPlan = ({ open, onClose, onUpdate, selectedMealPlanId, notifyUser }) => {
  //const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const mealPlanData = useSelector((state) => state.MealPlanReducer?.mealPlanData || []);

  const [mealPlan, setMealPlan] = useState({
    inmate: "", // Read-only field populated from existing data
    mealType: "",
    mealPlanDuration: "",
    allergy: [],
    dietaryPreference: "",
    repeat: false, // UI-only field to indicate if the plan should repeat
  });
  const [initialRepeat, setInitialRepeat] = useState(false); // Track initial repeat state

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find(
        (plan) => plan._id === selectedMealPlanId
      );
      if (selectedMealPlan) {
        setMealPlan({
          ...selectedMealPlan,
          inmate: selectedMealPlan.inmate._id, // Set inmate ID as readonly field
          repeat: selectedMealPlan.repeat || false,
        });
        setInitialRepeat(selectedMealPlan.repeat || false); // Store initial repeat state
      }
    }
  }, [selectedMealPlanId, mealPlanData]);

  useEffect(() => {
    if (!mealPlan.repeat) {
      scheduleNotification();
    }
  }, [mealPlan]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMealPlan((prevMealPlan) => ({
      ...prevMealPlan,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const scheduleNotification = () => {
    const duration = mealPlan.mealPlanDuration === "Monthly" ? 25 : 5; // 25th of the month or 5th day of the week
    const today = new Date().getDate();

    if ((mealPlan.mealPlanDuration === "Monthly" && today >= 25) ||
        (mealPlan.mealPlanDuration === "Weekly" && today >= 5)) {
      notifyUser("Your meal plan is about to end. Please renew or update.");
    }
  };

  const handleUpdate = () => {
    onUpdate(mealPlan);

    // Trigger repeat logic only if the repeat field was updated
    if (mealPlan.repeat !== initialRepeat && mealPlan.repeat) {
      startRepeatLogic();
    }
  };

  const startRepeatLogic = () => {
    const duration = mealPlan.mealPlanDuration === "Monthly" ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // Milliseconds for month or week

    setTimeout(() => {
      // Automatically create a new meal plan
      const newMealPlan = {
        ...mealPlan,
        startDate: new Date().toISOString(),
        dueDate: new Date(new Date().getTime() + duration).toISOString(),
      };
      onUpdate(newMealPlan);

      // Restart the logic for continuous repetition
      startRepeatLogic();
    }, duration);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Meal Plan</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            {/* Inmate Field (Read-only) */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmate" sx={{ mb: 1, fontWeight: "bold" }}>
                  Inmate
                </FormLabel>
                <TextField
                  id="inmate"
                  name="inmate"
                  value={mealPlan.inmate}
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
                  <MenuItem value="Vegeterian">Vegeterian</MenuItem>
                  <MenuItem value="Halal">Halal</MenuItem>
                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                  <MenuItem value="Vegan">Vegan</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            {/* Meal Plan Duration Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealPlanDuration" sx={{ mb: 1, fontWeight: "bold" }}>
                  Meal Plan Duration
                </FormLabel>
                <TextField
                  id="mealPlanDuration"
                  name="mealPlanDuration"
                  value={mealPlan.mealPlanDuration}
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
                  id="dietaryPreference"
                  name="dietaryPreference"
                  value={mealPlan.dietaryPreference}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            {/* Repeat Checkbox Field */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={mealPlan.repeat}
                    onChange={handleInputChange}
                    name="repeat"
                  />
                }
                label="Repeat"
              />
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
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateMealPlan;
