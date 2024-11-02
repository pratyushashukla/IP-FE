import { VISITS_DATA } from "./Types";

/*------------------------------SAVE VISITS DATA-------------------------------------------*/

export const VISITS_DATA_ACTION = (value) => {
  return {
    type: VISITS_DATA,
    payload: { value },
  };
};
