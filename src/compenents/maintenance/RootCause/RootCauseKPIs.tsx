import { Grid, Paper, Typography } from "@mui/material";

type Props = {
  rows: any[];
};

export default function RootCauseKPIs({ rows }: Props) {
  const totalStops = rows.length;

  const totalDuration = rows.reduce(
    (sum, row) => sum + Number(row["Toplam Süre(dk)"] || 0),
    0
  );

  const avgDuration =
    totalStops > 0 ? (totalDuration / totalStops).toFixed(1) : 0;

  const machineCount = new Set(rows.map((r) => r["Makine"])).size;

  const cards = [
    {
      title: "Toplam Arıza",
      value: totalStops,
      color: "#1976d2",
    },
    {
      title: "Toplam Duruş",
      value: `${totalDuration.toFixed(0)} dk`,
      color: "#d32f2f",
    },
    {
      title: "Ort. Duruş",
      value: `${avgDuration} dk`,
      color: "#ed6c02",
    },
    {
      title: "Makine Sayısı",
      value: machineCount,
      color: "#2e7d32",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {cards.map((card) => (
        <Grid size={{ xs: 12, md: 3 }} key={card.title}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: "#182434",
              borderLeft: `6px solid ${card.color}`,
            }}
          >
            <Typography color="gray" fontSize={14}>
              {card.title}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 700,
                color: "white",
              }}
            >
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}