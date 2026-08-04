import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


type Props = {
  rows: any[];
};

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export default function RootCauseChart({ rows }: Props) {
    
  const counts: Record<string, number> = {};

  rows.forEach((row) => {
    const reason = row["Duruş Tipi Tanımı"] || "Bilinmiyor";
    counts[reason] = (counts[reason] || 0) + 1;
  });

  const reasons: Record<string, number> = {};

rows.forEach((row) => {
  const reason = row["Duruş"] || "Bilinmiyor";
  reasons[reason] = (reasons[reason] || 0) + 1;
});

const data = Object.entries(reasons)
  .map(([name, value]) => ({
    name,
    value,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 10);
  <Paper
  sx={{
    p: 3,
    borderRadius: 3,
    background: "#182434",
    height: 420,
  }}
>
  <Typography
    variant="h6"
    sx={{
      color: "#fff",
      mb: 2,
      fontWeight: 700,
    }}
  >
    Duruş Analizi
  </Typography>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} layout="vertical">
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

    <XAxis
      type="number"
      stroke="#fff"
    />

    <YAxis
      type="category"
      dataKey="name"
      width={180}
      stroke="#fff"
    />

    <Tooltip />

    <Bar
      dataKey="value"
      fill="#3b82f6"
      radius={[0, 8, 8, 0]}
    />
  </BarChart>
</ResponsiveContainer>
</Paper>
}