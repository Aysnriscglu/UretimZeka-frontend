import { Paper, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend
} from "recharts";
import type { AttendanceRow } from "./utils";
import { isAttended, isLate, isExcused, getHafta } from "./utils";

interface Props {
  rows: AttendanceRow[];
}

export default function ComplianceChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  // Group by week
  const weekMap = new Map<number, { week: string, late: number, excused: number, unexcused: number }>();

  rows.forEach(r => {
    const hafta = getHafta(r);
    if (hafta == null) return;

    if (!weekMap.has(hafta)) {
      weekMap.set(hafta, { week: `${hafta}. Hafta`, late: 0, excused: 0, unexcused: 0 });
    }

    const data = weekMap.get(hafta)!;
    
    if (isLate(r)) data.late += 1;
    
    if (!isAttended(r)) {
      if (isExcused(r)) data.excused += 1;
      else data.unexcused += 1;
    }
  });

  const chartData = Array.from(weekMap.values()).sort((a, b) => parseInt(a.week) - parseInt(b.week));

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: "20px",
        background: "rgba(31, 41, 55, 0.7)",
        backdropFilter: "blur(12px)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        height: 420,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Typography variant="h6" color="white" fontWeight={700} mb={1}>
        📊 Haftalara Göre İhlal Kırılımı
      </Typography>
      <Typography variant="body2" color="#94A3B8" mb={3}>
        Geç Katılım, Mazeretli ve Mazeretsiz devamsızlıklar
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="week" stroke="#94A3B8" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff"
              }}
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="late" name="Geç Kalan" stackId="a" fill="#f59e0b" radius={[0, 0, 4, 4]} />
            <Bar dataKey="excused" name="Mazeretli" stackId="a" fill="#8b5cf6" />
            <Bar dataKey="unexcused" name="Mazeretsiz" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}