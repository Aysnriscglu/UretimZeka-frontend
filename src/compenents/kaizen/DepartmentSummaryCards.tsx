import { Box, Paper, Typography, Chip, Divider } from "@mui/material";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[] };

export default function DepartmentSummaryCards({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3 }}>
        <Typography color="#64748B">Veri bulunamadi. Lutfen Excel dosyasi yukleyin.</Typography>
      </Paper>
    );
  }

  const firstRow = data[0];
  const deptKey = getKey(firstRow,
    "Kaizeni Uygulayan Bolum", "Kaizeni Uygulayan Bölüm",
    "Kaizen Uygulamasini Gerceklestiren Bolum", "Kaizen Uygulamasını Gerçekleştiren Bölüm",
    "Uygulayan Bolum", "Kaizeni Yazan Bolum", "Kaizeni Yazan Bölüm", "Bolum", "Bölüm"
  );
  const scoreKey = getKey(firstRow, "Kaizen Puani", "Kaizen Puanı", "puan", "Puan");
  const key1 = getKey(firstRow, "Kaizen Ekip Uyesi - 1", "Kaizen Ekip Üyesi - 1");
  const key2 = getKey(firstRow, "Kaizen Ekip Uyesi - 2", "Kaizen Ekip Üyesi - 2");
  const key3 = getKey(firstRow, "Kaizen Ekip Uyesi - 3", "Kaizen Ekip Üyesi - 3");

  // Her bolum icin istatistik hesapla
  const deptMap: Record<string, { count: number; scoreSum: number; members: Record<string, number> }> = {};

  data.forEach(row => {
    const dept = String(row[deptKey] ?? "Bilinmiyor").trim();
    if (!dept) return;
    if (!deptMap[dept]) deptMap[dept] = { count: 0, scoreSum: 0, members: {} };
    deptMap[dept].count++;
    deptMap[dept].scoreSum += Number(row[scoreKey]) || 0;

    [row[key1], row[key2], row[key3]].forEach(m => {
      const name = String(m ?? "").trim();
      if (name) deptMap[dept].members[name] = (deptMap[dept].members[name] || 0) + 1;
    });
  });

  const departments = Object.entries(deptMap)
    .map(([name, stats]) => {
      const avgScore = stats.count > 0 ? Math.round(stats.scoreSum / stats.count) : 0;
      const topMember = Object.entries(stats.members).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
      return { name, count: stats.count, avgScore, topMember };
    })
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...departments.map(d => d.count), 1);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22C55E";
    if (score >= 60) return "#3B82F6";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <Box>
      <Typography color="white" fontWeight={700} fontSize={18} mb={2}>
        Bolum Bazinda Kaizen Ozeti
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {departments.map((dept, i) => (
          <Paper
            key={dept.name}
            sx={{
              p: 2.5,
              bgcolor: "#182434",
              borderRadius: 3,
              border: "1px solid #1E3A5F",
              position: "relative",
              overflow: "hidden",
              transition: "0.3s",
              "&:hover": { transform: "translateY(-4px)", borderColor: "#3B82F6", boxShadow: "0 12px 30px rgba(59,130,246,0.2)" },
            }}
          >
            {/* Sira numarasi */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 14,
                fontSize: 28,
                fontWeight: 800,
                color: i === 0 ? "#F59E0B" : i === 1 ? "#94A3B8" : i === 2 ? "#CD7F32" : "#1E3A5F",
                lineHeight: 1,
              }}
            >
              {i + 1}
            </Box>

            {/* Bolum adi */}
            <Typography color="white" fontWeight={700} fontSize={14} pr={4} mb={1.5} sx={{ lineHeight: 1.3 }}>
              {dept.name}
            </Typography>

            <Divider sx={{ borderColor: "#1E3A5F", mb: 1.5 }} />

            {/* Istatistikler */}
            <Box display="flex" gap={2} mb={1.5}>
              <Box>
                <Typography color="#94A3B8" fontSize={11}>Kaizen Sayisi</Typography>
                <Typography color="white" fontWeight={700} fontSize={22}>{dept.count}</Typography>
              </Box>
              <Box>
                <Typography color="#94A3B8" fontSize={11}>Ort. Puan</Typography>
                <Typography color={getScoreColor(dept.avgScore)} fontWeight={700} fontSize={22}>
                  {dept.avgScore}
                </Typography>
              </Box>
            </Box>

            {/* Progress bar - kaizen sayisi orani */}
            <Box sx={{ bgcolor: "#0F1E30", borderRadius: 1, height: 6, mb: 1.5, overflow: "hidden" }}>
              <Box
                sx={{
                  width: `${(dept.count / maxCount) * 100}%`,
                  height: "100%",
                  bgcolor: "#3B82F6",
                  borderRadius: 1,
                  transition: "width 1s ease",
                }}
              />
            </Box>

            {/* En aktif uye */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography color="#64748B" fontSize={11}>En Aktif:</Typography>
              <Chip
                label={dept.topMember}
                size="small"
                sx={{ bgcolor: "#0F2236", color: "#28c7d9", fontSize: 11, height: 22 }}
              />
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
