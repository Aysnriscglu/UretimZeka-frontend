import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import type { SuggestionRow } from "./utils";
import { getGroupedStatus } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function StatusChart({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const statusMap = new Map<string, number>();

  rows.forEach((r) => {
    const status = getGroupedStatus(r);
    if (!status) return;
    statusMap.set(status, (statusMap.get(status) || 0) + 1);
  });

  const data = Array.from(statusMap.entries()).map(([name, value]) => ({
    name,
    value,
  })).sort((a, b) => b.value - a.value);

  // Modern colors for statuses
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={80}
          outerRadius={120}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            if (!value) return null;
            return (
              <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold" fontSize={16}>
                {value}
              </text>
            );
          }}
        >
          {data.map((entry, index) => {
            // Assign specific colors for known statuses
            let color = COLORS[index % COLORS.length];
            const lowerName = entry.name.toLowerCase();
            if (lowerName.includes("hayata geçti")) color = "#10b981"; // Emerald
            else if (lowerName.includes("reddedildi")) color = "#ef4444"; // Red
            
            return <Cell key={`cell-${index}`} fill={color} />;
          })}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "white",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
          itemStyle={{ color: "white", fontWeight: "bold" }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: "13px", color: "#cbd5e1" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
