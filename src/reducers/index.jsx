import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import UsersReducer from "./UsersReducer";
import TasksReducer from "./TasksReducer";
import InmatesReducer from "./InmatesReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  UsersReducer: UsersReducer,
  TasksReducer: TasksReducer,
  InmatesReducer: InmatesReducer
});
