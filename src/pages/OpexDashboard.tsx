import { Box, Typography } from "@mui/material";
import { useState } from "react";
import * as XLSX from "xlsx";

import ExcelUploadCard from "../compenents/opex/ExcelUploadCard";
import OpexKPIs from "../compenents/opex/OpexKPIs";
import TopEmployees from "../compenents/opex/TopEmployees";
import ProblemStatusChart from "../compenents/opex/ProblemStatusChart";
import GeneralOverview from "../compenents/5S/GeneralOverview";
import FilterPanel from "../compenents/5S/FilterPanel";
import DailyTrendChart from "../compenents/5S/DailyTrendChart";
import CompletionChart from "../compenents/5S/CompletionChart";
import ComplianceChart from "../compenents/5S/ComplianceChart";
import AttendanceKPIs from "../compenents/5S/AttendanceKPIs";

import AttendanceDepartmentCards from "../compenents/5S/AttendanceDepartmentCards";

import DashboardTabs, {
  type TabType,
} from "../compenents/dashboard/dashboardTabs";

export default function OpexDashboard() {
  const [activeTab, setActiveTab] =
    useState<TabType>("kaizen");

  const [rows, setRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");

  const handleExcelUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(
        event.target?.result as ArrayBuffer
      );

      const workbook = XLSX.read(data, {
        type: "array",
      });

      const sheet =
        workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);

      setRows(json);

      console.log(json);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Box
      sx={{
        px: 4,
        pt: 1,
        pb: 3,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            component="img"
            src="logo.png"
            alt="OPEX"
            sx={{
              width: 180,
              height: "auto",
            }}
          />

          <Box>
            <Typography
              sx={{
                fontSize: 42,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              OPEX Kokpit Paneli
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                mt: 1,
              }}
            >
              Sürekli İyileştirme • Problem Yönetimi •
              Öneri Sistemi • 5S
            </Typography>
          </Box>
        </Box>

        <Box textAlign="right">
          <Typography color="#94A3B8">
            Son Güncelleme
          </Typography>

          <Typography
            color="white"
            fontWeight={700}
          >
            27.07.2026
          </Typography>
        </Box>
      </Box>

      {/* SEKMELER */}
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* EXCEL */}
      <ExcelUploadCard
        fileName={fileName}
        onUpload={handleExcelUpload}
      />

      {/* KAIZEN */}
      {activeTab === "kaizen" && (
        <>
          <Box mt={3}>
            <OpexKPIs data={rows} />
          </Box>

          <Box
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1fr 1fr",
              },
              gap: 3,
            }}
          >
            <TopEmployees data={rows} />
            <ProblemStatusChart data={rows} />
          </Box>
        </>
      )}
   
{activeTab === "5s" && (
  <Box mt={5}>

    <FilterPanel />

    <Box mt={4}>
      <GeneralOverview />
    </Box>

    <Box
  mt={4}
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      lg: "2fr 1fr",
    },
    gap: 3,
  }}
>
  <DailyTrendChart />
  <CompletionChart />
</Box>
<Box mt={4}>
    <ComplianceChart />
</Box>
<AttendanceKPIs rows={rows} />

<AttendanceDepartmentCards rows={rows} />

 


  </Box>
)}

      {/* ÖNERİ */}
      {activeTab === "suggestion" && (
        <Box mt={5}>
          <Typography
            variant="h4"
            color="white"
            fontWeight={700}
          >
          Kaizen  sayfası 
          </Typography>

          <Typography
            color="#94A3B8"
            mt={2}
          >
            Bu sayfa hazırlanıyor...
          </Typography>
        </Box>
      )}
    </Box>
  );
}
