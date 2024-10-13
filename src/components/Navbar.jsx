// Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Tabs, Tab, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import LogoutDialog from './authentication/LogoutDialog'; // Importing LogoutDialog component

// Menu items for navigation
const menuItems = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'Task Management', value: 'task' },
  { label: 'Meal Management', value: 'meal' },
  { label: 'Visit Management', value: 'visit' },
  { label: 'Generate Report', value: 'report' }
];

const Navbar = ({ selectedTab, onTabChange }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to handle the dialog visibility
  const navigate = useNavigate(); // Hook for navigation

  // Handle logout button click (opens the dialog)
  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setOpenDialog(false); // Close the dialog
    try {
      // Call logout service
      navigate('/sign-in'); // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  return (
    <AppBar position="static" sx={{ margin: 0, display: 'flex', placeItems: 'center' }}>
      <Toolbar sx={{ width: '100%' }}>
        {/* Clickable Logo - Redirects to Dashboard */}
        <Link to="/dashboard">
          <img 
            src="/images/logo.jpg" 
            alt="Logo" 
            style={{ width: '50px', marginRight: '15px' }} 
          />
        </Link>

        {/* Tabs for Navigation */}
        <Tabs
          value={selectedTab}
          onChange={onTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ flexGrow: 1 }}
        >
          {menuItems.map((item) => (
            <Tab key={item.value} label={item.label} value={item.value} />
          ))}
        </Tabs>
        
        {/* Logout Button */}
        <Button color="inherit" onClick={handleLogoutClick}>
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
