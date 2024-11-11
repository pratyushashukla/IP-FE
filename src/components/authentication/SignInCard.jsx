import * as React from "react";
import {
  CssBaseline,
  FormLabel,
  FormControl,
  Stack,
  Box,
  Typography,
  TextField,
  Grid,
  Link as MuiLink,
  Button,
  Alert,
  Card as MuiCard,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { SitemarkIcon } from "./CustomIcons";
import { useDispatch } from "react-redux";
import { LOGIN } from "../../actions/general/ActionCreators";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignInCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [serverError, setServerError] = React.useState(""); // State to handle server error messages

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = React.useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateInputs();

    if (isValid) {
      const data = new FormData(event.currentTarget);
      const obj = Object.fromEntries(data);

      for (const key in obj) {
        let trimmedValue = obj[key].trim();
        if (trimmedValue.length === 0) {
          delete obj[key];
        }
      }

      try {
        // Dispatch the LOGIN action and await the response
        const response = await dispatch(LOGIN(obj, formRef, navigate));
        
        // Assuming the response contains a property `error` when login fails
        if (response.error) {
          setServerError(response.error); // Set the server error message
        } else {
          setServerError(""); // Clear any previous server error message
        }
      } catch (error) {
        // Handle unexpected errors, if any
        setServerError("Invalid E-mail or Password.");
      }
    }
  };

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign in
      </Typography>
      {serverError && (
        <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
          {serverError}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
        ref={formRef}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? "error" : "primary"}
            sx={{ ariaLabel: "email" }}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "baseline" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? "error" : "primary"}
          />
        </FormControl>
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Sign in
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <span>
            <Link to="/sign-up">
              <MuiLink
                variant="body2"
                sx={{ alignSelf: "center", cursor: "pointer" }}
              >
                Sign up
              </MuiLink>
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
