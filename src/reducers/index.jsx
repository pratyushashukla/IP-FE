import { combineReducers } from "redux";
import GeneralReducer from "./GeneralReducer";
import UsersReducer from "./UsersReducer";
import TasksReducer from "./TasksReducer";
import InmatesReducer from "./InmatesReducer";
import VisitorsReducer from "./VisitorsReducer";
import VisitsReducer from "./VisitsReducer";

export default combineReducers({
  GeneralReducer: GeneralReducer,
  UsersReducer: UsersReducer,
  TasksReducer: TasksReducer,
  InmatesReducer: InmatesReducer,
  VisitorsReducer: VisitorsReducer,
  VisitsReducer: VisitsReducer
});
