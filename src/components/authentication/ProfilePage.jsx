import * as React from "react";
import Stack from "@mui/material/Stack";
import { Box, Typography, Button, TextField } from "@mui/material";

const ProfilePage = () => {
  const [profile, setProfile] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    email: "",
  });

  const [isEditing, setIsEditing] = React.useState({
    firstName: false,
    lastName: false,
    phone: false,
    address: false,
  });

  // Fetch profile data
  React.useEffect(() => {
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authtoken="))
      ?.split("=")[1];
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/users/${localStorage.getItem(
            "userId"
          )}`,
          {
            headers: {
              authtoken: authToken,
            },
          }
        );
        const data = await response.json();
        setProfile({
          firstName: data.user.firstname || "", // Default to empty string if null/undefined
          lastName: data.user.lastname || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
          email: data.user.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
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
    alert("Profile updated successfully!");
    setIsEditing({
      firstName: false,
      lastName: false,
      phone: false,
      address: false,
    });
  };

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 6, sm: 12 },
        p: { xs: 2, sm: 4 },
        m: "auto",
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          backgroundColor: "hsl(220, 35%, 97%)",
          borderRadius: 2,
          boxShadow: 3,
          padding: 4,
          width: { xs: "90%", sm: "600px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Profile
        </Typography>
        {["firstName", "lastName", "phone", "address"].map((field) => (
          <Stack
            key={field}
            direction="row"
            alignItems="center"
            spacing={2}
            marginBottom={2}
          >
            <Typography
              variant="body1"
              sx={{ width: "30%", fontWeight: "bold" }}
            >
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace("Name", " Name")}
              :
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
              <Typography variant="body1" sx={{ flex: 1 }}>
                {profile[field]}
              </Typography>
            )}
            <Button variant="contained" onClick={() => handleEdit(field)}>
              {isEditing[field] ? "Editing" : "Edit"}
            </Button>
          </Stack>
        ))}
        <Stack direction="row" alignItems="center" spacing={2} marginBottom={2}>
          <Typography variant="body1" sx={{ width: "30%", fontWeight: "bold" }}>
            Email:
          </Typography>
          <Typography variant="body1" sx={{ flex: 1 }}>
            {profile.email}
          </Typography>{" "}
          {/* Display email as plain text */}
        </Stack>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ width: "100%", marginTop: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Stack>
  );
};

export default ProfilePage;
