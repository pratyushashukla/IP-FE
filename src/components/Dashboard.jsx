import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERDATA } from "../actions/users/ActionCreators";


function Dashboard() {
  const dispatch = useDispatch();

  const usersData = useSelector((state) => state.UsersReducer.usersData);

  console.log("usersData", usersData);

  useEffect(() => {
    dispatch(GETUSERDATA());
  }, [dispatch]);

  return (
    <>     
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Inmate+ Dashboard</h1>
      </div>
    </>
  );
}

export default Dashboard;
