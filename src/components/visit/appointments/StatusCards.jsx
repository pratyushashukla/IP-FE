// src/components/visitorManagement/StatusCards.jsx
import React from "react";
import { Box, Card, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventIcon from "@mui/icons-material/Event";
import LoopIcon from "@mui/icons-material/Loop";

function StatusCard({ title, value, percentage, icon, color }) {
  return (
    <Card sx={{ p: 3, display: "flex", alignItems: "center", minWidth: 200, border: "1px solid #e0e0e0" }}>
      <Box sx={{ mr: 2, color }}>{icon}</Box>
      <Box>
        <Typography variant="h6" color="text.secondary">
          {title.toUpperCase()}
        </Typography>
        <Typography variant="h4" color="text.primary">
          {value}
        </Typography>
        <Typography variant="body2" color={percentage >= 0 ? "green" : "red"}>
          {/* {percentage}% Since last month */}
        </Typography>
      </Box>
    </Card>
  );
}

function StatusCards({ counts }) {
  return (
    <Box
      sx={{ display: "flex", gap: 2, justifyContent: "space-evenly", my: 4 }}
    >
      <StatusCard
        title="Ongoing"
        value={counts.ongoing}
        // percentage={counts.ongoingChange}
        icon={<LoopIcon />}
        color="orange"
      />
      <StatusCard
        title="Scheduled"
        value={counts.scheduled}
        // percentage={counts.scheduledChange}
        icon={<EventIcon />}
        color="blue"
      />
      <StatusCard
        title="Completed"
        value={counts.completed}
        // percentage={counts.completedChange}
        icon={<CheckCircleIcon />}
        color="green"
      />
      <StatusCard
        title="Canceled"
        value={counts.canceled}
        // percentage={counts.canceledChange}
        icon={<CancelIcon />}
        color="red"
      />
    </Box>
  );
}

export default StatusCards;
