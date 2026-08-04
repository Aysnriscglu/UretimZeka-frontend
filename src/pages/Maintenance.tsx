import { Container, Grid } from "@mui/material";
import { useState } from "react";

import Header from "../compenents/maintenance/Header/Header";
import FilterBar from "../compenents/maintenance/Filters/FilterBar";
import ExcelUpload from "../compenents/maintenance/Upload/ExcelUpload";
import KPICards from "../compenents/maintenance/KPIs/KPICards";
import CallReasonChart from "../compenents/maintenance/Charts/CallReasonChart";
import WorkCenterChart from "../compenents/maintenance/Charts/WorkCenterChart";
import CallTable from "../compenents/maintenance/Tables/CallTable";
import RootCauseSection from "../compenents/maintenance/RootCause/RootCauseSection";
import { readExcel } from "../Services/excelService";

export default function Maintenance() {
  const [rows, setRows] = useState<any[]>([]);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;

    try {
      let allRows: any[] = [];

      for (const file of files) {
        const excel = await readExcel(file);

        excel.sheetNames.forEach((sheetName) => {
          allRows.push(...excel.sheets[sheetName]);
        });
      }

      setRows(allRows);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Header />

      <ExcelUpload onFileSelect={handleFileSelect} />

      <FilterBar />

      <KPICards rows={rows} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CallReasonChart rows={rows} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <WorkCenterChart rows={rows} />
        </Grid>
      </Grid>

      <CallTable rows={rows} />

      <RootCauseSection rows={rows} />
    </Container>
  );
}