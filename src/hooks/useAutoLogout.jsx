import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { LOGOUT } from '../actions/general/ActionCreators';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inactivityTimeout = useRef(null); // useRef to persist timeout across renders

  const logout = () => {
    // Dispatch the LOGOUT action
    dispatch(LOGOUT(navigate));
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(logout, 30 * 60 * 1000); // 30 minutes inactivity
  };

  useEffect(() => {
    // Event listeners to detect user activity
    window.addEventListener('mousemove', resetInactivityTimeout);
    window.addEventListener('keypress', resetInactivityTimeout);

    // Initialize the inactivity timer on mount
    resetInactivityTimeout();

    return () => {
      // Cleanup event listeners and clear timeout on unmount
      window.removeEventListener('mousemove', resetInactivityTimeout);
      window.removeEventListener('keypress', resetInactivityTimeout);
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [dispatch, navigate]); // Add dispatch and navigate as dependencies

  return null; // No UI component returned
};

export default useAutoLogout;
