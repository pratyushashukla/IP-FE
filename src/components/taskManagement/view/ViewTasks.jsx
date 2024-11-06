import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  styled,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_TASK_DATA,
  GET_TASKS_DATA,
  GET_FILTERED_TASKS
} from "../../../actions/tasks/ActionCreators";
import { formatDate } from "../../common/CommonFunctions";

// Function to manipulate task data
const manipulateTasksData = (tasks) => {
  return tasks.map((task) => ({
    ...task,
    dueDate: formatDate(task.dueDate), // Format the due date
    isCompleted: task.status === "Completed", // Use the status field to determine if the task is completed
  }));
};

// Styled components for custom styling
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  margin: "20px auto",
  maxWidth: "1200px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${TableCell.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const statusColors = (theme) => ({
  'Pending': theme.palette.error.main,
  'In Progress': theme.palette.warning.main,
  'Completed': theme.palette.success.main,
});

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: statusColors(theme)[status],
  color: theme.palette.common.white,
  fontWeight: "bold",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1),
  fontSize: theme.typography.pxToRem(12),
  border: `1px solid ${theme.palette.primary.main}`,
  boxShadow: theme.shadows[4]
}));

const ViewTasks = ({ handleUpdateModal }) => {
  const dispatch = useDispatch();
  const tasksData = useSelector((state) => state.TasksReducer.tasksData);
  const filteredTasksData = useSelector((state) => state.TasksReducer.filteredTasksData);
  const isLoading = useSelector((state) => state.TasksReducer.isLoading);
  const error = useSelector((state) => state.TasksReducer.error);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]); // State for filtered tasks
  const [statusFilter, setStatusFilter] = useState(""); // Track selected status
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    dispatch(GET_TASKS_DATA());
  }, []);

  useEffect(() => {
    if (tasksData) {
      const manipulatedTasks = manipulateTasksData(tasksData);
      setTasks(manipulatedTasks);
      setFilteredTasks(manipulatedTasks); // Initialize with all tasks
    }
  }, [tasksData]);

  useEffect(() => {
    if (filteredTasksData) {
      setFilteredTasks(filteredTasksData);
    }
  }, [filteredTasksData]);

  const handleFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);
  
    if (selectedStatus) {
      const filteredTasks = tasks.filter((task) => task.status === selectedStatus);
      setFilteredTasks(filteredTasks);
    } else {
      setFilteredTasks(tasks);
    }
  };

  const handleOpenMenu = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMenu = () => {
    console.log("Closing menu");
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    handleUpdateModal(selectedTaskId);
  };

  const handleDelete = () => {
    const updatedTasks = tasks.filter((task) => task._id !== selectedTaskId);
    setTasks(updatedTasks);
    setFilteredTasks(filteredTasks.filter((task) => task._id !== selectedTaskId));
    dispatch(DELETE_TASK_DATA(selectedTaskId, handleCloseMenu));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box mt={4}>
      {/* Filter Dropdown */}
      <FormControl
        sx={{
          minWidth: 200,
          marginBottom: 2,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <InputLabel sx={{ color: theme.palette.text.primary }}>
          Status
        </InputLabel>
        <Select
          value={statusFilter}
          onChange={handleFilterChange}
          sx={{ backgroundColor: theme.palette.background.paper }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </FormControl>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Due Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ height: tasks.length > 0 ? "auto" : "300px" }}>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <StyledTableRow key={task._id} hover>
                  <StyledTableCell>{task.title}</StyledTableCell>
                  <StyledTableCell>{task.description}</StyledTableCell>
                  <StyledTableCell>{formatDate(task.dueDate)}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip status={task.status} label={task.status} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Options">
                      <IconButton onClick={(e) => handleOpenMenu(e, task._id)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={5} align="center">
                  No tasks found
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List sx={{ cursor: "pointer" }}>
            <ListItem button onClick={handleEdit}>
              <ListItemText primary="Details" />
            </ListItem>
            <ListItem button onClick={handleDelete}>
              <ListItemText primary="Delete" />
            </ListItem>
          </List>
        </Popover>
      </StyledTableContainer>
    </Box>
  );
};

export default ViewTasks;
