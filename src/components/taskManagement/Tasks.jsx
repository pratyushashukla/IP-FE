import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ViewTasks from "./view/ViewTasks";
import { Toolbar, Button, Box, Typography } from "@mui/material";

function Tasks() {
  const dispatch = useDispatch();

  const MemoizedViewTasks = React.memo(ViewTasks);

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
      <MemoizedViewTasks />      
    </div>
  );
}

export default Tasks;
