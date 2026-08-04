import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function RootCauseFilter() {
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
      <FormControl fullWidth>
        <InputLabel>Alan</InputLabel>

        <Select defaultValue="KASNAK">
          <MenuItem value="KASNAK">Kasnak</MenuItem>
          <MenuItem value="MONTAJ">Montaj</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
}