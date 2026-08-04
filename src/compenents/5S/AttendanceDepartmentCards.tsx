import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import FactoryIcon from "@mui/icons-material/Factory";

interface AttendanceRow {
  hafta: number;
  bölüm: string;
  katılım: string;
  geçKatılım?: string;
  katılımOlmayanGünSayısı: number;
  mazeretliMi?: string;
}

interface Props {
  rows: AttendanceRow[];
}

export default function AttendanceDepartmentCards({ rows }: Props) {
  // Aynı bölümü tek sefer göster
  const departments = [...new Set(rows.map((r) => r.bölüm))];

  return (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {departments.map((department) => {
        const departmentRows = rows.filter(
          (r) => r.bölüm === department
        );

        const attended = departmentRows.filter(
          (r) => r.katılım === "✔"
        ).length;

        const rate =
          departmentRows.length === 0
            ? 0
            : Math.round((attended / departmentRows.length) * 100);

        return (
          <Grid key={department} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                background: "#1f2937",
                color: "white",
                cursor: "pointer",
                transition: ".25s",

                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,.35)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <FactoryIcon color="primary" />
                <Typography fontWeight={700} fontSize={18}>
                  {department}
                </Typography>
              </Box>

              <Typography mt={3} color="#94A3B8">
                Katılım Oranı
              </Typography>

              <Typography
                fontWeight={800}
                fontSize={30}
                color="#22c55e"
              >
                %{rate}
              </Typography>

              <Box mt={3}>
                <Chip
                  label="Detayları Gör"
                  color="primary"
                  clickable
                />
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}