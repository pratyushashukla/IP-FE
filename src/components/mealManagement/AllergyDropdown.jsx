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

const AllergyDropdown = ({ value = [], onChange }) => {
  const dispatch = useDispatch();

  // Fetch allergies directly
  const allergies = useSelector((state) => state.AllergiesReducer.allergiesData || []);
  
  const [selectedAllergies, setSelectedAllergies] = useState(value); // Initialize with value
  const [openDialog, setOpenDialog] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newAllergyDescription, setNewAllergyDescription] = useState("");

  const firstInputRef = useRef(null);

  useEffect(() => {
    // Dispatch action to fetch allergies when component mounts
    dispatch(GET_ALLERGIES());
  }, [dispatch]);

  // Update selected allergies when the prop value changes
  useEffect(() => {
    setSelectedAllergies(value);
  }, [value]);

  useEffect(() => {
    if (openDialog) {
      firstInputRef.current?.focus();
    }
  }, [openDialog]);

  const handleCreateAllergy = async () => {
    const newAllergyObject = {
      allergyName: newAllergy,
      description: newAllergyDescription,
    };

    try {
      await dispatch(ADD_ALLERGY(newAllergyObject));
      const updatedAllergies = [...selectedAllergies, newAllergyObject];
      setSelectedAllergies(updatedAllergies);
      onChange(updatedAllergies);
      setOpenDialog(false);
      setNewAllergy("");
      setNewAllergyDescription("");
    } catch (error) {
      console.error("Error creating allergy:", error);
    }
  };

  const handleChange = (event, newValue) => {
    if (newValue.some((option) => option.id === "create")) {
      setOpenDialog(true);
      setSelectedAllergies(newValue.filter((option) => option.id !== "create"));
    } else {
      setSelectedAllergies(newValue);
      onChange(newValue);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Add "Create New Allergy" option to the allergies list
  const optionsWithCreateNew = [
    ...allergies,
    { id: "create", allergyName: "Create New Allergy" },
  ];

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Autocomplete
        multiple
        id="allergy-autocomplete"
        options={optionsWithCreateNew}
        getOptionLabel={(option) => option.allergyName || ""}
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
          if (option.id === "create") {
            return (
              <MenuItem {...props} style={{ display: "flex", justifyContent: "center" }}>
                <AddCircleOutlineIcon style={{ marginRight: "8px" }} />
                <Typography color="primary">Create New Allergy</Typography>
              </MenuItem>
            );
          }
          return <MenuItem {...props}>{option.allergyName}</MenuItem>;
        }}
      />

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="create-new-allergy-title"
        aria-describedby="create-new-allergy-description"
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
            inputRef={firstInputRef}
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
            disabled={!newAllergy.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AllergyDropdown;
