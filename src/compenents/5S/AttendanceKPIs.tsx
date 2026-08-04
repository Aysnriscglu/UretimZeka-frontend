import { Grid, Paper, Typography, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";


interface AttendanceRow {
  hafta: number;
  bölüm: string;
  katılım: string;
  geçKatılım?: string;
  katılımOlmayanGünSayısı: number;
  mazeretliMi?: string;
  mazeretliKatılımOlmayanGünSayısı: number;
}

interface AttendanceKPIsProps {
  rows: AttendanceRow[];
}

export default function AttendanceKPIs({
  rows,
}: AttendanceKPIsProps) {
    console.log(rows);
    const attended = rows.filter((r) => r.katılım === "✔").length;

const absent = rows.filter((r) => r.katılımOlmayanGünSayısı > 0).length;

const late = rows.filter((r) => r.geçKatılım === "Evet").length;

const excused = rows.filter((r) => r.mazeretliMi === "Evet").length;

const unexcused = absent - excused;

const attendanceRate =
  attended + absent === 0
    ? 0
    : Math.round((attended / (attended + absent)) * 100);

const cards = [
  {
    title: "Katıldığı Hafta Sayısı",
    value: attended,
    color: "#22c55e",
    icon: <GroupsIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: "Katılmadığı Hafta Sayısı",
    value: absent,
    color: "#ef4444",
    icon: <PersonOffIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: "Geç Katıldığı Hafta Sayısı",
    value: late,
    color: "#f59e0b",
    icon: <AccessTimeIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: "Mazeretli Katılmadığı",
    value: excused,
    color: "#8b5cf6",
    icon: <AssignmentTurnedInIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: "Mazeretsiz Katılmadığı",
    value: unexcused,
    color: "#64748b",
    icon: <PersonOffIcon sx={{ fontSize: 42 }} />,
  },
  {
    title: "Katılım Oranı",
    value: `%${attendanceRate}`,
    color: "#3b82f6",
    icon: <GroupsIcon sx={{ fontSize: 42 }} />,
  },
];
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "#1f2937",
              color: "white",
              border: "1px solid rgba(255,255,255,.08)",
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Box sx={{ color: card.color }}>{card.icon}</Box>

              <Typography fontSize={34} fontWeight={800}>
                {card.value}
              </Typography>
            </Box>

            <Typography color="#CBD5E1" fontWeight={600}>
              {card.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}