import { VISITORS_DATA } from "../actions/visitors/Types";

const initialState = {
  visitorsData: [],
};

const VisitorsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case VISITORS_DATA:
      return Object.assign({}, state, {
        visitorsData: action.payload.value,
      });
    default:
      return state;
  }
};

export default VisitorsReducer;
