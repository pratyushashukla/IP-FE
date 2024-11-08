import React, { useState, useEffect } from "react";
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
// import axios from "axios"; // Uncomment when using actual API calls

const AllergyDropdown = () => {
  const [allergies, setAllergies] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAllergy, setNewAllergy] = useState("");
  const [newAllergyDescription, setNewAllergyDescription] = useState("");

  useEffect(() => {
    // Dummy data for testing
    const dummyData = [
      { id: 1, title: "Peanuts" },
      { id: 2, title: "Shellfish" },
      { id: 3, title: "Milk" },
      { id: 4, title: "Eggs" },
      { id: 5, title: "Soy" },
    ];
    setAllergies(dummyData);

    // Uncomment this when API is used
    /*
    axios
      .get("/api/allergies")
      .then((response) => {
        setAllergies(response.data);
      })
      .catch((err) => console.error(err));
    */
  }, []);

  const handleCreateAllergy = () => {
    // Adding new allergy to the state directly for testing
    const newId = allergies.length + 1;
    const newAllergyObject = {
      id: newId,
      title: newAllergy,
      description: newAllergyDescription,
    };

    setAllergies((prevAllergies) => [...prevAllergies, newAllergyObject]);
    setOpenDialog(false);
    setNewAllergy("");
    setNewAllergyDescription("");
  };

  return (
    <Stack spacing={3} sx={{ width: 500 }}>
      <Autocomplete
        multiple
        id="allergy-autocomplete"
        options={[...allergies, { id: 'create', title: 'Create New Allergy' }]} // Add the 'Create' option
        getOptionLabel={(option) => option.title}
        value={selectedAllergies}
        onChange={(event, newValue) => {
          if (newValue.some(option => option.id === 'create')) {
            setOpenDialog(true);
            setSelectedAllergies(newValue.filter(option => option.id !== 'create')); // Remove the create option from selection
          } else {
            setSelectedAllergies(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Allergies"
            placeholder="Select or add allergies"
          />
        )}
        renderOption={(props, option) => {
          if (option.id === 'create') {
            return (
              <MenuItem {...props} onClick={() => setOpenDialog(true)} style={{ display: "flex", justifyContent: "center" }}>
                <AddCircleOutlineIcon style={{ marginRight: "8px" }} />
                <Typography color="primary">Create New Allergy</Typography>
              </MenuItem>
            );
          }
          return <MenuItem {...props}>{option.title}</MenuItem>;
        }}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Allergy</DialogTitle>
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
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleCreateAllergy}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default AllergyDropdown;
