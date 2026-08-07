import { Grid, Paper, Typography, Box } from "@mui/material";
import { getKey } from "./KaizenDashboard";

type Props = { data: any[] };

export default function KaizenKPIs({ data }: Props) {
  const totalKaizen = data.length;

  const scoreKey = data[0] ? getKey(data[0], "Kaizen Puani", "Kaizen Puanı", "puan", "Puan", "Score", "score") : "Kaizen Puanı";
  const deptKey = data[0] ? getKey(data[0], "Kaizeni Uygulayan Bolum", "Kaizeni Uygulayan Bölüm", "Kaizeni Yazan Bolum", "Kaizeni Yazan Bölüm", "Uygulayan Bolum", "Bolum", "Bölüm") : "Kaizeni Yazan Bölüm";
  
  const member1Key = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 1", "Kaizen Ekip Üyesi - 1", "Ekip Uyesi 1", "Ekip 1") : "Kaizen Ekip Üyesi - 1";
  const member2Key = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 2", "Kaizen Ekip Üyesi - 2", "Ekip Uyesi 2", "Ekip 2") : "Kaizen Ekip Üyesi - 2";
  const member3Key = data[0] ? getKey(data[0], "Kaizen Ekip Uyesi - 3", "Kaizen Ekip Üyesi - 3", "Ekip Uyesi 3", "Ekip 3") : "Kaizen Ekip Üyesi - 3";

  let validScoreCount = 0;
  const sumScores = data.reduce((sum, row) => {
    const val = row[scoreKey];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
       const num = Number(val);
       if (!isNaN(num)) {
         validScoreCount++;
         return sum + num;
       }
    }
    return sum;
  }, 0);

  const averageScore = validScoreCount > 0 ? (sumScores / validScoreCount).toFixed(1) : "0";

  const departmentCount = new Set(data.map((r) => String(r[deptKey] || "").trim()).filter(Boolean)).size;

  const employeeCount = new Set(
    data.flatMap((r) => [
      String(r[member1Key] || "").trim(),
      String(r[member2Key] || "").trim(),
      String(r[member3Key] || "").trim(),
    ]).filter(Boolean)
  ).size;

  const cards = [
    { title: "Toplam Kaizen", value: totalKaizen, color: "#3B82F6", icon: "📄" },
    { title: "Ortalama Puan", value: averageScore, color: "#22C55E", icon: "⭐" },
    { title: "Aktif Bölüm", value: departmentCount, color: "#F59E0B", icon: "🏭" },
    { title: "Aktif Personel", value: employeeCount, color: "#A855F7", icon: "👥" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4, width: "100%", overflow: "hidden" }}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Paper
            elevation={0}
            sx={{
              background: "#182434",
              borderRadius: 4,
              p: 3,
              position: "relative",
              overflow: "hidden",
              transition: ".35s",
              "&:hover": { transform: "translateY(-8px)", boxShadow: "0 15px 35px rgb(76,122,221)" },
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0, top: 0, bottom: 0,
                width: 6,
                background: card.color,
              },
            }}
          >
            <Typography sx={{ fontSize: 16, color: "#94A3B8" }}>
              {card.icon} {card.title}
            </Typography>
            <Typography sx={{ mt: 2, fontWeight: 700, color: "#fff", fontSize: 42 }}>
              {card.value}
            </Typography>
            <Box sx={{ mt: 2, color: card.color, fontWeight: 600 }}>Güncel Veri</Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
