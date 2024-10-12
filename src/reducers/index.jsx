import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import UsersReducer from "./UsersReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  UsersReducer: UsersReducer,
});
