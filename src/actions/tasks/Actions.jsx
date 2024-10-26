import { TASKS_DATA } from "./Types";

/*------------------------------SAVE TASKS DATA-------------------------------------------*/

export const TASKSDATA = (value) => {
  return {
    type: TASKS_DATA,
    payload: { value },
  };
};
