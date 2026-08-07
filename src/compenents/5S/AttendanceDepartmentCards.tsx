import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import type { AttendanceRow } from "./utils";
import { isAttended, getBolum } from "./utils";

interface Props {
  rows: AttendanceRow[];
}

export default function AttendanceDepartmentCards({ rows }: Props) {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  if (!rows || rows.length === 0) return null;

  const departments = [...new Set(rows.map(getBolum))].filter(Boolean);

  const handleOpenDetails = (dept: string) => {
    setSelectedDept(dept);
  };

  const handleCloseDetails = () => {
    setSelectedDept(null);
  };

  const selectedRows = selectedDept ? rows.filter(r => getBolum(r) === selectedDept) : [];

  // Helper to find a name column
  const getName = (r: AttendanceRow) => {
    const keys = Object.keys(r);
    const nameKey = keys.find(k => k.includes("AD") || k.includes("SOYAD") || k.includes("ISIM") || k.includes("İSİM") || k.includes("YAZAR") || k.includes("LİDER") || k.includes("LIDER"));
    return nameKey ? r[nameKey] : "Bilinmiyor";
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" color="white" fontWeight={700} mb={3}>
        🏭 Bölüm Bazlı Katılım Durumu
      </Typography>

      <Grid container spacing={3}>
        {departments.map((department) => {
          const departmentRows = rows.filter(
            (r) => getBolum(r) === department
          );

          const attendedCount = departmentRows.filter(isAttended).length;
          
          const absentCount = departmentRows.length - attendedCount;

          const rate =
            departmentRows.length === 0
              ? 0
              : Math.round((attendedCount / departmentRows.length) * 100);

          let color = "#22c55e"; // Green
          if (rate < 50) color = "#ef4444"; // Red
          else if (rate < 80) color = "#f59e0b"; // Amber

          return (
            <Grid key={department} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Paper
                onClick={() => handleOpenDetails(department)}
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  background: "rgba(31, 41, 55, 0.7)",
                  backdropFilter: "blur(12px)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 15px 35px ${color}22`,
                    border: `1px solid ${color}44`,
                    "& .action-btn": {
                      opacity: 1,
                      transform: "translateX(0)",
                    }
                  },
                }}
              >
                {/* Background accent line */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />

                <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      color: color,
                    }}
                  >
                    <FactoryIcon />
                  </Box>
                  <Typography fontWeight={700} fontSize={16} noWrap title={department}>
                    {department}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={3}>
                  <Box>
                    <Typography color="#94A3B8" fontSize={12} fontWeight={600} textTransform="uppercase">
                      Katılım Oranı
                    </Typography>
                    <Typography fontWeight={800} fontSize={32} color={color} sx={{ lineHeight: 1 }}>
                      %{rate}
                    </Typography>
                  </Box>

                  <Box textAlign="right">
                    <Typography color="#94A3B8" fontSize={12}>
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>{attendedCount}</span> katılan
                    </Typography>
                    <Typography color="#94A3B8" fontSize={12}>
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>{absentCount}</span> katılmayan
                    </Typography>
                  </Box>
                </Box>

                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    className="action-btn"
                    endIcon={<ChevronRightIcon />}
                    sx={{
                      color: "white",
                      opacity: 0,
                      transform: "translateX(-10px)",
                      transition: "all 0.3s ease",
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      "&:hover": {
                        color: color,
                        background: "transparent",
                      }
                    }}
                  >
                    Detayları Gör
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Dialog 
        open={Boolean(selectedDept)} 
        onClose={handleCloseDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "#1e293b",
            color: "white",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.1)",
          }
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", pb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {selectedDept} Bölümü Katılım Detayları
          </Typography>
          <IconButton onClick={handleCloseDetails} sx={{ color: "#94a3b8" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ background: "#0f172a", color: "#94a3b8", fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Kişi / Lider</TableCell>
                  <TableCell sx={{ background: "#0f172a", color: "#94a3b8", fontWeight: "bold", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>Katılım Durumu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRows.map((r, i) => {
                  const attended = isAttended(r);
                  return (
                    <TableRow key={i} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell sx={{ color: "white", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {getName(r)}
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        {attended ? (
                          <Box display="inline-flex" alignItems="center" gap={1} color="#10b981" bgcolor="rgba(16, 185, 129, 0.1)" px={1.5} py={0.5} borderRadius={2}>
                            <CheckCircleIcon fontSize="small" /> <Typography variant="body2" fontWeight="bold">Katıldı</Typography>
                          </Box>
                        ) : (
                          <Box display="inline-flex" alignItems="center" gap={1} color="#f43f5e" bgcolor="rgba(244, 63, 94, 0.1)" px={1.5} py={0.5} borderRadius={2}>
                            <CancelIcon fontSize="small" /> <Typography variant="body2" fontWeight="bold">Katılmadı</Typography>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {selectedRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ color: "#94a3b8", py: 4, border: 0 }}>
                      Kayıt bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </Box>
  );
}