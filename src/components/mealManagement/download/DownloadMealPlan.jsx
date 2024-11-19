import React, { useEffect, useState } from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const DownloadMealPlan = ({ selectedMealPlanId, onClose }) => {
  const mealPlanData = useSelector((state) => state.MealPlanReducer.mealPlanData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const allergiesData = useSelector((state) => state.AllergiesReducer.allergiesData || []);

  const [mealData, setMealData] = useState(null); // Use null to indicate data loading
  const [inmateName, setInmateName] = useState("N/A");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMealPlanId) {
      const selectedMealPlan = mealPlanData.find((plan) => plan._id === selectedMealPlanId);
      if (selectedMealPlan) {
        const inmate = inmatesData.find(
          (inmate) =>
            inmate._id === selectedMealPlan.inmateId ||
            inmate._id === (selectedMealPlan.inmateId._id || "")
        );
        const allergies = selectedMealPlan.allergyId
          .map((id) => {
            const allergy = allergiesData.find((allergy) => allergy._id === id);
            return allergy ? allergy.allergyName : "N/A";
          })
          .filter((name) => name !== "N/A");

        setInmateName(inmate ? `${inmate.firstName} ${inmate.lastName}` : "N/A");
        setMealData({
          mealType: selectedMealPlan.mealType,
          mealPlan: selectedMealPlan.mealPlan,
          dietaryPreferences: selectedMealPlan.dietaryPreferences || "N/A",
          allergies: allergies.length > 0 ? allergies : ["None"],
        });
      } else {
        setError("Meal plan data not found.");
      }
    }
  }, [selectedMealPlanId, mealPlanData, inmatesData, allergiesData]);

  const generatePDF = async () => {
    if (!mealData) {
      setError("No data available to generate the PDF.");
      return;
    }

    const tableContainer = document.createElement("div");
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
          <tr><td style="padding: 8px;">Allergies</td><td style="padding: 8px;">${mealData.allergies.join(
            ", "
          )}</td></tr>
        </tbody>
      </table>
    `;
    tableContainer.innerHTML = tableHTML;
    document.body.appendChild(tableContainer);

    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save(`MealPlan_${inmateName.replace(/\s+/g, "")}.pdf`);

    document.body.removeChild(tableContainer);
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedMealPlanId} onClose={onClose}>
        <DialogTitle>Confirm Download</DialogTitle>
        <DialogContent>
          <Typography>Do you want to download this meal plan as a PDF?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
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
