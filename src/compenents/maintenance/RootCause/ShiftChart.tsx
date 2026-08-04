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

export default function ShiftChart({ rows }: Props) {
  const vardiyalar: Record<string, number> = {};

  rows.forEach((row) => {
    const vardiya = row["Vardiya"] || "Bilinmiyor";
    const sure = Number(row["Toplam Süre(dk)"] || 0);

    vardiyalar[vardiya] = (vardiyalar[vardiya] || 0) + sure;
  });

  const data = Object.entries(vardiyalar)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "#182434",
        height: 380,
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
        Vardiyalara Göre Toplam Duruş Süresi
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
          />

          <XAxis
            dataKey="name"
            stroke="#fff"
          />

          <YAxis
            stroke="#fff"
          />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}