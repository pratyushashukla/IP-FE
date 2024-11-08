import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid,
  FormControl,
  FormLabel,
  Box,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const UpdateAppointment = ({ open, onClose, onUpdate, SelectedRow }) => {
  const visitsData = useSelector((state) => state.VisitsReducer.visitsData);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);
  const visitorsData = useSelector(
    (state) => state.VisitorsReducer.visitorsData
  );

  const [appointment, setAppointment] = useState({
    visitorId: "",
    inmateId: "",
    startDate: dayjs(null),
    endDate: dayjs(null),
    status: "",
  });
  const [dataForUpdate, setDataForUpdate] = useState({});

  const [errors, setErrors] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (SelectedRow) {
      const selectedAppointment = visitsData.find(
        (appointment) => appointment._id === SelectedRow._id
      );
      if (selectedAppointment) {
        setAppointment({
          ...selectedAppointment,
          visitorId: selectedAppointment.visitorId._id,
          inmateId: selectedAppointment.inmateId._id,
          startDate: dayjs(selectedAppointment.startTime),
          endDate: dayjs(selectedAppointment.endTime),
          status: selectedAppointment.status,
        });
      }
    }
  }, [SelectedRow, visitsData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataForUpdate({
      ...dataForUpdate,
      [name]: value,
    });
  };

  const handleDateTimeChange = (name, date) => {
    setDataForUpdate({
      ...dataForUpdate,
      [name]: date,
    });
    setErrors({
      ...errors,
      [name]: date ? "" : "This field is required",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Update Appointment</DialogTitle>
      <DialogContent>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Visitor</FormLabel>
                <Select
                  name="visitorId"
                  value={dataForUpdate.visitorId || appointment.visitorId}
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  {visitorsData.map((visitor) => (
                    <MenuItem key={visitor._id} value={visitor._id}>
                      {`${visitor.firstname} ${visitor.lastname}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Inmate</FormLabel>
                <Select
                  disabled
                  readOnly
                  name="inmateId"
                  value={dataForUpdate.inmateId || appointment.inmateId}
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  {inmatesData.map((inmate) => (
                    <MenuItem key={inmate._id} value={inmate._id}>
                      {`${inmate.firstName} ${inmate.lastName}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Start Date</FormLabel>
                  <DateTimePicker
                    value={dataForUpdate.startDate || appointment.startDate}
                    onChange={(date) => handleDateTimeChange("startDate", date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>End Date</FormLabel>
                  <DateTimePicker
                    value={dataForUpdate.endDate || appointment.endDate}
                    onChange={(date) => handleDateTimeChange("endDate", date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </LocalizationProvider>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel sx={{ mb: 1 }}>Status</FormLabel>
                <Select
                  name="status"
                  value={dataForUpdate.status || appointment.status}
                  onChange={handleInputChange}
                  variant="outlined"
                >
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Canceled">Canceled</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Conditionally render the cancellation reason if status is "Canceled" */}
            {(dataForUpdate.status === "Canceled" ||
              appointment.status === "Canceled") && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel sx={{ mb: 1 }}>Cancellation Reason</FormLabel>
                  <TextField
                    required
                    name="cancellationReason"
                    value={
                      dataForUpdate.cancellationReason ||
                      appointment.cancellationReason
                    }
                    onChange={handleInputChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Please provide a reason for cancellation"
                  />
                </FormControl>
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
          onClick={() => onUpdate(dataForUpdate)}
          variant="contained"
          color="primary"
          disabled={
            !appointment.visitorId ||
            !appointment.inmateId ||
            !appointment.startDate ||
            !appointment.endDate ||
            !appointment.status ||
            errors.startDate ||
            errors.endDate
          }
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateAppointment;
