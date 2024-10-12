import { USER_DATA } from "../actions/users/Types";

const initialState = {
  usersData: [],
};

const UsersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case USER_DATA:
      return Object.assign({}, state, {
        usersData: action.payload.value,
      });
    default:
      return state;
  }
};

export default UsersReducer;
