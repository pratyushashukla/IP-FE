import React, { useState } from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LogoutDialog from './authentication/LogoutDialog'; 
import { LOGOUT } from "../actions/general/ActionCreators";

const Navbar = ({ selectedTab, onTabChange }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to handle the dialog visibility
  const dispatch = useDispatch(); // Redux dispatch hook
  const navigate = useNavigate(); // React Router hook for navigation

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setOpenDialog(false); // Close the dialog
    try {
      dispatch(LOGOUT(navigate)); // Dispatch the LOGOUT action and pass the navigate function
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  // Menu items for navigation
  const menuItems = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Task Management', value: 'task' },
    { label: 'Meal Management', value: 'meal' },
    { label: 'Visit Management', value: 'visit' },
    { label: 'Generate Report', value: 'report' },
    { label: 'User Profile', value: 'profile' }
  ];

  return (
    <AppBar position="static" sx={{ margin: 0, display: 'flex', placeItems: 'center' }}>
      <Toolbar sx={{ width: '100%' }}>
        {/* Clickable Logo - Redirects to Dashboard */}
        <NavLink to="/dashboard">
          <img 
            src="/images/logo.jpg" 
            alt="Logo" 
            style={{ width: '50px', marginRight: '15px' }} 
          />
        </NavLink>

        {/* NavLink items for navigation */}
        <nav style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.value}
              to={`/${item.value}`}
              style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? 'yellow' : 'white',
                padding: '10px 20px',
              })}
              activeClassName="active"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <Button color="inherit" onClick={() => setOpenDialog(true)}>
          Logout
        </Button>
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
