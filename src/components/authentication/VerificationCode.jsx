// VerificationCode.jsx
import React, { useEffect, useState } from "react";
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

import axios from "axios";
import PasswordReset from "./PasswordReset";

const VerificationCode = ({ open, email, setVerifyOpen }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // 60 seconds countdown
  const [resendMessage, setResendMessage] = useState("");

  const [resetPassOpen, setResetPassOpen] = useState(false);

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // Enable resend after the timer ends
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleSubmit = async () => {
    setError("");
    setResendMessage("");
    localStorage.setItem("code", code);

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/verify-code", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          setResetPassOpen(true); // Redirect to PasswordReset
          setResendMessage("");
        }, 2000);
        setResendMessage("Code Verified");
      } else {
        setError(data.message || "Invalid or expired code.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    try {
      const response = await axios.patch("http://localhost:3000/api/v1/auth/resend-code", {
        email: email,
      });
      setResendMessage(response.data.message);
      setIsResendDisabled(true); // Disable resend button again after successful resend
    } catch (err) {
      setError("Error resending verification code. Please try again.");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      {resetPassOpen ? (
        <PasswordReset open={resetPassOpen} email={email} setResetPassOpen={setResetPassOpen} setVerifyOpen = {setVerifyOpen}/>
      ) : (
        <Dialog open={open} onClose={() => setVerifyOpen(false)}>
          <DialogTitle>Enter Verification Code</DialogTitle>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <DialogContentText>
              Enter the verification code sent to your account&apos;s email address.
            </DialogContentText>
            <OutlinedInput
              label="Verification Code"
              variant="outlined"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              margin="dense"
              id="code"
              name="code"
              placeholder="XXXXXX"
            />
            {isResendDisabled && (
              <Typography variant="body2" color="textSecondary">
                You can resend the code in {timer} seconds.
              </Typography>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {resendMessage && <Typography color="success">{resendMessage}</Typography>}
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={() => setVerifyOpen(false)}>Cancel</Button>
            <Button variant="contained" type="button" onClick={() => handleSubmit()}>
              Continue
            </Button>
            <Button
              variant="outlined"
              type="button"
              disabled={isResendDisabled}
              onClick={() => handleResendCode()}
            >
              Resend
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default VerificationCode;
