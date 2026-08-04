import {
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";

type Props = {
  data: any[];
};

export default function OpexKPIs({ data }: Props) {

  const toplamProblem = data.length;

  const hayataGecen = data.filter(
    (x) => x["Statü"] === "Hayata Geçti"
  ).length;

  const beklemede = data.filter(
    (x) => x["Statü"] === "Beklemede"
  ).length;

  const acikProblem = data.filter(
    (x) =>
      x["Statü"] === "Açık" ||
      x["Statü"] === "Devam Ediyor"
  ).length;

  const katilim = new Set(
    data.map((x) => x["Yazar"])
  ).size;
  const reddedilen = data.filter(
  (x) =>
    x["Statü"] === "Reddedildi" ||
    x["Statü"] === "Teknik Değerlendirmede Reddedildi"
).length;

const hayataGecmeOrani =
  toplamProblem === 0
    ? 0
    : ((hayataGecen / toplamProblem) * 100).toFixed(1);

const reddedilmeOrani =
  toplamProblem === 0
    ? 0
    : ((reddedilen / toplamProblem) * 100).toFixed(1);

 const cards = [
  {
    title: "Toplam Öneri",
    value: toplamProblem,
    color: "#3b82f6",
    sub: "Toplam Kayıt",
  },
  {
    title: "Hayata Geçen",
    value: hayataGecen,
    color: "#22c55e",
    sub: "Öneri",
  },
  {
    title: "Hayata Geçme Oranı",
    value: `%${hayataGecmeOrani}`,
    color: "#06b6d4",
    sub: "Başarı",
  },
  {
    title: "Reddedilme Oranı",
    value: `%${reddedilmeOrani}`,
    color: "#ef4444",
    sub: "Red",
  },
  {
    title: "Katılım",
    value: katilim,
    color: "#8b5cf6",
    sub: "Personel",
  },
];

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, md: 2.4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 5,
              background: "#182434",
              borderLeft: `6px solid ${card.color}`,
              height: 165,
            }}
          >
            <Typography
              sx={{
                color: "#9CA3AF",
                fontSize: 15,
              }}
            >
              {card.title}
            </Typography>

            <Typography
              sx={{
                color: "white",
                fontWeight: 800,
                fontSize: 40,
                mt: 1,
              }}
            >
              {card.value}
            </Typography>

            <Box
              sx={{
                mt: 2,
                color: card.color,
                fontWeight: 700,
              }}
            >
              {card.sub}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}