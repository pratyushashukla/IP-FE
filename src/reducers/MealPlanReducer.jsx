import { MEALPLAN_DATA } from "../actions/mealplan/Types";

const initialState = {
  mealPlanData: [],
};

const MealPlanReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case MEALPLAN_DATA:
      return Object.assign({}, state, {
        mealPlanData: action.payload.value,
      });
    default:
      return state;
  }
};

export default MealPlanReducer;
