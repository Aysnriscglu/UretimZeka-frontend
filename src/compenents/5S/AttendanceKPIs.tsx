import { Grid, Paper, Typography, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DataUsageIcon from "@mui/icons-material/DataUsage";

// Using imported interface

import type { AttendanceRow } from "./utils";
import { isAttended, isLate, isExcused, getAbsentDays } from "./utils";

interface AttendanceKPIsProps {
  rows: AttendanceRow[];
}

export default function AttendanceKPIs({ rows }: AttendanceKPIsProps) {
  if (!rows || rows.length === 0) {
    return null;
  }

  const attendedCount = rows.filter(isAttended).length;
  const absentCount = rows.filter((r) => getAbsentDays(r) > 0 || !isAttended(r)).length;
  const lateCount = rows.filter(isLate).length;
  const excusedCount = rows.filter(isExcused).length;
  
  // Unexcused is total absent - excused (roughly)
  const unexcusedCount = Math.max(0, absentCount - excusedCount);

  const total = attendedCount + absentCount;
  const attendanceRate = total === 0 ? 0 : Math.round((attendedCount / total) * 100);

  const cards = [
    {
      title: "Katılım Sağlayan",
      value: attendedCount,
      subtitle: "Toplam",
      color: "#10b981", // Emerald
      bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0) 100%)",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Katılmayan",
      value: absentCount,
      subtitle: "Toplam",
      color: "#f43f5e", // Rose
      bgGradient: "linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0) 100%)",
      icon: <PersonOffIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Geç Kalan",
      value: lateCount,
      subtitle: "Toplam",
      color: "#f59e0b", // Amber
      bgGradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0) 100%)",
      icon: <AccessTimeIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Mazeretli",
      value: excusedCount,
      subtitle: "Katılmayanlar İçinde",
      color: "#8b5cf6", // Violet
      bgGradient: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 100%)",
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Mazeretsiz",
      value: unexcusedCount,
      subtitle: "Katılmayanlar İçinde",
      color: "#64748b", // Slate
      bgGradient: "linear-gradient(135deg, rgba(100,116,139,0.15) 0%, rgba(100,116,139,0) 100%)",
      icon: <PersonOffIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Genel Katılım",
      value: `%${attendanceRate}`,
      subtitle: "Oran",
      color: "#3b82f6", // Blue
      bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 100%)",
      icon: <DataUsageIcon sx={{ fontSize: 48 }} />,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "#1e293b",
              backgroundImage: card.bgGradient,
              color: "white",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 12px 40px ${card.color}33`,
                border: `1px solid ${card.color}55`,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -15,
                right: -15,
                color: card.color,
                opacity: 0.1,
                transform: "scale(2.5)",
                pointerEvents: "none",
              }}
            >
              {card.icon}
            </Box>

            <Box>
              <Typography color="#94a3b8" fontSize={13} fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                {card.title}
              </Typography>
              <Typography mt={1} fontSize={36} fontWeight={800} sx={{ color: card.color }}>
                {card.value}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
              <Typography color="#64748b" fontSize={12} fontWeight={500}>
                {card.subtitle}
              </Typography>
              <Box sx={{ color: card.color, opacity: 0.8 }}>{card.icon}</Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}