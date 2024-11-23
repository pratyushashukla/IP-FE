import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { USERDATA } from "./Actions";

export const GETUSERDATA = () => async (dispatch) => {
  try {
    const apiResponse = await ApiService.get(`/users`);
    if (apiResponse) {
      dispatchAction(dispatch, USERDATA, apiResponse.data.result);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const ADDUSER = (obj, formRef, handleDialog, showDialog) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/users`, { data: obj });
    if (apiResponse) {
      dispatch(GETUSERDATA());
      formRef.current.reset();
      handleDialog(!showDialog);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};


export const EDITUSER = (id, obj) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.patch(`/users/${id}`, obj);
    if (apiResponse) {
      dispatch(GETUSERDATA());
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const DELETEUSER = (id) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.delete(`/users/${id}`);
    if (apiResponse) {
      dispatch(GETUSERDATA());
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
