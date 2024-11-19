import ApiService, { handleNetworkError, dispatchAction } from "../../middleware/ApiService";
import { REPORT_DATA, REPORT_HISTORY, SET_ERROR, CLEAR_ERROR } from "./Types";

// Action creators to set report data and history
export const setReportData = (data) => ({
  type: REPORT_DATA,
  payload: data,
});

export const setReportHistory = (data) => ({
  type: REPORT_HISTORY,
  payload: data,
});

export const setError = (message) => ({
  type: SET_ERROR,
  payload: message,
});

export const clearError = () => ({
  type: CLEAR_ERROR,
});

// Async action to generate a report for preview
export const GENERATE_REPORT = (inmateId, reportType) => async (dispatch) => {
  try {
    const response = await ApiService.post(`/reports/generate`, { inmateId, type: reportType });
    if (response.status === 200) {
      dispatchAction(dispatch, setReportData, response.data); // Store report data in Redux
      dispatch(clearError());
    }
  } catch (error) {
    dispatch(setError("Error generating report."));
    handleNetworkError(error);
  }
};

// Async action to download a report
// Async action to download a report
export const DOWNLOAD_REPORT = (inmateId, reportType) => async (dispatch) => {
  try {
    const response = await ApiService.post(
      `/reports/generate`,
      { inmateId, type: String(reportType) }, // Ensure reportType is sent as a string
      { responseType: 'blob' }
    );

    if (response.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute('download', `Report_${inmateId}_${reportType}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      dispatch(clearError());
    } else {
      throw new Error("Failed to generate the report.");
    }
  } catch (error) {
    console.error("Error downloading report:", error);

    // Attempt to read the error response
    if (error.response?.data) {
      const errorText = await error.response.data.text();
      console.error("Error details:", errorText);
      dispatch(setError(errorText || "Error downloading report."));
    } else {
      dispatch(setError("Error downloading report."));
    }

    handleNetworkError(error);
  }
};


// Async action to email a report
export const EMAIL_REPORT = (inmateId, reportType, email) => async (dispatch) => {
  try {
    const response = await ApiService.post(`/reports/send-email`, { inmateId, type: reportType, recipientEmail: email });
    if (response.status === 200) {
      alert(`Report sent successfully to ${email}`);
      dispatch(clearError());
    } else {
      dispatch(setError("Failed to send the report."));
    }
  } catch (error) {
    dispatch(setError("Error sending report via email."));
    handleNetworkError(error);
  }
};

// Async action to fetch report history for an inmate
export const FETCH_REPORT_HISTORY = (inmateId) => async (dispatch) => {
  try {
    const response = await ApiService.get(`/reports/${inmateId}`);
    if (response.status === 200) {
      console.log("Report History Data:", response.data);

      dispatchAction(dispatch, setReportHistory, response.data); // Store history in Redux
      dispatch(clearError());
    }
  } catch (error) {
    dispatch(setError("Error fetching report history."));
    handleNetworkError(error);
  }
};

// Async action to fetch report for an inmate
export const GET_REPORT_BY_INMATE_ID = (inmateId, reportType) => async (dispatch) => {
  dispatch(clearError()); // Clear any existing errors before fetching data

  try {
    const response = await ApiService.get(`/reports/${inmateId}/${reportType}`);
    if (response.status === 200) {
      console.log("Report data ", response.data);
      dispatchAction(dispatch, setReportData, response.data); // Store fetched report data in Redux
      return response.data; // Ensure that the data is returned to the component
    } else {
      dispatch(setError('Report data not found'));
      return null; // Return null if the status is not 200
    }
  } catch (error) {
    dispatch(setError('Error fetching report data'));
    return null; // Return null if there's an error
  }
};


