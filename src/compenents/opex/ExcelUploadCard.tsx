import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  fileName: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ExcelUploadCard({
  fileName,
  onUpload,
}: Props) {
  return (
    <Paper
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 4,
        background: "#182434",
        border: "1px dashed #3b82f6",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 4,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 700,
            mb: 1,
          }}
        >
          📂 OPEX Excel Raporu
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            mb: 3,
          }}
        >
          Güncel OPEX raporunu yükleyerek tüm KPI ve grafikler otomatik
          güncellenecektir.
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Excel Seç
            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={onUpload}
            />
          </Button>

          <Button variant="outlined">
            Yükle
          </Button>

          <Typography sx={{ color: "#94A3B8" }}>
            {fileName || "Dosya seçilmedi"}
          </Typography>
        </Box>
      </Box>

      {/* Info Panel on the Right */}
      <Box
        sx={{
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          borderRadius: 3,
          p: 2.5,
          minWidth: { xs: "100%", md: "380px" },
        }}
      >
        <Typography
          variant="subtitle2"
          color="#60a5fa"
          fontWeight="bold"
          mb={1.5}
          display="flex"
          alignItems="center"
          gap={1}
        >
          ℹ️ Hangi Excel Yüklenmeli?
        </Typography>
        <Box
          component="ul"
          sx={{
            m: 0,
            pl: 2.5,
            color: "#cbd5e1",
            fontSize: 14,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <li>
            <span style={{ color: "#93c5fd", fontWeight: 600 }}>Öneri Sayfası:</span> Öneri Puan Sistemi Excel'ini yükleyin.
          </li>
          <li>
            <span style={{ color: "#93c5fd", fontWeight: 600 }}>5S Sayfası:</span> Katılım Tablosu Excel'ini yükleyin.
          </li>
          <li>
            <span style={{ color: "#93c5fd", fontWeight: 600 }}>Kaizen Sayfası:</span> Kaizen Excel'inizi yükleyin.
          </li>
        </Box>
      </Box>
    </Paper>
  );
}