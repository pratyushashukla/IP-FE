import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack,
  MenuItem,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { GET_ALLERGIES, ADD_ALLERGY } from "../../actions/allergies/ActionCreators";
import { createSelector } from 'reselect';

const selectAllergiesState = (state) => state.allergiesData || [];

// Memoized selector for allergies
const selectAllergies = createSelector(
  [selectAllergiesState],
  (allergies) => allergies
);
const AllergyDropdown = ({ value, onChange }) => {
  const dispatch = useDispatch();
  const allergies = useSelector(selectAllergies); // Use the memoized selector

  const [selectedAllergies, setSelectedAllergies] = useState(value || []);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newAllergyDescription, setNewAllergyDescription] = useState("");

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);

  useEffect(() => {
    dispatch(GET_ALLERGIES()); // Dispatch action to fetch allergies when component mounts
  }, [dispatch]);

  useEffect(() => {
    if (openDialog) {
      // Focus the first input field in the dialog when it opens
      firstInputRef.current?.focus();
    }
  }, [openDialog]);

  // API call to create a new allergy
  const handleCreateAllergy = async () => {
    const newAllergyObject = {
      allergyName: newAllergy,
      description: newAllergyDescription,
    };

    try {
      // Call the action to create allergy (API call logic should be handled in this action)
      await dispatch(ADD_ALLERGY(newAllergyObject));

      // After successfully creating, update local state and Redux state
      setSelectedAllergies((prev) => [...prev, newAllergyObject]);
      onChange([...selectedAllergies, newAllergyObject]); // Notify parent component
      setOpenDialog(false);
      setNewAllergy("");
      setNewAllergyDescription("");
    } catch (error) {
      console.error("Error creating allergy:", error);
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue.some((option) => option.id === 'create')) {
      setOpenDialog(true);
      setSelectedAllergies(newValue.filter((option) => option.id !== 'create'));
    } else {
      setSelectedAllergies(newValue);
      onChange(newValue);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    // Optionally return focus to the element that had focus before the dialog was opened
    if (dialogRef.current) {
      dialogRef.current.removeAttribute("inert"); // Remove inert on dialog close
    }
  };

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      <Autocomplete
        multiple
        id="allergy-autocomplete"
        options={[...allergies, { id: 'create', title: 'Create New Allergy' }]}
        getOptionLabel={(option) => option.title || ''}
        value={selectedAllergies}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Allergies"
            placeholder="Select or add allergies"
          />
        )}
        renderOption={(props, option) => {
          if (option.id === 'create') {
            return (
              <MenuItem
                {...props}
                onClick={() => setOpenDialog(true)}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <AddCircleOutlineIcon style={{ marginRight: "8px" }} />
                <Typography color="primary">Create New Allergy</Typography>
              </MenuItem>
            );
          }
          return <MenuItem {...props}>{option.title}</MenuItem>;
        }}
      />

      <Dialog
        ref={dialogRef}
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="create-new-allergy-title"
        aria-describedby="create-new-allergy-description"
        onBackdropClick={handleDialogClose} // Optional: Close on backdrop click
      >
        <DialogTitle id="create-new-allergy-title">Create New Allergy</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Allergy Name"
            type="text"
            fullWidth
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            variant="outlined"
            inputRef={firstInputRef} // Reference for focusing the first input field
          />
          <TextField
            margin="dense"
            label="Description (Optional)"
            type="text"
            fullWidth
            value={newAllergyDescription}
            onChange={(e) => setNewAllergyDescription(e.target.value)}
            variant="outlined"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateAllergy}
            color="primary"
            variant="contained"
            disabled={!newAllergy.trim()} // Disable if name is empty
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AllergyDropdown;
