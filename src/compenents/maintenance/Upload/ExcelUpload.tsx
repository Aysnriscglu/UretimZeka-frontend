import {
  Paper,
  Button,
  Box,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useState } from "react";

type Props = {
  onFileSelect: (files: File[]) => void;
};

export default function ExcelUpload({ onFileSelect }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {/* Üst Bilgi */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            fontWeight: 700,
          }}
        >
          Excel Dosyası Yükle
        </Typography>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            background: "rgba(59,130,246,.08)",
            border: "1px solid rgba(59,130,246,.25)",
          }}
        >
          <Typography
            sx={{
              color: "#cbd5e1",
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            📌 <b>Lütfen şu dosyaları yükleyin</b>
            <br />
            ✔ Çağrı Duruş Exceli
            <br />
            ✔ 9.Hat Oranı Exceli
             <br />
            ✔ Durus Exceli
          </Typography>
        </Box>
      </Box>

      {/* Upload Butonu */}
      <Button
        variant="contained"
        component="label"
        startIcon={<UploadFileIcon />}
        sx={{
          borderRadius: 2,
          px: 3,
          py: 1.2,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        EXCEL DOSYASI YÜKLE

        <input
          hidden
          multiple
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => {
            const files = e.target.files;

            if (!files) return;

            const newFiles = Array.from(files);

            setSelectedFiles((prev) => {
              const merged = [...prev];

              newFiles.forEach((file) => {
                const exists = merged.some(
                  (f) =>
                    f.name === file.name &&
                    f.size === file.size
                );

                if (!exists) merged.push(file);
              });

              onFileSelect(merged);

              return merged;
            });

            e.target.value = "";
          }}
        />
      </Button>

      {/* Yüklenen Dosyalar */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              color: "#94a3b8",
              mb: 1,
              fontWeight: 600,
            }}
          >
            Yüklenen Dosyalar
          </Typography>

          {selectedFiles.map((file, index) => (
            <Typography
              key={index}
              sx={{
                color: "#fff",
                fontSize: 14,
                mb: 0.7,
              }}
            >
              📄 {file.name}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}