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

export const EDIT_TASK_DATA = (task) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/tasks/${task._id}`, task);
    if (apiResponse) {
      dispatch(GET_TASKS_DATA());
      formRef.current.reset();
      handleDialog(!showDialog);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETE_TASK_DATA = (id, handleCloseMenu) => async (dispatch) => {
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

