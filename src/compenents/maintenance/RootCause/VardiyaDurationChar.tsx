import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { CartesianGrid } from "recharts";

type Props = {
  rows: any[];
};

export default function VardiyaDurationChart({ rows }: Props) {
  const vardiyalar: Record<string, number> = {};

  rows.forEach((row) => {
    const vardiya = row["Vardiya"] || "Bilinmiyor";
    const sure = Number(row["Toplam Süre(dk)"] || 0);

    vardiyalar[vardiya] = (vardiyalar[vardiya] || 0) + sure;
  });

 const data = Object.entries(vardiyalar).map(([vardiya, value]) => ({
  name: vardiya,
  value: Number(value.toFixed(1)),
}));

  return (
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
        Vardiyalara Göre Toplam Duruş Süresi(dk)
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
            <CartesianGrid
  strokeDasharray="3 3"
  stroke="rgba(255,255,255,.08)"
/>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
  <Tooltip
  formatter={(value: any) => [`${value} dk`, "Toplam Süre"]}
/>
          <Bar
  dataKey="value"
  fill="#3b82f6"
  radius={[8,8,0,0]}
/>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}