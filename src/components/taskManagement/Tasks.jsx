import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ViewTasks from "./view/ViewTasks";
import { Toolbar, Button, Box, Typography } from "@mui/material";
import CreateTask from "./create/CreateTask";
import { ADD_TASK_DATA } from "../../actions/tasks/ActionCreators";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";

function Tasks() {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleCreateTask = (task) => {
    dispatch(ADD_TASK_DATA(task, handleCloseModal));
  };

  const MemoizedViewTasks = React.memo(ViewTasks);

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
        Task Management
      </Typography>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box flexGrow={1} /> {/* This will push the button to the right */}
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Create Task
        </Button>
      </Toolbar>
      <MemoizedViewTasks />
      {isModalOpen && (
        <CreateTask
          open={isModalOpen}
          onClose={handleCloseModal}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}

export default Tasks;
