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
      }}
    >
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
    </Paper>
  );
}