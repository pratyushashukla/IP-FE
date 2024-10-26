import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { TASKSDATA } from "./Actions";

export const GET_TASKS_DATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/tasks`);
    if (apiResponse) {
      dispatchAction(dispatch, TASKSDATA, apiResponse.data);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const ADD_TASK_DATA = (task, onClose) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/tasks`, task);
    console.log("apiresponse create task", apiResponse);
    if (apiResponse) {
      dispatch(GET_TASKS_DATA());
      onClose();
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
