import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ViewTasks from "./view/ViewTasks";
import { Toolbar, Button, Box, Typography } from "@mui/material";
import CreateTask from "./create/CreateTask";
import { ADD_TASK_DATA, EDIT_TASK_DATA } from "../../actions/tasks/ActionCreators";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";
import UpdateTask from "./update/UpdateTask";

function Tasks() {
  const dispatch = useDispatch();
  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleCreateModal = () => setCreateModal(!createModal);
  const handleUpdateModal = (taskId=0) => {
    setSelectedTaskId(taskId);
    setUpdateModal(!updateModal);
  }

  const handleCreateTask = (task) => {
    dispatch(ADD_TASK_DATA(task, handleCreateModal));
  };

  const handleUpdateTask = (task) => {
    dispatch(EDIT_TASK_DATA(task, handleUpdateModal));
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
        <Button variant="contained" color="primary" onClick={handleCreateModal}>
          Create Task
        </Button>
      </Toolbar>
      <MemoizedViewTasks handleUpdateModal={handleUpdateModal} />

      {createModal && (
        <CreateTask
          open={createModal}
          onClose={handleCreateModal}
          onCreate={handleCreateTask}
        />
      )}
      {updateModal && (
        <UpdateTask
          open={updateModal}
          onClose={handleUpdateModal}
          onUpdate={handleUpdateTask}
          selectedTaskId={selectedTaskId}
        />
      )}
    </div>
  );
}

export default Tasks;
