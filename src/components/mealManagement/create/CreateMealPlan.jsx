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
import AllergyDropdown from "../AllergyDropdown"; 
import {
  ADD_MEALPLAN,
  GET_MEALPLAN,
} from "../../../actions/mealplan/ActionCreators";
import { GET_INMATES } from "../../../actions/inmates/ActionCreators";

export const CreateMealPlan = ({ open, onClose, onCreate }) => {
  const dispatch = useDispatch();
  const [mealPlan, setMealPlan] = useState({
    inmateId: "", // Field for the selected inmate ID
    mealType: "Vegetarian", // Default value for the meal type
    mealPlan: "Monthly", // Default value for the meal plan duration
    allergy: [], // Field for the selected allergies
    dietaryPreference: "",
  });

  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData || []);

  useEffect(() => {
    dispatch(GET_INMATES()); // Fetch inmates data on component mount
  }, [dispatch]);

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

  const handleCreate = () => {
    console.log("Create button clicked");
    dispatch(ADD_MEALPLAN(mealPlan, () => {
      onCreate();
      dispatch(GET_MEALPLAN(1, 10)); // Refresh meal plans after creation
      onClose();
      setMealPlan({
        inmateId: "",
        mealType: "Vegetarian",
        mealPlan: "Monthly",
        allergy: [],
        dietaryPreference: "",
      });
    }));
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
                  id="inmateId"
                  name="inmateId"
                  value={mealPlan.inmateId}
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
                  Meal Plan
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
