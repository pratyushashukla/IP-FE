import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERDATA } from "../actions/users/ActionCreators";
import {
  Button,
} from "@mui/material";
import { LOGOUT } from "../actions/general/ActionCreators";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const disptach = useDispatch();
  const navigate = useNavigate();

  const usersData = useSelector((state) => state.UsersReducer.usersData);

  console.log("usersDatausersDatausersDatausersData", usersData);

  useEffect(() => {
    disptach(GETUSERDATA());
  }, []);

  const handleLogout = () => {
    disptach(LOGOUT(navigate));
  }

  return (
    <div>
      <h1>Inmate+ Dashboard</h1>
      <Button type="button" onClick={()=>handleLogout()}>Logout</Button>
    </div>
  );
}

export default Dashboard;
