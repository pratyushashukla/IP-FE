import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERDATA } from "../actions/users/ActionCreators";
import useAutoLogout from "../hooks/useAutoLogout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const usersData = useSelector((state) => state.UsersReducer.usersData);

  useEffect(() => {
    dispatch(GETUSERDATA());
  }, [dispatch]);

  const { showDialog, logout, resetInactivityTimeout } = useAutoLogout(); // Get the dialog control state from the hook

  return (
    <>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Inmate+ Dashboard</h1>
      </div>

      {/* Inactivity warning dialog */}
      <Dialog
        open={showDialog}
        onClose={logout} // Close dialog and logout if dismissed
        aria-labelledby="inactivity-dialog-title"
        aria-describedby="inactivity-dialog-description"
      >
        <DialogTitle id="inactivity-dialog-title">
          {"You have been inactive"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="inactivity-dialog-description">
            You will be logged out due to inactivity in 1 minute. Move your mouse to stay logged in.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Dashboard;
