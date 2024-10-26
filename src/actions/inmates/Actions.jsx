import { INMATES_DATA } from "./Types";

/*------------------------------SAVE TASKS DATA-------------------------------------------*/

export const INMATESDATA = (value) => {
  return {
    type: INMATES_DATA,
    payload: { value },
  };
};
