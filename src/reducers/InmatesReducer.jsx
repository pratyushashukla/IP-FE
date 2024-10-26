import { INMATES_DATA } from "../actions/inmates/Types";

const initialState = {
  inmatesData: [],
};

const InmatesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case INMATES_DATA:
      return Object.assign({}, state, {
        inmatesData: action.payload.value,
      });
    default:
      return state;
  }
};

export default InmatesReducer;
