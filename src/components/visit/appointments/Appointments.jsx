import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toolbar, Box, Typography } from "@mui/material";
import { EDIT_VISIT, GET_VISITS } from "../../../actions/visits/ActionCreators";
import ViewAppointments from "./view/ViewAppointments";
import AppointmentDetails from "./details/AppointmentDetails";
import UpdateAppointment from "./update/UpdateAppointment";
import StatusCards from "./StatusCards";

function Appointments() {
  const dispatch = useDispatch();
  const visitsData = useSelector((state) => state.VisitsReducer.visitsData);
  const [updateModal, setUpdateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [SelectedRow, setSelectedRow] = useState(null);

  const handleUpdateModal = (visit = {}) => {
    setSelectedRow(visit);
    setUpdateModal(!updateModal);
  };

  const handleDetailsModal = (visit = {}) => {
    setSelectedRow(visit);
    setDetailsModal(!detailsModal);
  };

  const handleUpdateAppointment = (visit) => {
    dispatch(EDIT_VISIT(SelectedRow._id, visit, handleUpdateModal));
  };

  useEffect(() => {
    dispatch(GET_VISITS());
  }, [dispatch]);

  // Calculate counts for each status
  const calculateCounts = () => {
    const counts = {
      completed: visitsData.filter((visit) => visit.status === "Completed").length,
      canceled: visitsData.filter((visit) => visit.status === "Canceled").length,
      scheduled: visitsData.filter((visit) => visit.status === "Scheduled").length,
      ongoing: visitsData.filter((visit) => visit.status === "Ongoing").length,
      // completedChange: 12, // Replace with actual calculations if available
      // canceledChange: -16,
      // scheduledChange: 0,
      // ongoingChange: 5,
    };
    return counts;
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mt: 4, fontWeight: "bold" }}
      >
        All Appointments
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} />
      </Toolbar>

      {/* Status Cards */}
      <StatusCards counts={calculateCounts()} />

      {/* Appointment views */}
      <ViewAppointments
        handleDetailsModal={handleDetailsModal}
        handleUpdateModal={handleUpdateModal}
      />

      {updateModal && (
        <UpdateAppointment
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateAppointment}
          SelectedRow={SelectedRow}
        />
      )}

      {detailsModal && (
        <AppointmentDetails
          open={detailsModal}
          onClose={handleDetailsModal}
          visit={SelectedRow}
        />
      )}
    </div>
  );
}

export default Appointments;
