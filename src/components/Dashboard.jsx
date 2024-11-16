import React, { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GETUSERDATA } from "../actions/users/ActionCreators";
import useAutoLogout from "../hooks/useAutoLogout";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const usersData = useSelector((state) => state.UsersReducer.usersData);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    dispatch(GETUSERDATA());
  }, [dispatch]);

  const { showDialog, logout } = useAutoLogout();

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      padding: "40px",
      backgroundColor: "#f1f8ff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    headerContainer: {
      padding: "30px",
      textAlign: "center",
      backgroundColor: "#1565c0",
      borderRadius: "12px",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
      marginBottom: "30px",
      maxWidth: "700px",
      color: "#ffffff",
    },
    headerTitle: {
      fontWeight: "bold",
      fontSize: "2.4rem",
    },
    headerDescription: {
      fontSize: "1.2rem",
      marginTop: "10px",
      color: "#e3f2fd",
    },
    scrollContainer: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: "100%",
      maxWidth: "90%",
    },
    arrowButton: {
      position: "absolute",
      backgroundColor: "rgba(21, 101, 192, 0.9)",
      color: "#ffffff",
      borderRadius: "50%",
      height: "50px",
      width: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      zIndex: 2,
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
      transition: "background-color 0.3s ease, transform 0.3s ease",
      "&:hover": {
        backgroundColor: "#0d47a1",
        transform: "scale(1.15)",
      },
    },
    leftArrow: { left: "-60px", top: "50%", transform: "translateY(-50%)" },
    rightArrow: { right: "-60px", top: "50%", transform: "translateY(-50%)" },
    cardContainer: {
      display: "flex",
      overflowX: "hidden", // Hide scrollbar
      gap: "20px",
      padding: "10px",
      alignItems: "center",
      scrollBehavior: "smooth",
      // For certain browsers that show scrollbars by default, we can hide them with WebKit properties.
      scrollbarWidth: "none", // For Firefox
      msOverflowStyle: "none", // For Internet Explorer and Edge
    },
    card: {
      minWidth: "250px",
      maxWidth: "250px",
      height: "300px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      },
    },
    cardContent: {
      textAlign: "center",
      padding: "20px",
      color: "#424242",
    },
    cardTitle: {
      color: "#1e88e5",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    cardDescription: {
      fontSize: "1rem",
      color: "#666",
      marginTop: "10px",
    },
    button: {
      backgroundColor: "#1976d2",
      color: "#ffffff",
      textTransform: "none",
      fontWeight: "500",
      padding: "10px 20px",
      "&:hover": {
        backgroundColor: "#0d47a1",
      },
    },
    dialogTitle: {
      color: "#2c3e50",
      fontWeight: "bold",
    },
    dialogContentText: {
      color: "#34495e",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerContainer}>
        <Typography variant="h3" style={styles.headerTitle} gutterBottom>
          Inmate+ Dashboard
        </Typography>
        <Typography style={styles.headerDescription}>
          Welcome to the Inmate+ Dashboard, an intuitive platform designed to facilitate the management of inmates.
        </Typography>
      </div>

      <div style={styles.scrollContainer}>
        <div
          style={{ ...styles.arrowButton, ...styles.leftArrow }}
          onClick={scrollLeft}
        >
          <ArrowBackIosIcon />
        </div>

        <div style={styles.cardContainer} ref={scrollContainerRef}>
          {[
            { title: "Profile", description: "View and update your personal profile information.", link: "/profile" },
            { title: "Tasks", description: "Manage and view assigned tasks.", link: "/task" },
            { title: "Visits", description: "Schedule and manage visits for inmates.", link: "/visit" },
            { title: "Inmates", description: "View information and manage inmate records.", link: "/inmate" },
            { title: "Meal Plan", description: "Manage inmate meal plans, preferences, and restrictions..", link: "/meal" },
          ].map((item, index) => (
            <Card key={index} style={styles.card}>
              <CardContent style={styles.cardContent}>
                <Typography variant="h6" style={styles.cardTitle}>
                  {item.title}
                </Typography>
                <Typography variant="body2" style={styles.cardDescription}>
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => navigate(item.link)} style={styles.button} fullWidth>
                  {item.title === "Profile" ? "View Profile" : `Go to ${item.title}`}
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>

        <div
          style={{ ...styles.arrowButton, ...styles.rightArrow }}
          onClick={scrollRight}
        >
          <ArrowForwardIosIcon />
        </div>
      </div>

      <Dialog
        open={showDialog}
        onClose={logout}
        aria-labelledby="inactivity-dialog-title"
        aria-describedby="inactivity-dialog-description"
      >
        <DialogTitle id="inactivity-dialog-title" style={styles.dialogTitle}>
          You have been inactive
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="inactivity-dialog-description" style={styles.dialogContentText}>
            You will be logged out due to inactivity in 1 minute. Move your mouse to stay logged in.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Dashboard;
