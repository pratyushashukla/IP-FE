import * as React from "react";

import { styled } from "@mui/material/styles";

import { SitemarkIcon } from "./CustomIcons";
import { Link, useNavigate } from "react-router-dom";
import { SIGNUP } from "../../actions/general/ActionCreators";
import { useDispatch } from "react-redux";
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
  MenuItem,
  Button,
  Alert,
  Card as MuiCard,
} from "@mui/material";

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

export default function SignUpCard() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [phoneError, setPhoneError] = React.useState(false); // phone error state
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState(""); // phone error message

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = React.useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate all fields before submission
    if (!validateInputs()) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const obj = Object.fromEntries(data);

    for (const key in obj) {
      let trimmedValue = obj[key].trim();
      if (trimmedValue.length === 0) {
        delete obj[key];
      }
    }

    dispatch(SIGNUP(obj, formRef, navigate));
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const phone = document.getElementById("phone");

    let isValid = true;

    // Phone validation: Phone number should be 10 digits
    if (phone.value.length > 10) {
      setPhoneError(true);
      setPhoneErrorMessage("Phone number cannot be more than 10 digits.");
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage("");
    }

    // Email validation
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // Password validation
    const passwordValue = password.value;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,./\\|`~\-]).{6,}$/;

    if (!passwordValue || passwordValue.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else if (!passwordRegex.test(passwordValue)) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must contain at least one uppercase letter, one special symbol, and one number.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
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
        Sign up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
        }}
        ref={formRef}
      >
        {/* First Name and Last Name */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <TextField
                id="firstName"
                name="firstname"
                placeholder="John"
                autoComplete="given-name"
                required
                fullWidth
                variant="outlined"
                autoFocus
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <TextField
                id="lastName"
                name="lastname"
                placeholder="Doe"
                autoComplete="family-name"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Username and Email */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                name="username"
                placeholder="john_doe"
                autoComplete="username"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                sx={{ ariaLabel: "email" }}
              />
            </FormControl>
          </Grid>
        </Grid>

        {/* Password */}
        <Grid container spacing={2}>
          <Grid item xs={24} sm={12}>
            <FormControl fullWidth>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <FormLabel htmlFor="password">Password</FormLabel>
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
          </Grid>
        </Grid>

        {/* Phone and Address */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="phone">Phone</FormLabel>
              <TextField
                id="phone"
                name="phone"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                required
                fullWidth
                variant="outlined"
                error={phoneError}
                helperText={phoneErrorMessage}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                id="address"
                name="address"
                placeholder="123 Main St"
                autoComplete="street-address"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </Grid>

        <Button type="submit" fullWidth variant="contained">
          Sign up
        </Button>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span>
            <Link to="/sign-in">
              <MuiLink variant="body2" sx={{ alignSelf: "center", cursor: "pointer" }}>
                Sign in
              </MuiLink>
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
