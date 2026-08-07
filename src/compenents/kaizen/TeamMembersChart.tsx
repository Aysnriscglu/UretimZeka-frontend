import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[] };

export default function TeamMembersChart({ data }: Props) {
  const key1 = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 1", "Kaizen Ekip Üyesi - 1", "Ekip Uyesi 1", "Ekip 1") : "Kaizen Ekip Uyesi - 1";
  const key2 = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 2", "Kaizen Ekip Üyesi - 2", "Ekip Uyesi 2", "Ekip 2") : "Kaizen Ekip Uyesi - 2";
  const key3 = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 3", "Kaizen Ekip Üyesi - 3", "Ekip Uyesi 3", "Ekip 3") : "Kaizen Ekip Uyesi - 3";

  const counts: Record<string, number> = {};
  data.forEach(row => {
    [row[key1], row[key2], row[key3]].forEach(member => {
      const name = String(member ?? "").trim();
      if (name) counts[name] = (counts[name] || 0) + 1;
    });
  });

  const chartData = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>En Aktif Ekip Uyeleri</Typography>
      {chartData.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#CBD5E1" allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={130} tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#28c7d9" radius={[0, 8, 8, 0]} name="Kaizen Sayisi">
               <LabelList dataKey="count" position="right" fill="#fff" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
