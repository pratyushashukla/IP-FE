import React from 'react';
import { Button } from '@mui/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Replace this with API data when ready.
const mealData = {
  inmateName: "John Doe",
  mealType: "Vegetarian",
  startDate: "2024-11-01",
  endDate: "2024-11-07",
  dietaryPreferences: "No dairy",
  allergies: "Peanuts"
};

const DownloadMealPlan = () => {
  const generatePDF = async () => {
    // Create a temporary table for generating the PDF
    const tableContainer = document.createElement('div');
    tableContainer.style.width = '100%';
    tableContainer.style.padding = '20px';
    tableContainer.innerHTML = `
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

    document.body.appendChild(tableContainer);

    // Convert the table to canvas
    const canvas = await html2canvas(tableContainer);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust positioning if needed

    // Create the filename using inmate name and date
    const inmateName = mealData.inmateName.replace(" ", "");
    const startDate = mealData.startDate.replaceAll("-", "");
    const endDate = mealData.endDate.replaceAll("-", "");
    const fileName = `MealPlan_${inmateName}_${startDate}_${endDate}.pdf`;

    pdf.save(fileName);

    // Clean up
    document.body.removeChild(tableContainer);
  };

  return (
    <Button variant="contained" color="secondary" onClick={generatePDF}>
      Download
    </Button>
  );
};

export default DownloadMealPlan;
