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
} from "@mui/material";
import { useDispatch } from "react-redux";
import { GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";

const Details = ({ selectedMealPlanId }) => {
  const [mealPlanDetails, setMealPlanDetails] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedMealPlanId) {
      // Fetch meal plan data using the API
      dispatch(GET_MEALPLAN(selectedMealPlanId, (data) => {
        setMealPlanDetails(data);
      }));
    }
  }, [selectedMealPlanId, dispatch]);

  if (!mealPlanDetails) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Box mt={4} p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Meal Plan Details
      </Typography>

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
              value={mealPlanDetails.inmateName || "N/A"}
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
              value={mealPlanDetails.dietaryPreference || "N/A"}
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
            {/* Render allergies as Chips or a Comma-Separated List */}
            <Stack direction="row" spacing={1}>
              {mealPlanDetails.allergies.length > 0 ? (
                mealPlanDetails.allergies.map((allergy, index) => (
                  <Chip key={index} label={allergy} variant="outlined" />
                ))
              ) : (
                <Typography>No allergies listed</Typography>
              )}
            </Stack>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Details;
