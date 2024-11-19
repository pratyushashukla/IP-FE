import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { INMATESDATA, INMATEBYID } from "./Actions";

export const GET_INMATES = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/inmates`);
    if (apiResponse) {
      dispatchAction(dispatch, INMATESDATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const GET_INMATE_BY_ID = (inmateId) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/inmates/${inmateId}`);
    if (apiResponse) {
      dispatchAction(dispatch, INMATEBYID, apiResponse.data.result);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const ADD_INMATE = (inmate, handleDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/inmates`, inmate);
    if (apiResponse) {
      dispatch(GET_INMATES()); // Refresh inmates after adding
      handleDialog(false); // Close dialog after adding
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const EDIT_INMATE = (id, inmate, handleDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/inmates/${id}`, inmate);
    if (apiResponse) {
      dispatch(GET_INMATES()); // Refresh inmates after editing
      handleDialog(); // Close dialog after editing
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETE_INMATE = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/inmates/${id}`);
  
    if (apiResponse.status === 200) {
      dispatch(GET_INMATES()); // Refresh the inmate list after deletion
    } else {
      // If the response is not 200, show the backend message
      alert(apiResponse.data.message || "An error occurred while deleting the inmate.");
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      // Catching 400 error and displaying the backend message
      alert(error.response.data.message || "Bad Request: This inmate is associated with other data.");
    } else {
      handleNetworkError(error); // For other errors (network, 500, etc.)
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Show the message from the backend
      } else {
        alert("An unexpected error occurred.");
      }
    }
  }
};
