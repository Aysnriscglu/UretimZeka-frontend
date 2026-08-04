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

export default function CallReasonChart({ rows }: Props) {
const chartData = Object.entries(
  rows.reduce((acc: Record<string, number>, row) => {
    const reason =
      row["Çağrı Nedeni"] ||
      row["Çağrı Nedeni Kodu"] ||
      row["Duruş Adı"] ||
      "Bilinmiyor";

    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {})
)
  .map(([reason, count]) => ({
    reason,
    count: Number(count),
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);


  return (
    <Paper
      elevation={0}
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
        sx={{ mb: 2, color: "#fff", fontWeight: 600 }}
      >
        Çağrı Nedeni Analizi
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
       <BarChart
  layout="vertical"
  data={chartData}
>
  <CartesianGrid stroke="#334155" />

  <XAxis type="number" />

  <YAxis
  type="category"
  dataKey="reason"
  width={260}
  tickFormatter={(value: string) =>
    value.length > 25 ? value.slice(0, 25) + "..." : value
  }
/>

  <Tooltip />

  <Bar
    dataKey="count"
    fill="#38bdf8"
    radius={[0,8,8,0]}
  />
</BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}