import React, { useEffect, useState } from 'react';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DownloadMealPlan = ({ selectedMealPlanId }) => {
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const [mealData, setMealData] = useState({
    inmateId: "",
    mealType: "",
    mealPlan: "",
    dietaryPreferences: "N/A",
    allergies: [],
  });
  const [inmateName, setInmateName] = useState("N/A");
  const [error, setError] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(true); // Initially open dialog

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find((plan) => plan._id === selectedMealPlanId);
      if (selectedMealPlan) {
        const inmateId = selectedMealPlan.inmateId._id || selectedMealPlan.inmateId;
        const inmate = inmatesData.find((inmate) => inmate._id === inmateId);

        setInmateName(inmate ? `${inmate.firstName} ${inmate.lastName}` : "N/A");

        setMealData({
          inmateId: selectedMealPlan.inmateId,
          mealType: selectedMealPlan.mealType || "",
          mealPlan: selectedMealPlan.mealPlan || "",
          dietaryPreferences: selectedMealPlan.dietaryPreferences || "N/A",
          allergies: selectedMealPlan.allergy || [],
        });
      } else {
        setError("Meal plan data not found.");
      }
    }
  }, [selectedMealPlanId, mealPlanData, inmatesData]);

  const generatePDF = async () => {
    const tableContainer = document.createElement('div');
    const tableHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left;">Detail</th>
            <th style="padding: 8px; text-align: left;">Information</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 8px;">Inmate Name</td><td style="padding: 8px;">${inmateName}</td></tr>
          <tr><td style="padding: 8px;">Meal Type</td><td style="padding: 8px;">${mealData.mealType}</td></tr>
          <tr><td style="padding: 8px;">Meal Plan</td><td style="padding: 8px;">${mealData.mealPlan}</td></tr>
          <tr><td style="padding: 8px;">Dietary Preferences</td><td style="padding: 8px;">${mealData.dietaryPreferences}</td></tr>
          <tr><td style="padding: 8px;">Allergies</td><td style="padding: 8px;">${mealData.allergies.join(', ')}</td></tr>
        </tbody>
      </table>
    `;
    tableContainer.innerHTML = tableHTML;
    document.body.appendChild(tableContainer);

    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`MealPlan_${inmateName.replace(/\s+/g, '')}.pdf`);

    document.body.removeChild(tableContainer);
    setConfirmDialogOpen(false);
  };

  const handleConfirmClose = () => setConfirmDialogOpen(false);

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <Typography>Do you want to download this meal plan as a PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={generatePDF} color="primary" variant="contained">
            Yes, Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadMealPlan;
