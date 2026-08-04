import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

const data = [
  { week: "1.Hafta", value: 82 },
  { week: "2.Hafta", value: 91 },
  { week: "3.Hafta", value: 88 },
  { week: "4.Hafta", value: 96 },
];

export default function ComplianceChart() {
  return (
    <Paper
      sx={{
        p: 3,
        mt: 4,
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
        📊 Haftalara Göre Hedefe Uyum
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="week" />

          <YAxis domain={[0, 100]} />

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