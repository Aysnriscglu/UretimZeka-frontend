import {
  Paper,
  Typography,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Pzt", value: 28 },
  { day: "Sal", value: 31 },
  { day: "Çar", value: 35 },
  { day: "Per", value: 27 },
  { day: "Cum", value: 39 },
  { day: "Cmt", value: 22 },
  { day: "Paz", value: 18 },
];

export default function DailyTrendChart() {
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
        📈 Günlere Göre Kokpit Süresi
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}