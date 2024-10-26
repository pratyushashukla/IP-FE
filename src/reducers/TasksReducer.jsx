import { TASKS_DATA } from "../actions/tasks/Types";

const initialState = {
  tasksData: [],
};

const TasksReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case TASKS_DATA:
      return Object.assign({}, state, {
        tasksData: action.payload.value,
      });
    default:
      return state;
  }
};

export default TasksReducer;
