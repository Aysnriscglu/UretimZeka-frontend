import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[] };

export default function DetailTypeChart({ data }: Props) {
  const typeKey = data[0]
    ? getKey(data[0], "Detay Iyilestirme Turu", "Detay İyileştirme Türü", "iyilestirme turu", "Tur", "Tür", "type", "Type")
    : "Detay Iyilestirme Turu";

  const counts: Record<string, number> = {};
  data.forEach(row => {
    const tur = String(row[typeKey] ?? "Bilinmiyor").trim();
    if (tur) counts[tur] = (counts[tur] || 0) + 1;
  });

  const chartData = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>İyileştirme Türü Dağılımı</Typography>
      {chartData.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#CBD5E1"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis stroke="#CBD5E1" allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#A855F7" radius={[8, 8, 0, 0]} name="Kaizen Sayisi">
              <LabelList dataKey="count" position="top" fill="#fff" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
