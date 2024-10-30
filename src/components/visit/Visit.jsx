import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function Visit() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // Full viewport height
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRight: 1,
          borderColor: "divider",
          width: "auto", // Fixed width for the tabs area
        }}
      >
        <Tabs
          orientation="vertical"
          // variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTab-root": {
              outline: "none", // Remove default outline
            },
            "& .Mui-focusVisible": {
              outline: "none", // Remove focus visible outline
            },
          }}
        >
          <Tab label="schedule an appointment" {...a11yProps(0)} />
          <Tab label="appointments" {...a11yProps(1)} />
          <Tab label="visitors" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        Schedule an Appointment
      </TabPanel>
      <TabPanel value={value} index={1}>
        Appointments
      </TabPanel>
      <TabPanel value={value} index={2}>
        Visitors
      </TabPanel>
    </Box>
  );
}
