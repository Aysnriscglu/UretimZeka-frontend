import { Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ color: "#fff" }}>
        Bakım Analizi
      </Typography>

      <Typography
  variant="body1"
  sx={{ color: "rgba(255,255,255,0.75)" }}
>
        Üretim duruş kayıtlarından bakım analizleri
      </Typography>
    </Box>
  );
}