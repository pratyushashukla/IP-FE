import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LogoutDialog from "./authentication/LogoutDialog";
import { LOGOUT } from "../actions/general/ActionCreators";

const Navbar = ({ selectedTab, onTabChange }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to handle the dialog visibility
  const [anchorElUser, setAnchorElUser] = useState(null); // State for user menu anchor
  const dispatch = useDispatch(); // Redux dispatch hook
  const navigate = useNavigate(); // React Router hook for navigation

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setOpenDialog(false); // Close the dialog
    try {
      dispatch(LOGOUT(navigate)); // Dispatch the LOGOUT action and pass the navigate function
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  // Menu items for navigation
  const menuItems = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Inmates", value: "inmate" },
    { label: "Task Management", value: "task" },
    { label: "Meal Management", value: "meal" },
    { label: "Visit Management", value: "visit" },
  ];

  // Open user menu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Close user menu
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ margin: 0 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Clickable Logo - Redirects to Dashboard */}
        <NavLink to="/dashboard" style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/images/logo.jpg"
            alt="Logo"
            style={{
              width: "50px",
              marginLeft: "15px",
              border: "3px solid #FFA500", // Orange border
              backgroundColor: "#ADD8E6", // Light blue background
              borderRadius: "50%",       // Circular shape
              padding: "5px",
              transition: "transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.2)", // Slight scale-up on hover
                backgroundColor: "#FFD700", // Gold background on hover
                borderColor: "#FF8C00", // Dark orange border on hover
              },
            }}
          />
        </NavLink>

        {/* Centered NavLink items */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.value}
              to={`/${item.value}`}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "yellow" : "white",
                padding: "10px 20px",
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </Box>

        {/* User Avatar with attractive styling */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                src="/static/images/avatar/2.jpg"
                sx={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: "#4169E1", // Royal blue background color
                  border: "3px solid #FFA500", // Orange border color
                  padding: "3px",
                  borderRadius: "50%",
                  boxShadow: "0 6px 10px rgba(0, 0, 0, 0.5)", // Light shadow for depth
                  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.3)", // Increase size on hover
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.7)", // Stronger shadow on hover
                    borderColor: "#FF8C00", // Dark orange border on hover
                    backgroundColor: "#FFD700", // Gold background on hover
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu */}
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          <MenuItem
            onClick={() => {
              navigate("/profile");
              handleCloseUserMenu();
            }}
          >
            <Typography textAlign="center">My Account</Typography>
          </MenuItem>
          <MenuItem onClick={() => setOpenDialog(true)}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleLogoutConfirm}
      />
    </AppBar>
  );
};

export default Navbar;
