import { Paper, Typography, Box, Button } from "@mui/material";
import { useMemo, useState } from "react";
import RootCauseDataGrid from "./RootCauseDataGrid";
import RootCauseKPIs from "./RootCauseKPIs";
import Grid from "@mui/material/Grid";
import MachineChart from "./MachineChart";
import CallReasonChart from "./CallReasonChart";
import ShiftChart from "./ShiftChart";
import StopReasonChart from "./StopReasonChart";
import HeatMap from "./HeatMap";
import RootCauseChart from "./RootCauseChart";
import DailyErrorTrend from "./DailyTrendChart";
import RootCauseTable from "./RootCauseTable";

type Props = {
  rows: any[];
};

export default function RootCauseSection({ rows }: Props) {
  
  const [selectedArea, setSelectedArea] = useState("9.HAT KASNAK");

  const filteredRows = useMemo(() => {
    return rows.filter(
      (row) => row["Alan Kodu"] === selectedArea
    );
  }, [rows, selectedArea]);



  return (
    <Paper
      sx={{
        mt: 5,
        p: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#fff",
          mb: 3,
          fontWeight: 700,
        }}
      >
        Kök Neden Analizi
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant={
            selectedArea === "9.HAT KASNAK"
              ? "contained"
              : "outlined"
          }
          onClick={() => setSelectedArea("9.HAT KASNAK")}
        >
          Kasnak
        </Button>

        <Button
          variant={
            selectedArea === "9.HAT MONTAJ"
              ? "contained"
              : "outlined"
          }
          onClick={() => setSelectedArea("9.HAT MONTAJ")}
        >
          Montaj
        </Button>
      </Box>

      <Typography color="white">
        Seçilen Alan : <b>{selectedArea}</b>
      </Typography>

      <Typography color="white" sx={{ mt: 1 }}>
        Toplam Kayıt : <b>{filteredRows.length}</b>
        
      </Typography>
      
      <RootCauseKPIs rows={filteredRows} />
      <Grid container spacing={2} sx={{ mt: 2 }}>

  <Grid size={{ xs: 12, md: 6 }}>
    <StopReasonChart rows={filteredRows} />
  </Grid>

  <Grid size={{ xs: 12, md: 6 }}>
    <ShiftChart rows={filteredRows} />
  </Grid>

</Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
  <Grid size={{ xs: 12, md: 6 }}>
    <MachineChart rows={filteredRows} />
  </Grid>

  <Grid size={{ xs: 12, md: 6 }}>
  <CallReasonChart rows={filteredRows} />
</Grid>
</Grid>




<Grid container spacing={2} sx={{ mt: 2 }}>
  <Grid size={{ xs: 12 }}>
    <DailyErrorTrend rows={rows} />
  </Grid>
</Grid>



    </Paper>
  );
}