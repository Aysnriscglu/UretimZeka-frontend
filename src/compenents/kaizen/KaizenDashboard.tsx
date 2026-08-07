import { useState, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import KaizenKPIs from "./KaizenKPI";
import FilterBar from "./FilterBar";
import MonthlyChart from "./MonthlyChart";
import DepartmentChart from "./DepartmentChart";
import AreaChart from "./AreaChart";
import DetailTypeChart from "./DetailTypeChart";
import ScoreChart from "./ScoreChart";
import TeamMembersChart from "./TeamMembersChart";
import DepartmentSummaryCards from "./DepartmentSummaryCards";

// Sutun adini kismli eslestirme ile bul (case-insensitive)
export function getKey(row: any, ...candidates: string[]): string {
  if (!row) return candidates[0];
  const keys = Object.keys(row);
  for (const cand of candidates) {
    const found = keys.find(k => k.toLowerCase().trim() === cand.toLowerCase().trim());
    if (found) return found;
  }
  for (const cand of candidates) {
    const found = keys.find(k => k.toLowerCase().includes(cand.toLowerCase().substring(0, 4)));
    if (found) return found;
  }
  return candidates[0];
}

type Props = { data: any[] };

export default function KaizenDashboard({ data }: Props) {
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const firstRow = data[0];
  const monthKey = firstRow ? getKey(firstRow, "Ay", "ay", "Month", "MONTH") : "Ay";
  const deptKey = firstRow
    ? getKey(firstRow,
        "Kaizeni Uygulayan Bolum",
        "Kaizeni Uygulayan Bölüm",
        "Kaizen Uygulamasini Gerceklestiren Bolum",
        "Kaizen Uygulamasını Gerçekleştiren Bölüm",
        "Uygulayan Bolum",
        "Kaizeni Yazan Bolum",
        "Kaizeni Yazan Bölüm",
        "Bolum",
        "Bölüm"
      )
    : "Kaizeni Uygulayan Bölüm";

  const months = useMemo(
    () => Array.from(new Set(data.map(r => r[monthKey]))).filter(Boolean) as string[],
    [data, monthKey]
  );
  const depts = useMemo(
    () => Array.from(new Set(data.map(r => r[deptKey]))).filter(Boolean).sort() as string[],
    [data, deptKey]
  );

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const monthMatch = !filterMonth || row[monthKey] === filterMonth;
      const deptMatch = !filterDept || row[deptKey] === filterDept;
      const searchMatch =
        !filterSearch ||
        Object.values(row).some(v => String(v).toLowerCase().includes(filterSearch.toLowerCase()));
      return monthMatch && deptMatch && searchMatch;
    });
  }, [data, filterMonth, filterDept, filterSearch, monthKey, deptKey]);

  return (
    <Box mt={4}>
      <Typography variant="h4" fontWeight={700} color="white" mb={3}>
        Kaizen Dashboard
      </Typography>

      <KaizenKPIs data={filteredData} />

      <FilterBar
        months={months}
        depts={depts}
        filterMonth={filterMonth}
        filterDept={filterDept}
        filterSearch={filterSearch}
        onMonthChange={setFilterMonth}
        onDeptChange={setFilterDept}
        onSearchChange={setFilterSearch}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
          mt: 3,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <MonthlyChart data={filteredData} monthKey={monthKey} />
        <DepartmentChart data={filteredData} deptKey={deptKey} />
        <AreaChart data={filteredData} monthKey={monthKey} />
        <DetailTypeChart data={filteredData} />
        <ScoreChart data={filteredData} />
        <TeamMembersChart data={filteredData} />
      </Box>

      <Box mt={4}>
        <DepartmentSummaryCards data={filteredData} />
      </Box>
    </Box>
  );
}
