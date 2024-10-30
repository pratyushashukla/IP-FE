import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { VISITORS_DATA } from "./Actions";

// Fetch all visitors data
export const GET_VISITORS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/visitors`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, VISITORS_DATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Add new visitor data
export const ADD_VISITOR = (visitor, onClose) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/visitors`, visitor);
    console.log("API response - create visitor", apiResponse);
    if (apiResponse) {
      dispatch(GET_VISITORS());
      onClose();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
