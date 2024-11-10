import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { GET_MEALPLAN } from '../../../actions/mealplan/ActionCreators';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PreviewMealPlan = ({ selectedMealPlanId }) => {
  const [open, setOpen] = useState(false);
  const [mealData, setMealData] = useState(null);
  const [error, setError] = useState(null);  // Error state
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedMealPlanId) {
      console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
      dispatch(GET_MEALPLAN(selectedMealPlanId, (data) => {
        if (data) {
          console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");
          setMealData(data);
        } else {
          console.log("pppppppppppppppppppppppppppppppppppppppppppppppppp");
          setError('Meal plan data not found.');
        }
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
    console.log("00000000000000000000000000000000000000000000000");

    const table = document.getElementById('mealPlanPreview');
    const canvas = await html2canvas(table);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();

    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Adjust positioning if needed

    const inmateName = mealData.inmateName.replace(/\s+/g, '');
    const fileName = `MealPlan_${inmateName}.pdf`;

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
          {error && <Typography color="error">{error}</Typography>}
          {!mealData ? (
            <Typography variant="body2">Loading meal plan data...</Typography>
          ) : (
            <TableContainer component={Paper} id="mealPlanPreview" style={{ width: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell component="th" scope="col"><strong>Detail</strong></TableCell>
                    <TableCell component="th" scope="col"><strong>Information</strong></TableCell>
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
                    <TableCell>Meal Plan</TableCell>
                    <TableCell>{mealData.mealPlan}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dietary Preferences</TableCell>
                    <TableCell>{mealData.dietaryPreferences}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Allergies</TableCell>
                    <TableCell>{mealData.allergyId}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
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
