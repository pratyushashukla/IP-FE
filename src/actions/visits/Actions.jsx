import { VISITS_DATA } from "./Types";

/*------------------------------SAVE VISITS DATA-------------------------------------------*/

export const VISITSDATA = (value) => {
  return {
    type: VISITS_DATA,
    payload: { value },
  };
};
