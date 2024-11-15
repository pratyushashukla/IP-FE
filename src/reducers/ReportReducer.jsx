import { REPORT_DATA, REPORT_HISTORY, SET_ERROR, CLEAR_ERROR } from "../actions/reports/Types";

const initialState = {
  reportData: {},         // Stores data for a generated report (for preview)
  reportHistory: [],      // Stores history of generated reports
  error: null,            // Stores error messages
};

const ReportReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case REPORT_DATA:
      return {
        ...state,
        reportData: action.payload, // Directly set `payload` if it contains the report data
        error: null,
      };
    case REPORT_HISTORY:
      return {
        ...state,
        reportHistory: action.payload, // Directly set `payload` if it contains the history data
        error: null,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default ReportReducer;
