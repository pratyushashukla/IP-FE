// src/components/visitorManagement/Visitors.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewVisitor from "./view/ViewVisitor";
import { Toolbar, Button, Box, Typography } from "@mui/material";
import CreateVisitor from "./create/CreateVisitor";
import UpdateVisitor from "./update/UpdateVisitor";
import { ADD_VISITOR, UPDATE_VISITOR, GET_VISITORS } from "../../../actions/visitors/ActionCreators";
import { GET_INMATES } from "../../../actions/inmates/ActionCreators";

function Visitors() {
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = (visitorId = 0) => {
    setSelectedVisitorId(visitorId);
    setUpdateModal(!updateModal);
  };

  const handleCreateVisitor = (visitor) => {
    dispatch(ADD_VISITOR(visitor, handleCreateModal));
  };

  const handleUpdateVisitor = (visitor) => {
    dispatch(UPDATE_VISITOR(visitor, handleUpdateModal));
  };

  useEffect(() => {
    dispatch(GET_VISITORS());
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
        Visitor Management
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} />
        <Button variant="contained" color="primary" onClick={handleCreateModal}>
          Add Visitor
        </Button>
      </Toolbar>
      <ViewVisitor handleUpdateModal={handleUpdateModal} />

      {createModal && (
        <CreateVisitor
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateVisitor}
          inmatesData={inmatesData} // Pass inmates data here
        />
      )}
      {updateModal && (
        <UpdateVisitor
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateVisitor}
          selectedVisitorId={selectedVisitorId}
        />
      )}
    </div>
  );
}

export default Visitors;
