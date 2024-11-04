// src/components/visitorManagement/Visitors.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Toolbar, Box, Typography } from "@mui/material";
import { EDIT_VISIT, GET_VISITS } from "../../../actions/visits/ActionCreators";
import ViewAppointments from "./view/ViewAppointments";
import AppointmentDetails from "./details/AppointmentDetails";

function Appointments() {
  const dispatch = useDispatch();

  const [updateModal, setUpdateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  const [SelectedRow, setSelectedRow] = useState(null);

  // const handleUpdateModal = (visit = {}) => {
  //   setSelectedRow(visit);
  //   setUpdateModal(!updateModal);
  // };

  const handleDetailsModal = (visit = {}) => {
    setSelectedRow(visit);
    setDetailsModal(!detailsModal);
  };

  //   const handleUpdateVisitor = (visit) => {
  //     dispatch(EDIT_VISIT(selectedId, visit, handleUpdateModal));
  //   };

  useEffect(() => {
    dispatch(GET_VISITS());
  }, [dispatch]);

  console.log("SelectedRow", SelectedRow)

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
      <ViewAppointments handleDetailsModal={handleDetailsModal} />

      {/* {updateModal && (
        <UpdateVisit
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateVisit}
          selectedVisitorId={selectedVisitorId}
        />
      )} */}

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
