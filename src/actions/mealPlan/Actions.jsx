import { MEALPLAN_DATA } from "./Types";

/*------------------------------SAVE MEALPLAN DATA-------------------------------------------*/
export const setMealPlanData = (value) => {   
  return {
    type: MEALPLAN_DATA,
    payload: { value },
  };
};
