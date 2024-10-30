import { VISITORS_DATA } from "./Types";

/*------------------------------SAVE VISITORS DATA-------------------------------------------*/

export const VISITORS_DATA_ACTION = (value) => {
  return {
    type: VISITORS_DATA,
    payload: { value },
  };
};
