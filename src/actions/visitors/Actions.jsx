import { VISITORS_DATA } from "./Types";

/*------------------------------SAVE VISITORS DATA-------------------------------------------*/
export const setVisitorsData = (value) => {   
  return {
    type: VISITORS_DATA,
    payload: { value },
  };
};
