import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PreviewMealPlan = ({ open, onClose, selectedMealPlanId }) => {
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [mealPlanDetails, setMealPlanDetails] = useState({
    inmateId: "",
    mealType: "",
    mealPlan: "",
    allergies: [],
    dietaryPreferences: "N/A",
  });
  const [inmateName, setInmateName] = useState("N/A");
  const [error, setError] = useState(null);

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
        const inmateId = selectedMealPlan.inmateId._id || selectedMealPlan.inmateId;
        const inmate = inmatesData.find((inmate) => inmate._id === inmateId);

        if (inmate) {
          setInmateName(`${inmate.firstName} ${inmate.lastName}`);
        } else {
          setInmateName("N/A");
          setError(`Inmate Not Found for ID: ${inmateId}`);
        }

        // Map allergy IDs to allergy names using the helper function
        const allergies = getAllergyNames(selectedMealPlan.allergyId);

        setMealPlanDetails({
          inmateId: selectedMealPlan.inmateId,
          mealType: selectedMealPlan.mealType || "",
          mealPlan: selectedMealPlan.mealPlan || "",
          allergies: allergies, // Sets allergy names here
          dietaryPreferences: selectedMealPlan.dietaryPreferences || "N/A",
        });
      } else {
        setError("Meal plan data not found.");
      }
    }
  }, [selectedMealPlanId, mealPlanData, inmatesData, allergiesData]);

  const handleDownload = async () => {
    if (!mealPlanDetails) return;

    const table = document.getElementById('mealPlanPreview');
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    const fileName = `MealPlan_${inmateName.replace(/\s+/g, '')}.pdf`;
    pdf.save(fileName);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Meal Plan</DialogTitle>
      <DialogContent>
        {error && <Typography color="error">{error}</Typography>}
        {!mealPlanDetails ? (
          <Typography variant="body2">Loading meal plan data...</Typography>
        ) : (
          <TableContainer component={Paper} id="mealPlanPreview">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Detail</strong></TableCell>
                  <TableCell><strong>Information</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Inmate Name</TableCell>
                  <TableCell>{inmateName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Meal Type</TableCell>
                  <TableCell>{mealPlanDetails.mealType || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Meal Plan</TableCell>
                  <TableCell>{mealPlanDetails.mealPlan || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dietary Preferences</TableCell>
                  <TableCell>{mealPlanDetails.dietaryPreferences || "N/A"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Allergies</TableCell>
                  <TableCell>
                    {mealPlanDetails.allergies.length > 0
                      ? mealPlanDetails.allergies.join(', ')
                      : "N/A"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownload} color="primary" variant="contained" disabled={!mealPlanDetails}>
          Download
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewMealPlan;
