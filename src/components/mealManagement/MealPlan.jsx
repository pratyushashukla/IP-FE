import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  GET_MEALPLAN,
  ADD_MEALPLAN,
  UPDATE_MEALPLAN,
  DELETE_MEALPLAN,
  DOWNLOAD_MEALPLAN
} from "../../actions/mealplan/ActionCreators";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";
import { DataGrid } from '@mui/x-data-grid';
import { Toolbar, Button, Box, Typography } from "@mui/material";
import CreateMealPlan from '../mealManagement/create/CreateMealPlan';  
import UpdateMealPlan from '../mealManagement/update/UpdateMealPlan'; 
import ViewMealPlan from '../mealManagement/view/ViewMealPlan'; 

function MealPlan() {
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedMealPlanId, setSelectedMealPlanId] = useState(null);
  const inmatesData = useSelector((state) => state.InmatesReducer.inmatesData);

  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = (mealPlanId = 0) => {
    setSelectedMealPlanId(mealPlanId);
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
       Meal Management
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} />
        <Button variant="contained" color="primary" onClick={handleCreateModal}>
          Add Meal Plan
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
          selectedVisitorId={selectedVisitorId}
        />
      )}
    </div>
  );
}

export default MealPlan;

