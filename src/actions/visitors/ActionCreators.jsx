import ApiService, {
  handleNetworkError,
  dispatchAction,
} from "../../middleware/ApiService";
import { setVisitorsData } from "./Actions";

// Fetch all visitors data
export const GET_VISITORS = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/visitors`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setVisitorsData, apiResponse.data);
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

// Update existing visitor data
export const UPDATE_VISITOR =
  (visitor, handleUpdateModal) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.patch(
        `/visitors/${visitor._id}`,
        visitor
      );
      if (apiResponse) {
        dispatch(GET_VISITORS());
        handleUpdateModal();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

// Delete visitor data
export const DELETE_VISITOR = (id, handleCloseMenu) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/visitors/${id}`);
    console.log("API response - delete visitor", apiResponse);
    if (apiResponse.status === 200) {
      dispatch(GET_VISITORS());
      handleCloseMenu();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Search visitors by filter parameters
export const SEARCH_VISITORS = (searchParams) => async (dispatch) => {
  try {
    const { name, inmateName, contactNumber } = searchParams;

    // Construct query string based on provided search parameters
    const query = new URLSearchParams();
    if (name) query.append("name", name);
    if (inmateName) query.append("inmateName", inmateName);
    if (contactNumber) query.append("contactNumber", contactNumber);

    const apiResponse = await ApiService.get(
      `/visitors/search?${query.toString()}`
    );

    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setVisitorsData, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
