import {
  Paper,
  Typography,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

type Props = {
  data: any[];
};

export default function CategoryChart({ data }: Props) {

  const categoryData = Object.entries(
    data.reduce((acc: Record<string, number>, item) => {

      const category = item["Ön Görülen Fayda"];

      if (!category) return acc;

      acc[category] = (acc[category] || 0) + 1;

      return acc;

    }, {})
  )
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a: any, b: any) => b.value - a.value);

  const colors = [
    "#3B82F6",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
  ];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#182434",
        height: 450,
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 25,
          mb: 3,
        }}
      >
        📊 Öneri Kategori Dağılımı
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={categoryData}
          layout="vertical"
        >
          <XAxis type="number" hide />

          <YAxis
            dataKey="name"
            type="category"
            width={180}
            tick={{ fill: "#fff", fontSize: 20 }}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[0, 8, 8, 0]}
          >
            {categoryData.map((_, index) => (
              <Cell
                key={index}
                fill={colors[index % colors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}