import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ViewInmates from "./view/ViewInmates";
import { Toolbar, Button, Box, Typography } from "@mui/material";
import { ADD_INMATE, EDIT_INMATE } from "../../actions/inmates/ActionCreators";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";
import UpdateInmate from "./update/UpdateInmate";
import CreateInmates from "./create/CreateInmates";
import InmateDetails from "./details/InmateDetails";

function Inmates() {
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedInmateId, setSelectedInmateId] = useState(null);

  const handleCreateModal = () => setCreateModal(!createModal);

  const handleUpdateModal = (inmateId = 0) => {
    setSelectedInmateId(inmateId);
    setUpdateModal(!updateModal);
  };

  const handleDetailsModal = (inmateId = 0) => {
    setSelectedInmateId(inmateId);
    setDetailsModal(!detailsModal);
  };

  const handleCreateInmate = (data) => {
    dispatch(ADD_INMATE(data, handleCreateModal));
  };

  const handleUpdateInmate = (data) => {
    dispatch(EDIT_INMATE(selectedInmateId, data, handleUpdateModal));
  };

  const MemoizedViewInmates = React.memo(ViewInmates);

  useEffect(() => {
    dispatch(GET_INMATES());
  }, [dispatch]);

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mt: 4, fontWeight: "bold" }}
      >
        Manage Inmates
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} /> {/* This will push the button to the right */}
        <Button variant="contained" color="primary" onClick={handleCreateModal}>
          Create Inmate
        </Button>
      </Toolbar>
      <MemoizedViewInmates
        handleUpdateModal={handleUpdateModal}
        handleDetailsModal={handleDetailsModal}
      />

      {createModal && (
        <CreateInmates
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateInmate}
        />
      )}
      {updateModal && (
        <UpdateInmate
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateInmate}
          selectedInmateId={selectedInmateId}
        />
      )}

      {detailsModal && (
        <InmateDetails
          open={detailsModal}
          onClose={handleDetailsModal}
          selectedInmateId={selectedInmateId}
        />
      )}
    </div>
  );
}

export default Inmates;
