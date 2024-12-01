import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { VISITSDATA } from "./Actions";

// Fetch all visits data
export const GET_VISITS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/appointments`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, VISITSDATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Add new visit data
export const ADD_VISIT = (visit, resetForm) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/appointments`, visit);    
    if (apiResponse) {
      dispatch(GET_VISITS());
      resetForm();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Edit existing visit data
export const EDIT_VISIT = (id, visit, handleUpdateModal) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/appointments/${id}`, visit);
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
    const apiResponse = await ApiService.delete(`/appointments/${id}`);
    console.log("API response - delete visit", apiResponse);
    if (apiResponse.status === 200) {
      dispatch(GET_VISITS());
      handleCloseMenu();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Search visitors by filter parameters
export const SEARCH_VISITS = (searchParams) => async (dispatch) => {
  try {
    const { name, inmateName, status } = searchParams;

    // Construct query string based on provided search parameters
    const query = new URLSearchParams();
    if (name) query.append("name", name);
    if (inmateName) query.append("inmateName", inmateName);
    if (status) query.append("status", status);

    const apiResponse = await ApiService.get(
      `/appointments/search?${query.toString()}`
    );

    if (apiResponse.status === 200) {
      dispatchAction(dispatch, VISITSDATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};