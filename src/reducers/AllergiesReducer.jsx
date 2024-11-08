import { ALLERGIES_DATA } from "../actions/allergies/Types";

const initialState = {
  allergiesData: [],
};

const AllergiesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ALLERGIES_DATA:
      return Object.assign({}, state, {
        allergiesData: action.payload.value,
      });
    default:
      return state;
  }
};

export default AllergiesReducer;
