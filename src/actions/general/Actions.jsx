import { SUCCESS_MSG, ERROR_MSG } from "./Types";

export const SUCCESSMSG = (value) => {
  return {
    type: SUCCESS_MSG,
    payload: { value },
  };
};

export const ERRORMSG = (value) => {
  return {
    type: ERROR_MSG,
    payload: { value },
  };
};