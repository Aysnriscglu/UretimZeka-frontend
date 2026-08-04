import { Container, Typography } from "@mui/material";
import RootCauseFilter from "./RootCauseFilter";
import MachineChart from "./MachineChart";

export default function RootCause() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 4,
        }}
      >
        Kök Neden Analizi
      </Typography>
    </Container>
  );
}