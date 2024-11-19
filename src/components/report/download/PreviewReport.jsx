import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { GET_REPORT_BY_INMATE_ID } from '../../../actions/reports/ActionCreators';

const PreviewReport = ({ open, onClose, inmateId, reportType }) => {
  const dispatch = useDispatch();
  const reportData = useSelector((state) => state.ReportReducer?.reportData || null);
  const error = useSelector((state) => state.ReportReducer?.error);
  const [loading, setLoading] = useState(false);

  const [reportDetails, setReportDetails] = useState({
    inmate: {
      name: "N/A",
      dob: "N/A",
      gender: "N/A",
      contact: "N/A",
      sentenceDuration: "N/A",
    },
    tasks: [],
    meals: [],
    visitors: [],
  });

  // Fetch report data when the dialog opens
  useEffect(() => {
    if (open && inmateId && reportType) {
      console.log('Fetching report data for inmateId:', inmateId, 'with reportType:', reportType);
      
      setLoading(true);
      
      dispatch(GET_REPORT_BY_INMATE_ID(inmateId, reportType))
        .then((data) => {
          console.log('Fetched data:', data);
  
          // Inmate Information
          const inmateInfo = {
            name: `${data.inmate.firstName} ${data.inmate.lastName}`,
            dob: new Date(data.inmate.dateOfBirth).toLocaleDateString(),
            gender: data.inmate.gender,
            contact: data.inmate.contactNumber,
            sentenceDuration: `${data.inmate.sentenceDuration} months`,
          };
  
          // Task Information: Check if tasks exist and are an array
          const taskInfo = (data.tasks && Array.isArray(data.tasks))
            ? data.tasks.map((task) => ({
                title: task.taskId?.title || 'N/A',
                description: task.taskId?.description || 'N/A',
                assignedBy: `${task.taskId?.assignedBy?.firstname || 'N/A'} ${task.taskId?.assignedBy?.lastname || 'N/A'}`,
                status: task.completionStatus ? 'Completed' : 'Pending',
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
              }))
            : []; // Default to an empty array if no tasks
  
          // Meal Information: Ensure meals exist and are an array
          const mealInfo = (data.meals && Array.isArray(data.meals))
            ? data.meals.map((meal) => ({
                type: meal.mealType,
                plan: meal.mealPlan,
                dietaryPreferences: meal.dietaryPreferences || 'N/A',
                allergies: meal.allergyId && meal.allergyId.length > 0
                  ? meal.allergyId.map((a) => a.allergyName).join(', ')
                  : 'None',
              }))
            : []; // Default to an empty array if no meals
  
          console.log('Meal Info:', mealInfo); // Log meal data for debugging
  
          // Visitor Information: Check if visitors exist and are an array
          const visitorInfo = (data.visitors && Array.isArray(data.visitors))
            ? data.visitors.map((visitor) => ({
                name: `${visitor.firstname} ${visitor.lastname}`,
                relationship: visitor.relationship,
                contact: visitor.contactNumber,
                appointments: (data.appointments && Array.isArray(data.appointments))
                  ? data.appointments
                      .filter((appointment) => appointment.visitorId._id === visitor._id)
                      .map((appointment) => ({
                        startTime: new Date(appointment.startTime).toLocaleTimeString(),
                        estimatedEndTime: new Date(appointment.estimatedEndTime).toLocaleTimeString(),
                        status: appointment.status,
                        remarks: appointment.remarks || 'N/A',
                        identityVerified: appointment.identityVerified ? 'Yes' : 'No',
                        flaggedForSecurity: appointment.flaggedForSecurity ? 'Yes' : 'No',
                      }))
                  : [] // Default to empty array if no appointments
              }))
            : []; // Default to empty array if no visitors
  
          // Final report details
          setReportDetails({
            inmate: inmateInfo,
            tasks: taskInfo,
            meals: mealInfo,
            visitors: visitorInfo,
          });
        })
        .catch((error) => {
          console.error('Error fetching report data:', error);
          setReportDetails({ inmate: {}, tasks: [], meals: [], visitors: [] });
        })
        .finally(() => setLoading(false));
    } else {
      console.log('Invalid parameters: open:', open, 'inmateId:', inmateId, 'reportType:', reportType);
    }
  }, [open, inmateId, reportType, dispatch]);
  
  
  // Render conditional sections based on reportType
  const renderSection = (title, content) => (
    <Box mb={2}>
      <Typography variant="h6">{title}</Typography>
      <Divider sx={{ my: 1 }} />
      {content}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Report Preview</DialogTitle>
      <DialogContent>
        {loading && <Typography variant="body2">Loading report data...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {!loading && reportDetails ? (
          <Box>

            {/* Inmate Details Section */}
            {renderSection("Inmate Details", (
              <>
                <Typography>Name: {reportDetails.inmate.name}</Typography>
                <Typography>DOB: {reportDetails.inmate.dob}</Typography>
                <Typography>Gender: {reportDetails.inmate.gender}</Typography>
                <Typography>Contact: {reportDetails.inmate.contact}</Typography>
                <Typography>Sentence Duration: {reportDetails.inmate.sentenceDuration}</Typography>
              </>
            ))}

            {/* Task Assignments Section */}
            {(reportType === 'complete' || reportType === 'tasks') &&
              renderSection("Task Assignments", (
                reportDetails.tasks.length > 0 ? reportDetails.tasks.map((task, index) => (
                  <Box key={index} mb={1}>
                    <Typography>Title: {task.title}</Typography>
                    <Typography>Description: {task.description}</Typography>
                    <Typography>Assigned By: {task.assignedBy}</Typography>
                    <Typography>Status: {task.status}</Typography>
                    <Typography>Due Date: {task.dueDate}</Typography>
                  </Box>
                )) : <Typography>No tasks assigned.</Typography>
              ))
            }

            {/* Meal Plan Section */}
            {(reportType === 'complete' || reportType === 'meal') &&
              renderSection("Meal Plan", (
                reportDetails.meals.length > 0 ? reportDetails.meals.map((meal, index) => (
                  <Box key={index} mb={1}>
                    <Typography>Meal Type: {meal.type}</Typography>
                    <Typography>Plan Duration: {meal.plan}</Typography>
                    <Typography>Dietary Preferences: {meal.dietaryPreferences}</Typography>
                    <Typography>Allergies: {meal.allergies}</Typography>
                  </Box>
                )) : <Typography>No meal plans assigned.</Typography>
              ))
            }

            {/* Visitor Interactions Section */}
            {(reportType === 'complete' || reportType === 'visitor') &&
              renderSection("Visitor Interactions", (
                reportDetails.visitors.length > 0 ? reportDetails.visitors.map((visitor, index) => (
                  <Box key={index} mb={1}>
                    <Typography>Visitor Name: {visitor.name}</Typography>
                    <Typography>Relationship: {visitor.relationship}</Typography>
                    <Typography>Contact: {visitor.contact}</Typography>
                    {visitor.appointments.length > 0 ? visitor.appointments.map((appointment, idx) => (
                      <Box key={idx} ml={2} mt={1}>
                        <Typography>Start Time: {appointment.startTime}</Typography>
                        <Typography>Estimated End Time: {appointment.estimatedEndTime}</Typography>
                        <Typography>Status: {appointment.status}</Typography>
                        <Typography>Remarks: {appointment.remarks}</Typography>
                        <Typography>Identity Verified: {appointment.identityVerified}</Typography>
                        <Typography>Flagged for Security: {appointment.flaggedForSecurity}</Typography>
                      </Box>
                    )) : <Typography>No appointments found for this visitor.</Typography>}
                  </Box>
                )) : <Typography>No visitor interactions.</Typography>
              ))
            }

          </Box>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewReport;
