import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Grid,
  FormControl,
  FormLabel,
  Box,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";

const CreateTask = ({ open, onClose, onCreate }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Pending",
    startDate: "",
    dueDate: "",
    isCompleted: false,
    assignedTo: "",
    assignedBy: localStorage.getItem("userId"),
  });

  const [showMessage, setShowMessage] = useState(false); // For Snackbar alert
  const [error, setError] = useState(""); // For inline error message
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent user from entering an invalid due date
    if (name === "dueDate" && task.startDate) {
      if (new Date(value) < new Date(task.startDate)) {
        setShowMessage(true); // Show alert
        return; // Stop the input update
      }
    }

    if (name === "startDate" && task.dueDate) {
      if (new Date(task.dueDate) < new Date(value)) {
        setShowMessage(true); // Show alert
        return; // Stop the input update
      }
    }

    // Update task state
    setTask((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error if dates are valid
    if (name === "dueDate" || name === "startDate") {
      if (
        task.dueDate &&
        task.startDate &&
        new Date(task.dueDate) >= new Date(task.startDate)
      ) {
        setError(""); // Clear inline error
      }
    }
  };

  const handleCreate = () => {
    if (!task.title || !task.startDate || !task.dueDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (new Date(task.dueDate) < new Date(task.startDate)) {
      setShowMessage(true); // Prevent invalid task creation
      return;
    }

    onCreate(task); // Proceed if valid
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="title" sx={{ mb: 1, fontWeight: "bold" }}>
                  Task Title
                </FormLabel>
                <TextField
                  id="title"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="description"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Task Description
                </FormLabel>
                <TextField
                  id="description"
                  name="description"
                  value={task.description}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="assignedTo"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Assign To (Inmate)
                </FormLabel>
                <TextField
                  id="assignedTo"
                  name="assignedTo"
                  value={task.assignedTo}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  required
                >
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {`${inmate.firstName} ${inmate.lastName}`}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  htmlFor="startDate"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Start Date
                </FormLabel>
                <TextField
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={task.startDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor="dueDate" sx={{ mb: 1, fontWeight: "bold" }}>
                  Due Date
                </FormLabel>
                <TextField
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={task.dueDate}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
                />
              </FormControl>
            </Grid>

            {/* Inline Error */}
            {error && (
              <Grid item xs={12}>
                <Box sx={{ color: "red", mt: 1 }}>{error}</Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "right", pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleCreate} // Ensure valid task creation
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>

      {/* Snackbar for Alert Messages */}
      <Snackbar
        open={showMessage}
        autoHideDuration={4000}
        onClose={() => setShowMessage(false)}
      >
        <Alert
          onClose={() => setShowMessage(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Due date cannot be earlier than the start date.
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default CreateTask;
