import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
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
    { label: "Inmates ", value: "inmate" },
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
    <AppBar
      position="static"
      sx={{ margin: 0, display: "flex", placeItems: "center" }}
    >
      <Toolbar sx={{ width: "100%" }}>
        {/* Clickable Logo - Redirects to Dashboard */}
        <NavLink to="/dashboard">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            style={{ width: "50px", marginRight: "15px" }}
          />
        </NavLink>

        {/* NavLink items for navigation */}
        <nav
          style={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {menuItems.map((item) => (
            <NavLink
              key={item.value}
              to={`/${item.value}`}
              style={({ isActive }) => ({
                textDecoration: "none",
                color: isActive ? "yellow" : "white",
                padding: "10px 20px",
              })}
              activeClassName="active"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Avatar and Menu */}
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
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
        </Box>
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
