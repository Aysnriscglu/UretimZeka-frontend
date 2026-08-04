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

export default function WorkCenterChart({ rows }: Props) {
  if (!rows || rows.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
           px: 2,
  pt: 2,
  pb: 1,
          borderRadius: 4,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.08)",
          height:600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Henüz veri yüklenmedi.
      </Paper>
    );
  }

  const chartData = Object.entries(
    rows.reduce((acc: Record<string, number>, row) => {
      // İş Merkezi sütununu oku
      const center = String(row["İş Merkezi"] ?? "")
        .replace(/\s+/g, " ")
        .trim();

      if (center !== "") {
        acc[center] = (acc[center] || 0) + 1;
      }

      return acc;
    }, {})
  )
    .map(([center, count]) => ({
      center,
      count: Number(count),
    }))
    .sort((a, b) => b.count - a.count);
 

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
        sx={{ mb: 1, color: "#fff", fontWeight: 600 }}
      >
        İş Merkezi Analizi
      </Typography>

     <div style={{ width: "100%", height: chartData.length * 45 }}>
<ResponsiveContainer
    width="100%"
    height="70%"
>
<BarChart
  data={chartData}
  margin={{
    top: 5,
    right: 5,
    left: -15,
    bottom: 90,
  }}
>
  <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

<XAxis
    dataKey="center"
    interval={0}
    angle={-25}
    textAnchor="end"
    height={85}
    tick={{ fontSize: 11 }}
/>

<YAxis
  domain={[0, 'dataMax + 5']}
/>
  <Tooltip />

  <Bar
    dataKey="count"
    fill="#22c55e"
    radius={[8, 8, 0, 0]}
  />
</BarChart>
      
      </ResponsiveContainer>
</div>
    </Paper>
  );
}