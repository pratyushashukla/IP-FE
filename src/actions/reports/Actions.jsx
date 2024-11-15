import { REPORT_DATA, REPORT_HISTORY, SET_ERROR, CLEAR_ERROR } from "./Types";

/*------------------------------SAVE REPORTS DATA-------------------------------------------*/

// Action to store report data
export const setReportsData = (data) => ({
  type: REPORT_DATA,
  payload: data,
});

// Action to store report history data
export const setReportHistory = (data) => ({
  type: REPORT_HISTORY,
  payload: data,
});

// Action to set error message
export const setError = (message) => ({
  type: SET_ERROR,
  payload: message,
});

// Action to clear error message
export const clearError = () => ({
  type: CLEAR_ERROR,
});
