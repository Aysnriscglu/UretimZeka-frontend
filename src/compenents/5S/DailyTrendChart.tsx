import { Paper, Typography, Box } from "@mui/material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { AttendanceRow } from "./utils";
import { isAttended, getHafta } from "./utils";

interface Props {
  rows: AttendanceRow[];
}

export default function DailyTrendChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const weekMap = new Map<number, { week: string; total: number; attended: number }>();

  rows.forEach(r => {
    const hafta = getHafta(r);
    if (hafta == null) return;

    if (!weekMap.has(hafta)) {
      weekMap.set(hafta, { week: `${hafta}. Hafta`, total: 0, attended: 0 });
    }

    const data = weekMap.get(hafta)!;
    data.total += 1;
    if (isAttended(r)) data.attended += 1;
  });

  const chartData = Array.from(weekMap.values())
    .sort((a, b) => parseInt(a.week) - parseInt(b.week))
    .map(w => ({
      week: w.week,
      rate: w.total === 0 ? 0 : Math.round((w.attended / w.total) * 100)
    }));

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
        📈 Haftalık Katılım Trendi
      </Typography>
      <Typography variant="body2" color="#94A3B8" mb={3}>
        Genel katılım oranının haftalara göre değişimi
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="week" stroke="#94A3B8" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff"
              }}
              itemStyle={{ color: "#3b82f6" }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              name="Katılım Oranı (%)"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}