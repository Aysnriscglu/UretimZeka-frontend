import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Chip } from "@mui/material";

type Props = {
  months: string[];
  depts: string[];
  filterMonth: string;
  filterDept: string;
  filterSearch: string;
  onMonthChange: (v: string) => void;
  onDeptChange: (v: string) => void;
  onSearchChange: (v: string) => void;
};

const selectSx = {
  color: "white",
  ".MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#64748B" },
};

export default function FilterBar({
  months, depts,
  filterMonth, filterDept, filterSearch,
  onMonthChange, onDeptChange, onSearchChange,
}: Props) {
  const activeCount = [filterMonth, filterDept, filterSearch].filter(Boolean).length;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        p: 2.5,
        bgcolor: "#0F1E30",
        borderRadius: 3,
        border: "1px solid #1E3A5F",
        alignItems: "center",
      }}
    >
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel sx={{ color: "#94A3B8" }}>Ay</InputLabel>
        <Select value={filterMonth} label="Ay" onChange={e => onMonthChange(e.target.value)} sx={selectSx}>
          <MenuItem value="">Tümü</MenuItem>
          {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel sx={{ color: "#94A3B8" }}>Uygulayan Bölüm</InputLabel>
        <Select value={filterDept} label="Uygulayan Bölüm" onChange={e => onDeptChange(e.target.value)} sx={selectSx}>
          <MenuItem value="">Tümü</MenuItem>
          {depts.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField
        size="small"
        placeholder="Ara..."
        value={filterSearch}
        onChange={e => onSearchChange(e.target.value)}
        sx={{
          minWidth: 180,
          input: { color: "white" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#334155" },
          "& label": { color: "#94A3B8" },
        }}
      />

      {activeCount > 0 && (
        <>
          <Chip label={`${activeCount} filtre aktif`} size="small" color="primary" />
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={() => { onMonthChange(""); onDeptChange(""); onSearchChange(""); }}
          >
            Temizle
          </Button>
        </>
      )}
    </Box>
  );
}
