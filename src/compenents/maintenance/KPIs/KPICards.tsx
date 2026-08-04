
import { Grid, Paper, Typography, Box } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimerIcon from "@mui/icons-material/Timer";

type Props = {
  rows: any[];
};

export default function KPICards({ rows }: Props) {
  // Toplam kayıt
  const totalCalls = rows.length;

  // Tamamlanan çağrı sayısı
  // Excel'de "Durum" kolonu varsa onu kullanacağız.
  const completedCalls = rows.filter((row) => {
    const status =
      String(
        row["Durum"] ??
          row["STATUS"] ??
          row["Status"] ??
          row["İş Durumu"] ??
          ""
      ).toLowerCase();

    return (
      status.includes("tamam") ||
      status.includes("complete") ||
      status.includes("kapalı") ||
      status.includes("closed")
    );
  }).length;

// Ortalama MTTR
const mttrValues = rows
  .map((row) =>
    Number(
      String(
        row["Müdahale Süresi(dk)"] ??
          row["Müdahale Süresi (dk)"] ??
          row["MTTR"] ??
          0
      ).replace(",", ".")
    )
  )
  .filter((v) => !isNaN(v) && v > 0);

const averageMTTR =
  mttrValues.length > 0
    ? `${(
        mttrValues.reduce((a, b) => a + b, 0) / mttrValues.length
      ).toFixed(1)} dk`
    : "-";
// Ortalama MTBF
const mtbfValues = rows
  .map((row) =>
    Number(
      String(
        row["MTBF"] ??
        row["Ortalama MTBF"] ??
        row["Arızalar Arası Süre"] ??
        0
      ).replace(",", ".")
    )
  )
  .filter((v) => !isNaN(v) && v > 0);

const averageMTBF =
  mtbfValues.length > 0
    ? `${(
        mtbfValues.reduce((a, b) => a + b, 0) /
        mtbfValues.length
      ).toFixed(1)} dk`
    : "-";
// Ortalama Bekleme
const waitingValues = rows
  .map((row) =>
    Number(
      String(
        row["Müdahale Bekleme Zamanı (dk)"] ??
          row["Müdahale Bekleme Zamanı(dk)"] ??
          row["Bekleme Süresi"] ??
          0
      ).replace(",", ".")
    )
  )
  .filter((v) => !isNaN(v) && v >= 0);

const averageWaiting =
  waitingValues.length > 0
    ? `${(
        waitingValues.reduce((a, b) => a + b, 0) /
        waitingValues.length
      ).toFixed(1)} dk`
    : "-";

  const cards = [
    {
      title: "Toplam Çağrı",
      value: totalCalls,
      icon: <BuildIcon sx={{ fontSize: 42, color: "#38bdf8" }} />,
    },
    {
      title: "Tamamlanan",
      value: completedCalls,
      icon: <CheckCircleIcon sx={{ fontSize: 42, color: "#22c55e" }} />,
    },
    {
      title: "Ortalama MTTR",
      value: averageMTTR,
      icon: <AccessTimeIcon sx={{ fontSize: 42, color: "#f59e0b" }} />,
    },
    {
      title: "Ortalama Bekleme",
      value: averageWaiting,
      icon: <TimerIcon sx={{ fontSize: 42, color: "#ef4444" }} />,
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              minHeight: 170,
              borderRadius: 4,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              transition: "all .25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                borderColor: "#38bdf8",
                boxShadow: "0 10px 30px rgba(56,189,248,.15)",
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              height="100%"
            >
              <Box>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,.65)",
                    fontSize: 18,
                    fontWeight: 500,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    mt: 2,
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {card.value}
                </Typography>
              </Box>

              {card.icon}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}