import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { GET_MEALPLAN } from '../../../actions/mealplan/ActionCreators';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const DownloadMealPlan = ({ selectedMealPlanId }) => {
  const dispatch = useDispatch();
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedMealPlanId) {
      setLoading(true);
      dispatch(GET_MEALPLAN(selectedMealPlanId, (data) => {
        setLoading(false);
        if (data) {
          setMealData(data);
        } else {
          setError('Failed to fetch meal plan data.');
        }
      }));
    }
  }, [selectedMealPlanId, dispatch]);

  const generatePDF = async () => {
    if (!mealData) return;

    const tableContainer = document.createElement('div');
    const table = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left;">Detail</th>
            <th style="padding: 8px; text-align: left;">Information</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="padding: 8px;">Inmate Name</td><td style="padding: 8px;">${mealData.inmateName}</td></tr>
          <tr><td style="padding: 8px;">Meal Type</td><td style="padding: 8px;">${mealData.mealType}</td></tr>
          <tr><td style="padding: 8px;">Start Date</td><td style="padding: 8px;">${mealData.startDate}</td></tr>
          <tr><td style="padding: 8px;">End Date</td><td style="padding: 8px;">${mealData.endDate}</td></tr>
          <tr><td style="padding: 8px;">Dietary Preferences</td><td style="padding: 8px;">${mealData.dietaryPreferences}</td></tr>
          <tr><td style="padding: 8px;">Allergies</td><td style="padding: 8px;">${mealData.allergies}</td></tr>
        </tbody>
      </table>
    `;
    tableContainer.innerHTML = table;
    document.body.appendChild(tableContainer);

    // Convert the table to canvas
    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

    const inmateName = mealData.inmateName.replace(/\s+/g, '');
    const startDate = mealData.startDate.replaceAll('-', '');
    const endDate = mealData.endDate.replaceAll('-', '');
    const fileName = `MealPlan_${inmateName}_${startDate}_${endDate}.pdf`;

    pdf.save(fileName);

    document.body.removeChild(tableContainer);
  };

  return (
    <>
      {error && <Typography color="error">{error}</Typography>}
      {loading && <Typography variant="body2">Loading meal plan...</Typography>}

      <Button 
        variant="contained" 
        color="secondary" 
        onClick={generatePDF} 
        disabled={!mealData || loading}
      >
        Download
      </Button>
    </>
  );
};

export default DownloadMealPlan;
