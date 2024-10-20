import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button, TextField } from '@mui/material';
import TemplateFrame from './TemplateFrame';
import getSignInSideTheme from './theme/getSignInSideTheme'; 

const FormComponent = () => {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const formTheme = createTheme(getSignInSideTheme(mode));

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme(prev => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    let valid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Name is required.';
      valid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email.';
      valid = false;
    }

    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(formData.phone)) {
      tempErrors.phone = 'Please enter a valid phone number.';
      valid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required.';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Form submitted successfully!');
    
    }
  };

  return (
    <TemplateFrame 
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? formTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          component="main"
          sx={{
            justifyContent: 'space-between',
            height: { xs: 'auto', md: '100%' },
            width: "100vw",
            backgroundColor: (theme) => theme.palette.background.default,
            backgroundSize: 'cover',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 6, sm: 12 },
              p: { xs: 2, sm: 4 },
              m: 'auto',
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 3,
                padding: 4,
                width: { xs: '90%', sm: '600px' },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h4" align="center" gutterBottom>Contact Form</Typography>
              {['name', 'email', 'phone', 'message'].map((field) => (
                <Stack key={field} direction="row" alignItems="center" spacing={2} marginBottom={2}>
                  <Typography variant="body1" sx={{ width: '30%', fontWeight: 'bold' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </Typography>
                  <TextField
                    variant="outlined"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    multiline={field === 'message'}
                    rows={field === 'message' ? 4 : 1}
                    sx={{ flex: 1 }}
                    error={!!errors[field]}
                    helperText={errors[field]}
                    InputProps={{
                      style: {
                        padding: '10px', // Adjust padding if needed
                        height: 'auto' // Set height to auto
                      }
                    }}
                  />
                </Stack>
              ))} 
              <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ width: '100%', marginTop: 2 }}>
                Submit
              </Button>
            </Box>
          </Stack>
        </Stack>
      </ThemeProvider>
    </TemplateFrame>
  );
};

export default FormComponent;
