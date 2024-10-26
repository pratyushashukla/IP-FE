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
    assignedTo: "", // Field for the assigned inmate ID,
    assignedBy: localStorage.getItem("userId"),
  });

  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTask({
      ...task,
      [name]:
        type === "checkbox"
          ? checked
          : type === "date"
          ? new Date(value).toISOString()
          : value,
    });
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
                  <MenuItem value="Inprogress">In Progress</MenuItem>
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
                  value={task.startDate ? task.startDate.split("T")[0] : ""}
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
                  value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  required
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
          onClick={() => onCreate(task)}
          variant="contained"
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTask;
