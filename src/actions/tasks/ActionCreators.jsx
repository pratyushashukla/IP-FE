import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { TASKSDATA } from "./Actions";

export const GET_TASKS_DATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/tasks`);
    if (apiResponse.status == 200) {
      dispatchAction(dispatch, TASKSDATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETE_TASKS = (id, handleCloseMenu) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/tasks/${id}`);
    console.log("apiResponse",apiResponse);
    if (apiResponse.status == 200) {
      dispatch(GET_TASKS_DATA());
      handleCloseMenu();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

