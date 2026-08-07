import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList
} from "recharts";
import type { SuggestionRow } from "./utils";
import { getSuggestionReward, getGroupedStatus } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function RewardChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const statusRewardMap = new Map<string, Record<string, number>>();

  rows.forEach((r) => {
    const status = getGroupedStatus(r);
    const reward = getSuggestionReward(r);
    const rKey = (!reward || reward === "Yok" || reward === "") ? "Yok" : reward;

    if (!statusRewardMap.has(status)) {
      statusRewardMap.set(status, { "Yüksek Puan": 0, "Normal Puan": 0, "Yok": 0, "Diğer": 0 });
    }
    
    const obj = statusRewardMap.get(status)!;
    if (rKey.toLowerCase().includes("altın") || rKey.toLowerCase().includes("gold") || rKey.toLowerCase().includes("yüksek")) obj["Yüksek Puan"]++;
    else if (rKey.toLowerCase().includes("gümüş") || rKey.toLowerCase().includes("silver") || rKey.toLowerCase().includes("normal")) obj["Normal Puan"]++;
    else if (rKey.toLowerCase().includes("yok")) obj["Yok"]++;
    else obj["Diğer"]++;
  });

  const data = Array.from(statusRewardMap.entries()).map(([name, rewards]) => ({
    name,
    ...rewards
  })).sort((a, b) => b.name.localeCompare(a.name));

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0 || value == null) return null;
    return (
      <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {value}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 10,
          right: 30,
          left: 40,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          itemStyle={{ color: "white", fontWeight: "bold" }}
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
        />
        <Legend wrapperStyle={{ fontSize: "13px", color: "#cbd5e1" }} />
        <Bar dataKey="Yüksek Puan" stackId="a" fill="#fbbf24" barSize={24}>
          <LabelList dataKey="Yüksek Puan" content={renderCustomLabel} />
        </Bar>
        <Bar dataKey="Normal Puan" stackId="a" fill="#94a3b8">
          <LabelList dataKey="Normal Puan" content={renderCustomLabel} />
        </Bar>
        <Bar dataKey="Diğer" stackId="a" fill="#3b82f6">
          <LabelList dataKey="Diğer" content={renderCustomLabel} />
        </Bar>
        <Bar dataKey="Yok" stackId="a" fill="#64748b">
          <LabelList dataKey="Yok" content={renderCustomLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
