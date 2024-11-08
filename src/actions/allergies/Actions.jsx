import { ALLERGIES_DATA } from "./Types";

/*------------------------------SAVE ALLERGIES DATA-------------------------------------------*/
export const setAllergiesData = (value) => {   
  return {
    type: ALLERGIES_DATA,
    payload: { value },
  };
};
