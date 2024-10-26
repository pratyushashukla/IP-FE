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
  tableCellClasses,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_TASK_DATA,
  GET_TASKS_DATA,
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
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
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

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor:
    status === "Completed"
      ? theme.palette.success.main
      : theme.palette.warning.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

const ViewTasks = ({ handleUpdateModal }) => {
  const dispatch = useDispatch();
  const tasksData = useSelector((state) => state.TasksReducer.tasksData);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // Fetch tasks data from API when the component mounts
  useEffect(() => {
    dispatch(GET_TASKS_DATA());
  }, []);

  // Update tasks state after fetching data and apply manipulation
  useEffect(() => {
    if (tasksData) {
      setTasks(manipulateTasksData(tasksData));
    }
  }, [tasksData]);

  const handleOpenMenu = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleCloseMenu = () => {
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
    dispatch(DELETE_TASK_DATA(selectedTaskId, handleCloseMenu));
  };

  return (
    <Box mt={4}>
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
            {" "}
            {/* Adjust height as needed */}
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <StyledTableRow key={task.id} hover>
                  <StyledTableCell>{task.title}</StyledTableCell>
                  <StyledTableCell>{task.description}</StyledTableCell>
                  <StyledTableCell>{task.dueDate}</StyledTableCell>
                  <StyledTableCell>
                    <StatusChip
                      status={
                        task.status == "Completed"
                          ? "Completed"
                          : task.status == "In Progress"
                          ? "In Progress"
                          : "Pending"
                      }
                      label={
                        task.status == "Completed"
                          ? "Completed"
                          : task.status == "In Progress"
                          ? "In Progress"
                          : "Pending"
                      }
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Tooltip title="Options">
                      <IconButton
                        onClick={(e) => {
                          handleOpenMenu(e, task._id);
                        }}
                      >
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
