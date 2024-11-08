// src/components/visitorManagement/Visitors.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewMealPlan from "./view/ViewMealPlan";
import { Toolbar, Button, Box, Typography } from "@mui/material";
import CreateMealPlan from "./create/CreateMealPlan";
import UpdateMealPlan from "./update/UpdateMealPlan";
import { ADD_MEALPLAN, UPDATE_MEALPLAN, GET_MEALPLAN } from "../../actions/mealplan/ActionCreators";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";

function MealPlan() {
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = (mealplanId = 0) => {
    setSelectedMealPlanId(mealplanId);
    setUpdateModal(!updateModal);
  };

  const handleCreateMealPlan = (mealplan) => {
    dispatch(ADD_MEALPLAN(mealplan, handleCreateModal));
  };

  const handleUpdateMealPlan = (mealplan) => {
    dispatch(UPDATE_MEALPLAN(mealplan, handleUpdateModal));
  };

  useEffect(() => {
    dispatch(GET_MEALPLAN());
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
        MealPlan Management
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} />
        <Button variant="contained" color="primary" onClick={handleCreateModal}>
          Add MealPlan
        </Button>
      </Toolbar>
      <ViewMealPlan handleUpdateModal={handleUpdateModal} />

      {createModal && (
        <CreateMealPlan
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateMealPlan}
          inmatesData={inmatesData} // Pass inmates data here
        />
      )}
      {updateModal && (
        <UpdateMealPlan
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateMealPlan}
          selectedMealPlanId={selectedMealPlanId}
        />
      )}
    </div>
  );
}

export default MealPlan;
