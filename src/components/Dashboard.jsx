import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERDATA } from "../actions/users/ActionCreators";
import Navbar from './Navbar'; 
import useAutoLogout from '../hooks/useAutoLogout';

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

  useAutoLogout(); // auto-logout hook to track inactivity

  return (
    <>     
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Inmate+ Dashboard</h1>
      </div>
    </>
  );
}

export default Dashboard;
