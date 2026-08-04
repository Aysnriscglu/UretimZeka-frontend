import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

interface FilterPanelProps {
  area?: string;
  week?: string;
  onAreaChange?: (value: string) => void;
  onWeekChange?: (value: string) => void;
}

export default function FilterPanel({
  area = "",
  week = "",
  onAreaChange,
  onWeekChange,
}: FilterPanelProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "#1f2937",
        color: "white",
        mb: 3,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={3}
      >
        🔍 Filtreler
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#bdbdbd" }}>
              Bölüm
            </InputLabel>

            <Select
              value={area}
              label="Bölüm"
              onChange={(e) =>
                onAreaChange?.(e.target.value)
              }
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="Pres">Pres</MenuItem>
              <MenuItem value="Montaj">Montaj</MenuItem>
              <MenuItem value="Boyahane">Boyahane</MenuItem>
              <MenuItem value="Depo">Depo</MenuItem>
            </Select>
          </FormControl>
        </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: "#bdbdbd" }}>
              Hafta
            </InputLabel>

            <Select
              value={week}
              label="Hafta"
              onChange={(e) =>
                onWeekChange?.(e.target.value)
              }
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="1">1. Hafta</MenuItem>
              <MenuItem value="2">2. Hafta</MenuItem>
              <MenuItem value="3">3. Hafta</MenuItem>
              <MenuItem value="4">4. Hafta</MenuItem>
            </Select>
          </FormControl>
        </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="contained"
            fullWidth
            sx={{
              height: "56px",
              borderRadius: 2,
            }}
          >
            Filtrele
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}