import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { GET_MEALPLAN } from '../../../actions/mealplan/ActionCreators';

const PreviewMealPlan = ({ selectedMealPlanId }) => {
  const [open, setOpen] = useState(false);
  const [mealData, setMealData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedMealPlanId) {
      // Fetch meal plan data using the API
      dispatch(GET_MEALPLAN(selectedMealPlanId, (data) => {
        setMealData(data);
      }));
    }
  }, [selectedMealPlanId, dispatch]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = async () => {
    if (!mealData) return;

    const table = document.getElementById('mealPlanPreview');
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust positioning if needed

    // Create the filename using inmate name and date
    const inmateName = mealData.inmateName.replace(/\s+/g, '');
    const startDate = mealData.startDate.replaceAll('-', '');
    const endDate = mealData.endDate.replaceAll('-', '');
    const fileName = `MealPlan_${inmateName}_${startDate}_${endDate}.pdf`;

    pdf.save(fileName);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClickOpen} disabled={!mealData}>
        Preview
      </Button>

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
                {mealData && (
                  <>
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
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} color="primary" variant="contained" disabled={!mealData}>
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

export default PreviewMealPlan;
