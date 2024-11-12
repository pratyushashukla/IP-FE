import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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

const DownloadMeal = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const generatePDF = async () => {
    const table = document.getElementById('mealPlanPreview');
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF(); // This should be replaced with response when backend api is ready

    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); //  positioning of table

    // filename as per requirement
    const inmateName = mealData.inmateName.replace(" ", "");
    const startDate = mealData.startDate.replaceAll("-", "");
    const endDate = mealData.endDate.replaceAll("-", "");
    const fileName = `MealPlan_${inmateName}_${startDate}_${endDate}.pdf`;

    pdf.save(fileName);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{ marginRight: '10px' }}>
        Preview
      </Button>
      
      <Button variant="contained" color="secondary" onClick={generatePDF}>
        Download 
      </Button>

      {/* Preview Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Meal Plan</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper} id="mealPlanPreview" style={{ width: '100%' }}>
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
                  <TableCell>{mealData.inmateName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Meal Type</TableCell>
                  <TableCell>{mealData.mealType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Start Date</TableCell>
                  <TableCell>{mealData.startDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>End Date</TableCell>
                  <TableCell>{mealData.endDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dietary Preferences</TableCell>
                  <TableCell>{mealData.dietaryPreferences}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Allergies</TableCell>
                  <TableCell>{mealData.allergies}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={generatePDF} color="primary" variant="contained">
            Download
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadMeal;
