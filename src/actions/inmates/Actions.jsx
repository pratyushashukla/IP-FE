import { INMATES_DATA, INMATE_BY_ID } from "./Types";

/*------------------------------SAVE ALL INMATES DATA-------------------------------------------*/

export const INMATESDATA = (value) => {
  return {
    type: INMATES_DATA,
    payload: { value },
  };
};

/*------------------------------SAVE ONE INMATE DATA-------------------------------------------*/

export const INMATEBYID = (value) => {
  return {
    type: INMATE_BY_ID,
    payload: { value },
  };
};
