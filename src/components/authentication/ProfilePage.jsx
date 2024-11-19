import * as React from "react";
import Stack from "@mui/material/Stack";
import { Box, Typography, Button, TextField } from "@mui/material";
import { EDITUSER } from "../../actions/users/ActionCreators";
import { useDispatch } from "react-redux";

const ProfilePage = () => {
  const dispatch = useDispatch();

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
          firstName: data.user.firstname || "",
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
    const { firstName, lastName, phone, address } = profile;

  // Validate phone number
  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    alert("Invalid phone number. Please enter a 10-digit phone number.");
    return;
  }

  // Validate empty fields
  if (!firstName || !lastName || !phone || !address) {
    alert("Please fill in all fields.");
    return;
  }
    const updatedProfile = {
      firstname: profile.firstName,
      lastname: profile.lastName,
      phone: profile.phone,
      address: profile.address,
    };
  
    dispatch(EDITUSER(localStorage.getItem("userId"), updatedProfile));

    setTimeout(() => {
      alert("Profile updated successfully!");
      setIsEditing({
        firstName: false,
        lastName: false,
        phone: false,
        address: false,
      });
    }, 2000);
  };

  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "white", // White background for the page
      }}
    >
      <Box
        sx={{
          backgroundColor: "#64b5f6", // Blue background for the container
          boxShadow: 6,               // Larger shadow for a more prominent look
          padding: 4,
          width: { xs: "90%", sm: "600px" },
          display: "flex",
          flexDirection: "column",
          color: "white",             // White text for readability
          textAlign: "left",          // Align text to the left for labels
          border: "2px solid #0c6fb2", // Border color matching the nav panel color
          borderRadius: "8px",         // Rounded border for a polished look
          transition: "all 0.3s ease-in-out", // Smooth transition for hover effects
          background: "linear-gradient(145deg, #1976d2, #1565c0)", // Gradient effect
          "&:hover": {
            transform: "scale(1.05)", // Slight zoom effect on hover
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)", // Bigger shadow on hover
          },
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
          Profile
        </Typography>

        {["firstName", "lastName", "phone", "address"].map((field) => (
          <Stack
            key={field}
            direction="row"
            alignItems="center"
            spacing={2}
            marginBottom={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                width: "40%",
                fontWeight: "bold",
                color: "white", // White color for labels
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1).replace("Name", " Name")}
            </Typography>
            {isEditing[field] ? (
              <TextField
                variant="outlined"
                name={field}
                value={profile[field]}
                onChange={handleChange}
                sx={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  marginLeft: 2,
                }}
                InputProps={{ style: { color: "black" } }}
              />
            ) : (
              <Typography variant="body1" sx={{ flex: 1 }}>
                {profile[field]}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => handleEdit(field)}
              sx={{
                backgroundColor: "#0d47a1",
                "&:hover": {
                  backgroundColor: "#1565c0", // Hover color
                },
              }}
            >
              {isEditing[field] ? "Edit" : "Edit"}
            </Button>
          </Stack>
        ))}

        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          marginBottom={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              width: "40%",
              fontWeight: "bold",
              color: "white", // White color for email label
            }}
          >
            Email:
          </Typography>
          <Typography variant="body1" sx={{ flex: 1 }}>
            {profile.email}
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{
            width: "100%",
            marginTop: 2,
            backgroundColor: "#0d47a1",
            "&:hover": {
              backgroundColor: "#1565c0",
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Stack>
  );
};

export default ProfilePage;
