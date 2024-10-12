import ApiService, {
  dispatchApiMessage,
  handleNetworkError,
} from "../../middleware/ApiService";
import { ERRORMSG, SUCCESSMSG } from "./Actions";

export const SIGNUP = (obj, formRef, navigate) => async (dispatch) => {
  try {
    const apiResponse = await ApiService.post(`/auth/signup`, { data: obj });
    if (apiResponse.status == 200) {
      formRef.current.reset();
      dispatchApiMessage(dispatch, SUCCESSMSG, apiResponse.data.message);
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } else {
      dispatchApiMessage(dispatch, ERRORMSG, apiResponse.data.message);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const LOGIN = (obj, formRef, navigate) => async () => {
  try {
    const apiResponse = await ApiService.patch(`/auth/login`, obj);
    if (apiResponse.status == 200) {
      formRef.current.reset();
      navigate("/dashboard");
      console.log("apiResponse", apiResponse);
      localStorage.setItem("email", apiResponse.data.results.email);
      localStorage.setItem("userId", apiResponse.data.results._id);
    } else {
      dispatchApiMessage(dispatch, ERRORMSG, apiResponse.data.results.message);
    }
  } catch (error) {
    handleNetworkError(error);
  }
};

export const LOGOUT = (navigate) => async () => {
  try {
    const apiResponse = await ApiService.patch(`/auth/logout`, {
      email: localStorage.getItem("email"),
    });
    if (apiResponse.status == 200) {
      localStorage.clear();
      navigate("/sign-in");
    }
  } catch (error) {
    handleNetworkError(error);
  }
};
