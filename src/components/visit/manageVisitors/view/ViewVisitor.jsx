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
  Box,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { GET_VISITORS_DATA, DELETE_VISITOR_DATA } from "../../actions/visitors/ActionCreators";

const ViewVisitor = ({ handleUpdateModal }) => {
  const dispatch = useDispatch();
  const visitorsData = useSelector((state) => state.VisitorsReducer.visitorsData);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);

  useEffect(() => {
    dispatch(GET_VISITORS_DATA());
  }, [dispatch]);

  const handleOpenMenu = (event, visitorId) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitorId(visitorId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedVisitorId(null);
  };

  const handleDelete = () => {
    dispatch(DELETE_VISITOR_DATA(selectedVisitorId, handleCloseMenu));
  };

  return (
    <Box mt={4}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visitorsData.length > 0 ? (
              visitorsData.map((visitor) => (
                <TableRow key={visitor._id}>
                  <TableCell>{visitor.firstname}</TableCell>
                  <TableCell>{visitor.lastname}</TableCell>
                  <TableCell>{visitor.contactNumber}</TableCell>
                  <TableCell>{visitor.relationship}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Options">
                      <IconButton
                        onClick={(e) => handleOpenMenu(e, visitor._id)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No visitors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleCloseMenu}
        >
          <List>
            <ListItem button onClick={() => handleUpdateModal(selectedVisitorId)}>
              <ListItemText primary="Edit" />
            </ListItem>
            <ListItem button onClick={handleDelete}>
              <ListItemText primary="Delete" />
            </ListItem>
          </List>
        </Popover>
      </TableContainer>
    </Box>
  );
};

export default ViewVisitor;
