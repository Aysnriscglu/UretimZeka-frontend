import { Paper, Typography } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from "recharts";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[] };

export default function ScoreChart({ data }: Props) {
  const scoreKey = data[0]
    ? getKey(data[0], "Kaizen Puani", "Kaizen Puanı", "puan", "Puan", "Score", "score")
    : "Kaizen Puani";

  const buckets: Record<string, number> = { "1-20": 0, "21-40": 0, "41-60": 0, "61-80": 0, "81-100": 0 };
  data.forEach(row => {
    const score = Number(row[scoreKey]) || 0;
    if (score <= 20) buckets["1-20"]++;
    else if (score <= 40) buckets["21-40"]++;
    else if (score <= 60) buckets["41-60"]++;
    else if (score <= 80) buckets["61-80"]++;
    else buckets["81-100"]++;
  });

  const chartData = Object.entries(buckets).map(([range, count]) => ({ range, count }));

  return (
    <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3, height: 360 }}>
      <Typography color="white" fontWeight={700} mb={2}>Kaizen Puan Dagilimi</Typography>
      {data.length === 0 ? (
        <Typography color="#64748B" mt={6} textAlign="center">Veri bulunamadi</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={chartData}>
            <CartesianGrid stroke="#334155" />
            <XAxis dataKey="range" stroke="#CBD5E1" />
            <YAxis stroke="#CBD5E1" allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#0f2236", border: "1px solid #334155", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Kaizen Sayisi">
              <LabelList dataKey="count" position="top" fill="#fff" fontSize={11} fontWeight="bold" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
}
