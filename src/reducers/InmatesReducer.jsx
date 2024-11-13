import { INMATES_DATA, INMATE_BY_ID } from "../actions/inmates/Types";

const initialState = {
  inmatesData: [],
  inmateById: {},
};

const InmatesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case INMATES_DATA:
      return Object.assign({}, state, {
        inmatesData: action.payload.value,
      });
    case INMATE_BY_ID:
      return Object.assign({}, state, {
        inmateById: action.payload.value,
      });
    default:
      return state;
  }
};

export default InmatesReducer;
