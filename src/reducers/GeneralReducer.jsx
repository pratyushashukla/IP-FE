import { SUCCESS_MSG, ERROR_MSG } from "../actions/general/Types";

const initialState = {
  successMsg: "",
  errorMsg: "",
};

const GeneralReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SUCCESS_MSG:
      return Object.assign({}, state, {
        successMsg: action.payload.value,
      });
    case ERROR_MSG:
      return Object.assign({}, state, {
        errorMsg: action.payload.value,
      });
    default:
      return state;
  }
};

export default GeneralReducer;
