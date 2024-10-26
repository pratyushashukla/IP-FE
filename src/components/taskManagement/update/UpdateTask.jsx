import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useSelector } from "react-redux";

// Utility function to format date
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // Format to YYYY-MM-DD
};

const UpdateTask = ({ open, onClose, onUpdate, selectedTaskId }) => {
  const tasksData = useSelector((state) => state.TasksReducer.tasksData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    startDate: "",
    dueDate: "",
    assignedTo: "",
    assignments: [], // Ensure assignments is initialized as an array
    assignedBy: localStorage.getItem("userId"),
  });

  useEffect(() => {
    if (selectedTaskId) {
      const selectedTask = tasksData.find(
        (task) => task._id === selectedTaskId
      );
      if (selectedTask) {
        setTask({
          ...selectedTask,
          startDate: formatDate(selectedTask.startDate),
          dueDate: formatDate(selectedTask.dueDate),
          assignments: selectedTask.assignments || [], // Add a fallback for assignments
        });
      }
    }
  }, [selectedTaskId, tasksData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTask((prevTask) => {
      return {
        ...prevTask,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const handleChangeForAssignment = (e) => {
    const { name, value } = e.target;

    if (name === "assignedTo") {
      const selectedInmate = inmatesData.find((inmate) => inmate._id === value);

      if (selectedInmate) {
        const updatedAssignments = [
          {
            ...task.assignments[0], // Keep other assignment fields
            inmateId: {
              _id: selectedInmate._id,
              firstName: selectedInmate.firstName,
              lastName: selectedInmate.lastName,
            },
          },
        ];
        setTask((prevTask) => {
          return { ...prevTask, assignments: updatedAssignments };
        });
      }
    }

    if (name === "progressNotes") {
      const updatedAssignments = [
        {
          ...task.assignments[0], // Keep other assignment fields
          progressNotes: value,
        },
      ];
      setTask((prevTask) => {
        return { ...prevTask, assignments: updatedAssignments };
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Task</DialogTitle>
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
                  multiline // Make it a text area
                  rows={4} // Set the number of visible rows
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
                  value={task.assignments[0]?.inmateId?._id || ""}
                  onChange={handleChangeForAssignment}
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
                <FormLabel htmlFor="status" sx={{ mb: 1, fontWeight: "bold" }}>
                  Status
                </FormLabel>
                <TextField
                  id="status"
                  name="status"
                  value={task.status}
                  onChange={handleInputChange}
                  select
                  variant="outlined"
                  required
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
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

            <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel
                htmlFor="Task Progress Notes"
                sx={{ mb: 1, fontWeight: "bold" }}
              >
                Task Progress Notes
              </FormLabel>
              <TextField
                id="progressNotes"
                name="progressNotes"
                value={task.assignments[0]?.progressNotes || ""}
                onChange={handleChangeForAssignment}
                variant="outlined"
                multiline // Make it a text area
                rows={2} // Set the number of visible rows
              />
            </FormControl>
          </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "right", pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => onUpdate(task)}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTask;
