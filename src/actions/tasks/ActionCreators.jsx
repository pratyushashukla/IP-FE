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
