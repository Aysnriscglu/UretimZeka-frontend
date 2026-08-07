import { Box, Typography, Grid, Paper } from "@mui/material";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";

import ExcelUploadCard from "../compenents/opex/ExcelUploadCard";
import DailyTrendChart from "../compenents/5S/DailyTrendChart";
import CompletionChart from "../compenents/5S/CompletionChart";
import ComplianceChart from "../compenents/5S/ComplianceChart";
import AttendanceKPIs from "../compenents/5S/AttendanceKPIs";

import AttendanceDepartmentCards from "../compenents/5S/AttendanceDepartmentCards";
import KaizenDashboard from "../compenents/kaizen/KaizenDashboard";
import SuggestionDashboard from "../compenents/suggestion/SuggestionDashboard";

import { SimpleErrorBoundary } from "../SimpleErrorBoundary";
import DashboardTabs, {
  type TabType,
} from "../compenents/dashboard/dashboardTabs";
import DownloadIcon from "@mui/icons-material/Download";
import { exportComponentAsPDF } from "../utils/pdfExport";
import { Button } from "@mui/material";

export default function OpexDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("kaizen");
  const [sheets, setSheets] = useState<{ name: string; data: any[] }[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    let name = "Opex_Raporu";
    if (activeTab === "kaizen") name = "Oneri_Sistemi_Raporu";
    else if (activeTab === "5s") name = "5S_Katilim_Raporu";
    else if (activeTab === "suggestion") name = "Kaizen_Raporu";

    await exportComponentAsPDF("report-content", name);
    setIsExporting(false);
  };

  const rows = useMemo(() => {
    if (sheets.length === 0) return [];
    if (activeTab === "5s") {
      return sheets.find(s => {
// ...

        const lowerName = s.name.toLocaleLowerCase("tr-TR");
        return lowerName.includes("takım liderleri") || lowerName.includes("takim liderleri");
      })?.data || sheets.find(s => {
        const lowerName = s.name.toLocaleLowerCase("tr-TR");
        return lowerName.includes("5s") || lowerName.includes("katılım") || lowerName.includes("attendance");
      })?.data || sheets.find(s => {
        if (!s.data[0]) return false;
        const keys = Object.keys(s.data[0]).join(" ").toLocaleLowerCase("tr-TR");
        return keys.includes("katılım") || keys.includes("hafta") || keys.includes("mazeret");
      })?.data || sheets[0].data;
    } else if (activeTab === "kaizen") { // This actually renders SuggestionDashboard
      return sheets.find(s => {
        const lowerName = s.name.toLowerCase();
        return lowerName.includes("öneri") || lowerName.includes("oneri") || lowerName.includes("tablo");
      })?.data || sheets.find(s => {
        if (!s.data[0]) return false;
        const keys = Object.keys(s.data[0]).join(" ").toLowerCase();
        return keys.includes("statü") || keys.includes("yazar");
      })?.data || sheets[0].data;
    } else if (activeTab === "suggestion") { // This actually renders KaizenDashboard
      return sheets.find(s => {
        const lowerName = s.name.toLowerCase();
        return lowerName.includes("kaizen") || lowerName.includes("takım") || lowerName.includes("lider");
      })?.data || sheets[0].data;
    }
    return sheets[0].data;
  }, [sheets, activeTab]);

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        setUploadError(null);
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const allSheets: { name: string; data: any[] }[] = [];

        for (const sheetName of workbook.SheetNames) {
           const sheet = workbook.Sheets[sheetName];
           const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
           if (!rawRows || rawRows.length === 0) continue;

           // Find the first row that looks like a header (look at first 20 rows)
           let headerRowIndex = -1;
           for (let i = 0; i < Math.min(20, rawRows.length); i++) {
             const row = rawRows[i];
             if (!row || !Array.isArray(row)) continue;
             const rowStr = row.map(v => String(v || "")).join(" ").toLocaleLowerCase("tr-TR");
             if (
               (rowStr.includes("hafta") || rowStr.includes("bölüm") || rowStr.includes("bolum") || rowStr.includes("katılım") || rowStr.includes("katil") || rowStr.includes("yazar")) && row.length >= 2
             ) {
               headerRowIndex = i;
               break;
             }
           }

           let sheetData = [];
           if (headerRowIndex !== -1) {
             const headerRow = rawRows[headerRowIndex];
             
             // Create ultra-clean keys (no spaces, no newlines, no symbols)
             const cleanHeaders = headerRow.map((h: any, idx: number) => {
               if (h == null || String(h).trim() === "") return `EMPTY_${idx}`;
               return String(h)
                 .toUpperCase()
                 .replace(/İ/g, 'I')
                 .replace(/I/g, 'I')
                 .replace(/[^A-Z0-9ÇĞÖŞÜ]/g, ''); // Sadece harf ve rakam
             });

             for (let i = headerRowIndex + 1; i < rawRows.length; i++) {
               const row = rawRows[i];
               if (!row || !Array.isArray(row) || row.length === 0) continue;
               
               const cleanRow: any = {};
               let hasData = false;
               for (let j = 0; j < cleanHeaders.length; j++) {
                 const val = row[j];
                 if (val !== undefined && val !== null && String(val).trim() !== "") {
                   hasData = true;
                 }
                 cleanRow[cleanHeaders[j]] = val;
               }
               
               if (hasData) {
                 sheetData.push(cleanRow);
               }
             }
           } else {
             // Fallback
             sheetData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
           }
           
           if (sheetData.length > 0) {
             allSheets.push({ name: sheetName, data: sheetData });
           }
        }

        if (allSheets.length > 0) {
           setSheets(allSheets);
        } else {
          setSheets([]);
          setUploadError("Yüklenen Excel dosyasında veri bulunamadı.");
        }
      } catch (error) {
        console.error("Excel okuma hatası:", error);
        setUploadError("Dosya okunurken bir hata oluştu. Lütfen Excel formatını kontrol edin.");
        setSheets([]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: "24px",
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0) 70%)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />
        
        <Box display="flex" alignItems="center" gap={3} sx={{ zIndex: 1, position: "relative" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
            }}
          >
            <Typography fontSize={32}>📈</Typography>
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: "linear-gradient(to right, #fff, #94a3b8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
              }}
            >
              OPEX Dashboard
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

        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleExportPDF}
          disabled={isExporting || sheets.length === 0}
          sx={{
            zIndex: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
            px: 3,
            py: 1.5,
          }}
        >
          {isExporting ? "Rapor Oluşturuluyor..." : "Rapor Oluştur (PDF)"}
        </Button>
      </Box>

      <Box mb={4}>
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Box>

      <ExcelUploadCard 
        onUpload={handleExcelUpload}
        fileName={fileName}
      />

      {/* CONTENT AREA TO BE EXPORTED */}
      <Box id="report-content" sx={{ p: 1, background: "#0f172a", borderRadius: 4 }}>
        {/* ÖNERİ (Suggestion Dashboard) */}
        {activeTab === "kaizen" && (
          <SimpleErrorBoundary>
            <SuggestionDashboard rows={rows} />
          </SimpleErrorBoundary>
        )}
    
        {/* 5S TAB */}
        {activeTab === "5s" && (
          <Box>
            {uploadError && (
              <Typography color="#ef4444" mt={4} textAlign="center" sx={{ p: 3, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 4, border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                ⚠️ {uploadError}
              </Typography>
            )}

            {rows.length === 0 ? (
              <Typography color="#94A3B8" mt={4} textAlign="center" sx={{ p: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px dashed rgba(255,255,255,0.1)' }}>
                Veri görüntülemek için lütfen Excel dosyasını yükleyin.
              </Typography>
            ) : (
              <Box>
                <Box mb={4}>
                  <AttendanceKPIs rows={rows} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                  <Box>
                    <DailyTrendChart rows={rows} />
                  </Box>

                  <Box>
                    <CompletionChart rows={rows} />
                  </Box>
                  
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <ComplianceChart rows={rows} />
                  </Box>
                </Box>

                <Box mt={4}>
                  <AttendanceDepartmentCards rows={rows} />
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* KAIZEN */}
        {activeTab === "suggestion" && (
          <SimpleErrorBoundary>
            <KaizenDashboard data={rows} />
          </SimpleErrorBoundary>
        )}
      </Box>
    </Box>
  );
}
