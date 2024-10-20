import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const PasswordReset = ({ open, setResetPassOpen, setVerifyOpen }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async () => {
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/reset-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword, code: localStorage.getItem("code") }),
      });

      if (response.ok) {
        localStorage.removeItem("code");
        setTimeout(() => {
          setResetPassOpen(false);
          setVerifyOpen(false);
          navigate("/sign-in"); // Use navigate to go to the login page
        }, 2000);
      } else {
        setError("Failed to reset password. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <Dialog open={open} onClose={() => setResetPassOpen(false)}>
      <DialogTitle>Reset Your Password</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
        <DialogContentText>Enter your new password below.</DialogContentText>
        <OutlinedInput
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          required
        />
        <OutlinedInput
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm New Password"
          required
        />
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={() => setResetPassOpen(false)}>Cancel</Button>
        <Button variant="contained" type="button" onClick={() => handleSubmit()}>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordReset;
