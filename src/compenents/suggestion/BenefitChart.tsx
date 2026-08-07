import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import type { SuggestionRow } from "./utils";
import { getSuggestionBenefit } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function BenefitChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const benefitMap = new Map<string, number>();

  rows.forEach((r) => {
    const benefit = getSuggestionBenefit(r);
    if (!benefit) return;
    benefitMap.set(benefit, (benefitMap.get(benefit) || 0) + 1);
  });

  const data = Array.from(benefitMap.entries())
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort descending

  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={true} vertical={false} />
        <XAxis type="number" stroke="#64748b" tick={{ fill: "#94a3b8" }} />
        <YAxis 
          type="category" 
          dataKey="name" 
          stroke="#64748b" 
          tick={{ fill: "#94a3b8", fontSize: 12 }} 
          width={150}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          itemStyle={{ color: "white", fontWeight: "bold" }}
        />
        <Bar dataKey="count" name="Öneri Sayısı">
          <LabelList 
            dataKey="count" 
            position="right" 
            fill="#fff" 
            fontSize={12} 
            fontWeight="bold" 
            formatter={(val: number) => (val > 0 ? val : '')} 
          />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
