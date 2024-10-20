import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getSignInSideTheme from './theme/getSignInSideTheme';
import TemplateFrame from './TemplateFrame';
import { Box, Typography, Button, TextField } from '@mui/material';

const ProfilePage = () => {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const profileTheme = createTheme(getSignInSideTheme(mode));
//
  const [profile, setProfile] = React.useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '' 
  });

  const [isEditing, setIsEditing] = React.useState({
    firstName: false,
    lastName: false,
    phone: false,
    address: false
  });

  // Effect to check the preferred mode
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

  // Fetch profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const data = await response.json();
        setProfile({
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ')[1],
          phone: data.phone,
          address: `${data.address.street}, ${data.address.city}, ${data.address.zipcode}`,
          email: data.email // Add email to the profile state
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = (field) => {
    setIsEditing({ ...isEditing, [field]: true });
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
    setIsEditing({
      firstName: false,
      lastName: false,
      phone: false,
      address: false
    });
  };

  return (
    <TemplateFrame 
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? profileTheme : defaultTheme}>
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
              <Typography variant="h4" align="center" gutterBottom>Profile</Typography>
              {['firstName', 'lastName', 'phone', 'address'].map((field) => (
                <Stack key={field} direction="row" alignItems="center" spacing={2} marginBottom={2}>
                  <Typography variant="body1" sx={{ width: '30%', fontWeight: 'bold' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1).replace('Name', ' Name')}:
                  </Typography>
                  {isEditing[field] ? (
                    <TextField
                      variant="outlined"
                      name={field}
                      value={profile[field]}
                      onChange={handleChange}
                      sx={{ flex: 1 }}
                    />
                  ) : (
                    <Typography variant="body1" sx={{ flex: 1 }}>{profile[field]}</Typography>
                  )}
                  <Button variant="contained" onClick={() => handleEdit(field)}>
                    {isEditing[field] ? 'Editing' : 'Edit'}
                  </Button>
                </Stack>
              ))}
              <Stack direction="row" alignItems="center" spacing={2} marginBottom={2}>
                <Typography variant="body1" sx={{ width: '30%', fontWeight: 'bold' }}>
                  Email:
                </Typography>
                <Typography variant="body1" sx={{ flex: 1 }}>{profile.email}</Typography> {/* Display email as plain text */}
              </Stack>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ width: '100%', marginTop: 2 }}>
                Save Changes
              </Button>
            </Box>
          </Stack>
        </Stack>
      </ThemeProvider>
    </TemplateFrame>
  );
};

export default ProfilePage;
