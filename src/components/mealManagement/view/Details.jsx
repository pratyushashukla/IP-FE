import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { styled, tableCellClasses } from "@mui/material";

// Styled components for custom styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: "20px auto",
  maxWidth: "800px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const mealPlanDetails = {
  id: 1,
  inmateName: "John Doe",
  mealType: "Lunch",
  startDate: "2024-11-01",
  endDate: "2024-11-30",
  dietaryPreference: "Low-carb",
  allergies: ["Peanuts", "Dairy"],
};

const Details = () => {
  return (
    <Box mt={4} p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Meal Plan Details
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell><strong>Detail</strong></StyledTableCell>
              <StyledTableCell><strong>Information</strong></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableCell>Inmate Name</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.inmateName}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Meal Type</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.mealType}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.startDate}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.endDate}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Dietary Preferences</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.dietaryPreference}</StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>Allergies</StyledTableCell>
              <StyledTableCell>{mealPlanDetails.allergies.join(", ")}</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </StyledTableContainer>
      <Box mt={2} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={() => alert('Navigate back to the list or other action')}>
          Back to List
        </Button>
      </Box>
    </Box>
  );
};

export default Details;
