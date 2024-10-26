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