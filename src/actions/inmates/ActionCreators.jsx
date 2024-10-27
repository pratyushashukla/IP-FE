import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { INMATESDATA } from "./Actions";

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
      handleDialog(false); // Close dialog after editing
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETE_INMATE = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/inmates/${id}`);
    if (apiResponse) {
      dispatch(GET_INMATES()); // Refresh inmates after deletion
    }
  } catch (error) {
    handleNetworkError(error);
  }
};