import ApiService, {
  handleNetworkError,
  dispatchAction,
} from "../../middleware/ApiService";
import { setMealPlanData } from "./Actions";

// Fetch all meal plans
export const GET_MEALPLAN = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/meals`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setMealPlanData, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Fetch meal plans with pagination
export const GET_MEALPLANS_WITH_PAGINATION = (page, limit) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/meals?page=${page}&limit=${limit}`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setMealPlanData, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Add new meal plan
export const ADD_MEALPLAN = (mealPlan, onClose) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/meals`, mealPlan);
    console.log("API response - create meal plan", apiResponse);
    if (apiResponse.status === 201) {
      dispatch(GET_MEALPLAN());
      onClose();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Update existing meal plan
export const UPDATE_MEALPLAN = (mealPlan, handleUpdateModal) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/meals/${mealPlan._id}`, mealPlan);
    if (apiResponse.status === 200) {
      dispatch(GET_MEALPLAN());
      handleUpdateModal();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Delete meal plan
export const DELETE_MEALPLAN = (id, handleCloseMenu) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/meals/${id}`);
    console.log("API response - delete meal plan", apiResponse);
    if (apiResponse.status === 200) {
      dispatch(GET_MEALPLAN());
      handleCloseMenu();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Search meal plans by filter parameters
export const SEARCH_MEALPLAN = (searchParams) => async (dispatch) => {
  try {
    const { mealType, inmateName, date } = searchParams;

    // Construct query string based on provided search parameters
    const query = new URLSearchParams();
    if (mealType) query.append("mealType", mealType);
    if (inmateName) query.append("inmateName", inmateName);

    const apiResponse = await ApiService.get(`/meals/search?${query.toString()}`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setMealPlanData, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Search meal plans with pagination
export const SEARCH_MEALPLAN_WITH_PAGINATION = (searchParams, page = 1, limit = 10) => async (dispatch) => {
  try {
    const { mealType, inmateName, date } = searchParams;
    const query = new URLSearchParams();
    if (mealType) query.append("mealType", mealType);
    if (inmateName) query.append("inmateName", inmateName);
    if (date) query.append("date", date);

    const apiResponse = await ApiService.get(`/meals/search?${query.toString()}&page=${page}&limit=${limit}`);
    if (apiResponse.status === 200) {
      dispatchAction(dispatch, setMealPlanData, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

// Download meal plan PDF
export const DOWNLOAD_MEALPLAN = (id) => async () => {
  try {
    const response = await ApiService.get(`/meals/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MealPlan_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    handleNetworkError(error);
  }
};

// Email meal plan PDF
export const EMAIL_MEALPLAN = (id, email) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/meals/${id}/email`, { email });
    if (apiResponse.status === 200) {
      console.log("Email sent successfully");
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
