import ApiService, {
    handleNetworkError,
    dispatchAction,
  } from "../../middleware/ApiService";
  import { setAllergiesData } from "./Actions";
  
  // Fetch all allergies
  export const GET_ALLERGIES = () => async (dispatch) => {
    try {
      const apiResponse = await ApiService.get(`/allergies`);
      if (apiResponse.status === 200) {
        dispatchAction(dispatch, setAllergiesData, apiResponse.data);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  
  // Add new allergy
  export const ADD_ALLERGY = (allergy, onClose) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.post(`/allergies`, allergy);
      console.log("API response - create allergy", apiResponse);
      if (apiResponse.status === 201) {
        dispatch(GET_ALLERGIES());
        onClose();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  
  // Update existing allergy
  export const UPDATE_ALLERGY = (allergy, handleUpdateModal) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.patch(`/allergies/${allergy._id}`, allergy);
      if (apiResponse.status === 200) {
        dispatch(GET_ALLERGIES());
        handleUpdateModal();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  
  // Delete allergy
  export const DELETE_ALLERGY = (id, handleCloseMenu) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.delete(`/allergies/${id}`);
      console.log("API response - delete allergy", apiResponse);
      if (apiResponse.status === 200) {
        dispatch(GET_ALLERGIES());
        handleCloseMenu();
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  
  // Get allergy by ID
  export const GET_ALLERGY_BY_ID = (id) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.get(`/allergies/${id}`);
      if (apiResponse.status === 200) {
        dispatchAction(dispatch, setAllergiesData, apiResponse.data);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  
  // Fetch allergies with pagination
  export const GET_ALLERGIES_WITH_PAGINATION = (page, limit) => async (dispatch) => {
    try {
      const apiResponse = await ApiService.get(`/allergies?page=${page}&limit=${limit}`);
      if (apiResponse.status === 200) {
        dispatchAction(dispatch, setAllergiesData, apiResponse.data);
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };
  