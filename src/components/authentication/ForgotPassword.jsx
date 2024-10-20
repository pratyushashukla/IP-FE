// ForgotPassword.jsx
import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Typography,
  Alert,
} from "@mui/material";
import VerificationCode from "./VerificationCode"; // Change PasswordReset to VerificationCode

const ForgotPassword = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [verifyCodeOpen, setVerifyCodeOpen] = useState(false); // Change to manage Verification Code open state

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setEmailErrorMessage("");
    setEmailError(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/auth/forgot-password",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          setMessage("");
          handleClose();
          setVerifyCodeOpen(true); // Open VerificationCode component
        }, 2000);

        setMessage("An email with a verification code has been sent.");
      } else {
        setError(data.message || "Failed to send verification code.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (open) {
    return (
      <Dialog open={open} onClose={() => handleClose()}>
        <DialogTitle>Forgot password</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Enter your email address
          </DialogContentText>
          <OutlinedInput
            error={emailError}
            helperText={emailErrorMessage}
            autoFocus
            required
            margin="dense"
            id="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            type="email"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          {message && <Typography color="success">{message}</Typography>}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button
            variant="contained"
            type="button"
            onClick={() => handleSubmit()}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    );
  } else if (verifyCodeOpen) {
    return (
      <VerificationCode
        open={verifyCodeOpen}
        email={email}
        setVerifyOpen={setVerifyCodeOpen}
      />
    );
  } else {
    return <></>;
  }
};

export default ForgotPassword;
