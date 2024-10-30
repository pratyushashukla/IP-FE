import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { VISITS_DATA } from "./Actions";

// Fetch all visits data
export const GET_VISITS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/visits`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, VISITS_DATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Add new visit data
export const ADD_VISIT = (visit, onClose) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/visits`, visit);
    console.log("API response - create visit", apiResponse);
    if (apiResponse) {
      dispatch(GET_VISITS());
      onClose();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Edit existing visit data
export const EDIT_VISIT = (visit, handleUpdateModal) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/visits/${visit._id}`, visit);
    if (apiResponse) {
      dispatch(GET_VISITS());
      handleUpdateModal();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Delete visit data
export const DELETE_VISIT = (id, handleCloseMenu) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/visits/${id}`);
    console.log("API response - delete visit", apiResponse);
    if (apiResponse.status === 200) {
      dispatch(GET_VISITS());
      handleCloseMenu();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
