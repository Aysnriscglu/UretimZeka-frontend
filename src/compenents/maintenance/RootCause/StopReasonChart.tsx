import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Props = {
  rows: any[];
};

export default function StopReasonChart({ rows }: Props) {
  const counts: Record<string, number> = {};

  rows.forEach((row) => {
    const reason =
      row["Duruş Tipi Tanımı"] || "Bilinmiyor";

    counts[reason] = (counts[reason] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

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
        sx={{ color: "#fff", mb: 2, fontWeight: 700 }}
      >
        En Çok Duruş Nedeni
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          layout="vertical"
          data={data}
        >
          <XAxis type="number" stroke="#fff" />

          <YAxis
            type="category"
            dataKey="name"
            width={120}
            stroke="#fff"
          />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}