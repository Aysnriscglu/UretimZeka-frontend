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
} from "recharts";

type Props = {
  rows: any[];
};

export default function MachineChart({ rows }: Props) {
  const machineCounts: Record<string, number> = {};

  rows.forEach((row) => {
    const machine = row["Makine"] || "Bilinmiyor";
    machineCounts[machine] = (machineCounts[machine] || 0) + 1;
  });

  const data = Object.entries(machineCounts)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

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
        En Çok Arıza Veren Makineler
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" stroke="#fff" />

          <YAxis
            type="category"
            dataKey="name"
            width={130}
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