import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[]; monthKey: string };

export default function AreaChart({ data, monthKey }: Props) {
  const scoreKey = data[0]
    ? getKey(data[0], "Kaizen Puani", "Kaizen Puanı", "puan", "Puan", "score", "Score")
    : "Kaizen Puani";

  const grouped: Record<string, { sum: number; count: number }> = {};
  data.forEach(row => {
    const month = String(row[monthKey] ?? "?").trim();
    if (!grouped[month]) grouped[month] = { sum: 0, count: 0 };

    const val = row[scoreKey];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      const score = Number(val);
      if (!isNaN(score)) {
        grouped[month].sum += score;
        grouped[month].count += 1;
      }
    }
  });

  const chartData = Object.entries(grouped).map(([month, v]) => ({
    month,
    puan: v.count > 0 ? Math.round(v.sum / v.count) : 0,
  }));

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>Aylik Ortalama Puan Trendi</Typography>
      {chartData.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <ReAreaChart data={chartData}>
            <defs>
              <linearGradient id="puanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#28c7d9" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#28c7d9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="month" stroke="#CBD5E1" tick={{ fontSize: 11 }} />
            <YAxis stroke="#CBD5E1" />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #28c7d9", borderRadius: 8 }} />
            <Area type="monotone" dataKey="puan" stroke="#28c7d9" strokeWidth={2} fill="url(#puanGrad)" name="Ort. Puan">
              <LabelList dataKey="puan" position="top" fill="#fff" fontSize={11} fontWeight="bold" />
            </Area>
          </ReAreaChart>

        </ResponsiveContainer>
      )}
    </Paper>
  );
}
