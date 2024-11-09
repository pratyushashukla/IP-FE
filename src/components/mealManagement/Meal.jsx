import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { GET_INMATES } from "../../actions/inmates/ActionCreators";
import { GET_MEALPLAN } from "../../actions/mealplan/ActionCreators";
import { Grid } from "@mui/material";
import MealPlan from "./MealPlan";

function TabPanel(props) {
  const dispatch = useDispatch();
  const { children, value, index, ...other } = props;

  React.useEffect(() => {
    if (value === index) {
      dispatch(GET_INMATES());
      dispatch(GET_MEALPLAN());
    }
  }, []);

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

export default function Meal() {
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
          <Tab label="Meal Plan" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <TabPanel value={value} index={0}>
            <MealPlan />
          </TabPanel>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
}
