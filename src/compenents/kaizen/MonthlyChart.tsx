import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";

type Props = { data: any[]; monthKey: string };

export default function MonthlyChart({ data, monthKey }: Props) {
  const counts: Record<string, number> = {};
  data.forEach(row => {
    const month = String(row[monthKey] ?? "Bilinmiyor").trim();
    if (month) counts[month] = (counts[month] || 0) + 1;
  });

  const chartData = Object.entries(counts).map(([month, count]) => ({ month, count }));

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>Aylara Göre Kaizen sayısı</Typography>
      {chartData.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi — Excel yuklediginizdde burası dolacak</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="month" stroke="#CBD5E1" tick={{ fontSize: 11 }} />
            <YAxis stroke="#CBD5E1" allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Kaizen Sayisi">
              <LabelList dataKey="count" position="top" fill="#fff" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
