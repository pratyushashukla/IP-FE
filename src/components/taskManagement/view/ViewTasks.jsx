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
  Menu,
  MenuItem,
  tableCellClasses
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FilterListIcon from "@mui/icons-material/FilterList";
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
    dueDate: formatDate(task.dueDate),
    isCompleted: task.status === "Completed",
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
  const isLoading = useSelector((state) => state.TasksReducer.isLoading);
  const error = useSelector((state) => state.TasksReducer.error);

  const theme = useTheme();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null); // Anchor for filter menu

  useEffect(() => {
    dispatch(GET_TASKS_DATA());
  }, []);

  useEffect(() => {
    if (tasksData) {
      const manipulatedTasks = manipulateTasksData(tasksData);
      setTasks(manipulatedTasks);
      setFilteredTasks(manipulatedTasks);
    }
  }, [tasksData]);

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (selectedStatus) => {
    setStatusFilter(selectedStatus);
    handleFilterClose();

    if (selectedStatus) {
      const filtered = tasks.filter((task) => task.status === selectedStatus);
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks(tasks);
    }
  };

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
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Due Date</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">
                <Tooltip title="Filter by Status">
                  <IconButton onClick={handleFilterClick} sx={{padding: "0px"}}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                >
                  <MenuItem onClick={() => handleFilterChange("")}>All</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("Pending")}>Pending</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("In Progress")}>In Progress</MenuItem>
                  <MenuItem onClick={() => handleFilterChange("Completed")}>Completed</MenuItem>
                </Menu>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
