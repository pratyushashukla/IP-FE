import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Toolbar,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import {
  ADD_INMATE,
  GET_INMATES,
  EDIT_INMATE,
  DELETE_INMATE,
} from "../../actions/inmates/ActionCreators";
import InmateForm from "./InmateForm";
import { useState, useEffect } from "react";

function Inmate() {
  const dispatch = useDispatch();
  const inmates = useSelector((state) => state.InmatesReducer.inmatesData);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedInmate, setSelectedInmate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenModal = () => {
    setSelectedInmate(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (inmate) => {
    setSelectedInmate(inmate);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInmate(null);
  };

  const handleCreateInmate = (inmate) => {
    dispatch(ADD_INMATE(inmate, handleCloseModal));
  };

  const handleEditInmate = (inmate) => {
    dispatch(EDIT_INMATE(selectedInmate._id, inmate, handleCloseModal));
  };

  const handleDeleteInmate = (id) => {
    dispatch(DELETE_INMATE(id));
  };

  const openMenu = (event, inmate) => {
    setAnchorEl(event.currentTarget);
    setSelectedInmate(inmate);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedInmate(null); // Reset selected inmate after menu close
  };

  useEffect(() => {
    dispatch(GET_INMATES());
  }, [dispatch]);
  return (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 2,
        }}
      >
        <h2>Inmates</h2>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add Inmate
        </Button>
      </Toolbar>

      <TextField
        label="Search Inmates"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inmates
            .filter((inmate) =>
              `${inmate.firstName} ${inmate.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((inmate) => (
              <TableRow key={inmate._id}>
                <TableCell>{inmate.firstName}</TableCell>
                <TableCell>{inmate.lastName}</TableCell>
                <TableCell>{inmate.status}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => openMenu(e, inmate)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={
                      Boolean(anchorEl) && selectedInmate?._id === inmate._id
                    }
                    onClose={closeMenu}
                  >
                    <MenuItem onClick={() => handleOpenEditModal(inmate)}>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteInmate(inmate._id)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <InmateForm
          open={isModalOpen}
          inmate={selectedInmate}
          onClose={handleCloseModal}
          onSave={selectedInmate ? handleEditInmate : handleCreateInmate}
        />
      )}
    </div>
  );
}

export default Inmate;
