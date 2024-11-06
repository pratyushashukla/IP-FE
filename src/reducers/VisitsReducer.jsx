import { VISITS_DATA } from "../actions/visits/Types";

const initialState = {
  visitsData: [],
};

const VisitsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case VISITS_DATA:
      return {
        ...state,
        visitsData: action.payload.value,
      };
    default:
      return state;
  }
};

export default VisitsReducer;
