import { Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Props = {
  rows: any[];
};

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
];

export default function CallReasonChart({ rows }: Props) {
  const counts: Record<string, number> = {};

  rows.forEach((row) => {
    const reason = row["Duruş"] || "Bilinmiyor";
    counts[reason] = (counts[reason] || 0) + 1;
  });

  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "#182434",
        height: 500,
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

      <ResponsiveContainer width="100%" height="90%">
  <PieChart>
    <Pie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      innerRadius={65}      // Halka olması için
      outerRadius={110}
      paddingAngle={2}
      cornerRadius={6}
      label={({ percent }) =>
        `${(percent * 100).toFixed(0)}%`
      }
    >
      {data.map((_, index) => (
        <Cell
          key={index}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>

    <Tooltip />

    <Legend
      verticalAlign="bottom"
      align="center"
      iconType="circle"
      wrapperStyle={{
        color: "#fff",
        fontSize: 12,
      }}
    />
  </PieChart>
</ResponsiveContainer>
    </Paper>
  );
}