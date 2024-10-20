import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../actions/general/ActionCreators';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inactivityTimeout = useRef(null); // Timeout for inactivity (30 minutes)
  const logoutTimeout = useRef(null); // Timeout for auto-logout after 5 seconds
  const [showDialog, setShowDialog] = useState(false); // State to control dialog visibility

  const logout = () => {
    // Dispatch the LOGOUT action
    dispatch(LOGOUT(navigate));
  };

  const resetInactivityTimeout = () => {
    // Clear any existing inactivity timeouts
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    // Clear the logout timer if it was set
    if (logoutTimeout.current) {
      clearTimeout(logoutTimeout.current);
    }

    // Reset the inactivity timer for 30 minutes
    setShowDialog(false); // Hide the dialog when activity is detected
    inactivityTimeout.current = setTimeout(() => {
      setShowDialog(true); // Show the dialog after 30 minutes of inactivity

      // Set a timeout for auto-logout after 5 seconds if the user doesn't respond
      logoutTimeout.current = setTimeout(logout, 5000); // 5 seconds for auto-logout
    }, 5 * 1000); // 30 minutes inactivity
  };

  useEffect(() => {
    // Event listeners to detect user activity
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('keypress', resetInactivityTimeout);

    // Initialize the inactivity timer on mount
    resetInactivityTimeout();

    return () => {
      // Cleanup event listeners and clear timeouts on unmount
      window.removeEventListener('mousemove', resetInactivityTimeout);
      window.removeEventListener('keypress', resetInactivityTimeout);
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      if (logoutTimeout.current) {
        clearTimeout(logoutTimeout.current);
      }
    };
  }, [dispatch, navigate]);

  return { showDialog, logout, resetInactivityTimeout }; // Return dialog state and control functions
};

export default useAutoLogout;
