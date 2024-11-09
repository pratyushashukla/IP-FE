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
import { useDispatch, useSelector } from "react-redux";
import AllergyDropdown from "../AllergyDropdown"; 
import {
  ADD_MEALPLAN,
  GET_MEALPLAN,
} from "../../../actions/mealplan/ActionCreators";
import { GET_INMATES } from "../../../actions/inmates/ActionCreators";

export const CreateMealPlan = ({ open, onClose, onCreate, notifyUser }) => {
  const dispatch = useDispatch();
  const [mealPlan, setMealPlan] = useState({
    inmate: "", // Field for the selected inmate ID
    mealType: "Vegeterian", // Default value for the meal type
    mealPlanDuration: "Monthly", // Default value for the meal plan duration
    allergy: [], // Field for the selected allergies
    dietaryPreference: "",
    repeat: false, // UI-only field to indicate if the plan should repeat
  });

  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData || []);

  useEffect(() => {
    dispatch(GET_INMATES()); // Fetch inmates data on component mount
  }, [dispatch]);

  useEffect(() => {
    if (!mealPlan.repeat) {
      scheduleNotification();
    }
  }, [mealPlan]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMealPlan({
      ...mealPlan,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAllergyChange = (selectedAllergies) => {
    setMealPlan({
      ...mealPlan,
      allergy: selectedAllergies,
    });
  };

  const scheduleNotification = () => {
    const duration = mealPlan.mealPlanDuration === "Monthly" ? 25 : 5; // 25th of the month or 5th day of the week
    const today = new Date().getDate();

    if ((mealPlan.mealPlanDuration === "Monthly" && today >= 25) ||
        (mealPlan.mealPlanDuration === "Weekly" && today >= 5)) {
      notifyUser("Your meal plan is about to end. Please renew or update.");
    }
  };

  const handleCreate = () => {
    console.log("Create button clicked");
    dispatch(ADD_MEALPLAN(mealPlan, () => {
      onCreate();
      dispatch(GET_MEALPLAN(1, 10)); // Refresh meal plans after creation
      onClose();
      setMealPlan({
        inmate: "",
        mealType: "Vegeterian",
        mealPlanDuration: "Monthly",
        allergy: [],
        dietaryPreference: "",
        repeat: false,
      });
    }));
    if (mealPlan.repeat) {
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
      dispatch(ADD_MEALPLAN(newMealPlan, () => {
        dispatch(GET_MEALPLAN(1, 10)); // Refresh meal plans after repeat logic
      }));

      // Restart the logic for continuous repetition
      startRepeatLogic();
    }, duration);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Meal Plan</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            {/* Inmate Field */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmate" sx={{ mb: 1, fontWeight: "bold" }}>
                  Inmate
                </FormLabel>
                <TextField
                  id="inmate"
                  name="inmate"
                  value={mealPlan.inmate}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  required
                >
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {`${inmate.firstName} ${inmate.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
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
                  Meal Plan
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
          onClick={handleCreate}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateMealPlan;
