import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

export default function FilterBar() {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        mt: 2,
        borderRadius: 3,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Başlangıç Tarihi"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255,255,255,.15)",
    },
    "&:hover fieldset": {
      borderColor: "#38bdf8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#38bdf8",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            label="Bitiş Tarihi"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255,255,255,.15)",
    },
    "&:hover fieldset": {
      borderColor: "#38bdf8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#38bdf8",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <TextField
            fullWidth
            select
            label="Makine"
            defaultValue="all"
            sx={{
  "& .MuiInputLabel-root": {
    color: "#cbd5e1",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "rgba(255,255,255,.15)",
    },
    "&:hover fieldset": {
      borderColor: "#38bdf8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#38bdf8",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}}
          >
            <MenuItem value="all">Tümü</MenuItem>
            <MenuItem value="Pres-01">Pres-01</MenuItem>
            <MenuItem value="CNC-02">CNC-02</MenuItem>
            <MenuItem value="Robot-03">Robot-03</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
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