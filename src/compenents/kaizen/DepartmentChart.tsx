import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

type Props = { data: any[]; deptKey: string };

export default function DepartmentChart({ data, deptKey }: Props) {
  const counts: Record<string, number> = {};
  data.forEach(r => {
    const dep = String(r[deptKey] ?? "Bilinmiyor").trim();
    if (dep) counts[dep] = (counts[dep] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>Kaizen Uygulayan Bölüm</Typography>
      {chartData.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#CBD5E1" allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={130} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#22C55E" radius={[0, 8, 8, 0]} name="Kaizen Sayisi">
              <LabelList dataKey="count" position="right" fill="#fff" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
