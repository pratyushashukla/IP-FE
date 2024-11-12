import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  TextField,
  Grid,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";

const Details = ({ open, onClose, selectedMealPlanId }) => {
  const dispatch = useDispatch();
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [mealPlanDetails, setMealPlanDetails] = useState({
    inmateId: "",
    mealType: "",
    mealPlan: "",
    allergies: [],
    dietaryPreferences: "N/A", // Default value set to "N/A"
  });

  const [inmateName, setInmateName] = useState("N/A"); 

  const getAllergyNames = (allergyIds) => {
    if (!allergyIds || !allergyIds.length) return ["N/A"];
    return allergyIds.map((id) => {
      const allergy = allergiesData.find((allergy) => allergy._id === id);
      return allergy ? allergy.allergyName : "N/A";
    });
  };

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find((plan) => plan._id === selectedMealPlanId);
      if (selectedMealPlan) {
        const inmateId = selectedMealPlan.inmateId._id || selectedMealPlan.inmateId; // Handles cases where inmateId is an object
        const inmate = inmatesData.find((inmate) => inmate._id === inmateId);

        if (inmate) {
          setInmateName(`${inmate.firstName} ${inmate.lastName}`);
        } else {
          setInmateName("N/A");
        }

        // Map allergy IDs to allergy names using the helper function
        const allergies = getAllergyNames(selectedMealPlan.allergyId);

        // Set mealPlanDetails state with data of selected meal plan
        setMealPlanDetails({
          inmateId: selectedMealPlan.inmateId,
          mealType: selectedMealPlan.mealType || "",
          mealPlan: selectedMealPlan.mealPlan || "",
          allergies: allergies, // Sets allergy names here
          dietaryPreferences: selectedMealPlan.dietaryPreferences || "N/A",
        });
      }
    }
  }, [selectedMealPlanId, mealPlanData, inmatesData, allergiesData]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Meal Plan Details</DialogTitle>
      <DialogContent>
        <Box mt={2} p={2}>
          <Grid container spacing={2}>
            {/* Inmate Name */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="inmateName" sx={{ mb: 1, fontWeight: "bold" }}>
                  Inmate Name
                </FormLabel>
                <TextField
                  id="inmateName"
                  name="inmateName"
                  value={inmateName} // Display the mapped inmate name
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Meal Type */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealType" sx={{ mb: 1, fontWeight: "bold" }}>
                  Meal Type
                </FormLabel>
                <TextField
                  id="mealType"
                  name="mealType"
                  value={mealPlanDetails.mealType || "N/A"}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Meal Plan */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="mealPlan" sx={{ mb: 1, fontWeight: "bold" }}>
                  Meal Plan
                </FormLabel>
                <TextField
                  id="mealPlan"
                  name="mealPlan"
                  value={mealPlanDetails.mealPlan || "N/A"}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Dietary Preference */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="dietaryPreference" sx={{ mb: 1, fontWeight: "bold" }}>
                  Dietary Preference
                </FormLabel>
                <TextField
                  id="dietaryPreference"
                  name="dietaryPreference"
                  value={mealPlanDetails.dietaryPreferences || "N/A"}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </FormControl>
            </Grid>

            {/* Allergies - Displaying as Chips or Text */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="allergies" sx={{ mb: 1, fontWeight: "bold" }}>
                  Allergies
                </FormLabel>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  {mealPlanDetails.allergies && mealPlanDetails.allergies.length > 0 ? (
                    mealPlanDetails.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} variant="outlined" />
                    ))
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No allergies listed
                    </Typography>
                  )}
                </Stack>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Details;
