import React, { useEffect, useState } from 'react';
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
} from "@mui/material";
import { styled, tableCellClasses } from "@mui/material";
import { useDispatch } from 'react-redux';
import { GET_MEALPLAN } from "../../../actions/mealplan/ActionCreators";

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
    </Box>
  );
};

export default Details;
