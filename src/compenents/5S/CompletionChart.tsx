import { Paper, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Yapılan", value: 126 },
  { name: "Yapılmayan", value: 8 },
];

const COLORS = ["#22C55E", "#EF4444"];

export default function CompletionChart() {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "#1f2937",
        height: 420,
      }}
    >
      <Typography
        variant="h6"
        color="white"
        fontWeight={700}
        mb={3}
      >
        🍩 Yapılan / Yapılmayan
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={110}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}