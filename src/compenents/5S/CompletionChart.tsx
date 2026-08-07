import { Paper, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import type { AttendanceRow } from "./utils";
import { isAttended } from "./utils";

interface Props {
  rows: AttendanceRow[];
}

export default function CompletionChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const attendedCount = rows.filter(isAttended).length;
  const absentCount = rows.length - attendedCount;

  const data = [
    { name: "Katılım Sağlayan", value: attendedCount },
    { name: "Katılmayan", value: absentCount },
  ];

  const COLORS = ["#10b981", "#f43f5e"];

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
        🍩 Katılım Dağılımı
      </Typography>
      <Typography variant="body2" color="#94A3B8" mb={3}>
        Tüm kayıtlar üzerinden katılım oranı
      </Typography>

      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={80}
              outerRadius={120}
              dataKey="value"
              stroke="none"
              labelLine={false}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                if (value === 0) return null;
                return (
                  <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize={18}>
                    {value}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff"
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}