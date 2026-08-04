import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
 Tooltip,
} from "recharts";

type Props = {
  rows: any[];
};

export default function DailyTrendChart({ rows }: Props) {
  

  const chartData = rows
    .map((row) => ({
      gun: Number(row["Gün "] ?? row["Gün"]),
      oran:
        Number(row["Duruş/Arıza Oran %"] ?? 0) * 100,
    }))
    .filter(
      (item) =>
        !isNaN(item.gun) &&
        !isNaN(item.oran)
    )
    .sort((a, b) => a.gun - b.gun);

  console.log(chartData);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        height: 420,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 3,
        }}
      >
        📈 Günlere Göre Kasnak Duruş / Arıza Oranı (%)
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={chartData}>
          <CartesianGrid
            stroke="#334155"
            strokeDasharray="5 5"
          />

          <XAxis
            dataKey="gun"
            stroke="#cbd5e1"
            tick={{ fill: "#cbd5e1" }}
          />

          <YAxis
            stroke="#cbd5e1"
            tick={{ fill: "#cbd5e1" }}
            unit="%"
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #3b82f6",
              borderRadius: 10,
            }}
            formatter={(value: any) => [
              `${Number(value).toFixed(1)}%`,
              "Hata Oranı",
            ]}
            labelFormatter={(label) => `${label}. Gün`}
          />

          <Line
            type="monotone"
            dataKey="oran"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}