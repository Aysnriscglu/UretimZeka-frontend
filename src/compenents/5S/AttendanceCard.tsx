import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

type Props = {
  row: any;
};

export default function AttendanceCard({ row }: Props) {
  const attended = row["KATILIM"] === "✔";

  const late =
    row["GEÇ KATILIM MI?"] === "Evet";

  const excuse =
    row["MAZERETLİ Mİ?"] === "Evet";

  return (
    <Card
      sx={{
        background: "#1f2937",
        color: "white",
        borderRadius: 4,
        borderLeft: `8px solid ${
          attended ? "#22c55e" : "#ef4444"
        }`,
        transition: ".25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 8,
        },
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight={700}
        >
          🏭 {row["BÖLÜM"]}
        </Typography>

        <Box mt={2}>

          <Typography>
            📅 Hafta : {row["HAFTA"]}
          </Typography>

          <Typography mt={1}>
            Katılım :
            {" "}
            {attended ? "✅ Katıldı" : "❌ Katılmadı"}
          </Typography>

          <Typography mt={1}>
            ⏰ Geç :
            {" "}
            {late ? "Evet" : "Hayır"}
          </Typography>

          <Typography mt={1}>
            📋 Mazeret :
            {" "}
            {excuse ? "Evet" : "Hayır"}
          </Typography>

          <Typography mt={1}>
            🚫 Katılmadığı Gün :
            {" "}
            {row["KATILIM OLMAYAN GÜN SAYISI"]}
          </Typography>

        </Box>

        <Box mt={2}>

          <Chip
            label={
              attended
                ? "Katıldı"
                : "Katılmadı"
            }
            color={
              attended
                ? "success"
                : "error"
            }
          />

        </Box>

      </CardContent>
    </Card>
  );
}