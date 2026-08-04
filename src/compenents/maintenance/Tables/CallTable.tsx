import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

const rows = [
  {
    workCenter: "Pres-01",
    line: "9.Hat",
    machine: "Pres-01",
    reason: "Sensör",
    status: "Tamamlandı",
    mttr: "12 dk",
    waiting: "2 dk",
    technician: "Ahmet",
    approver: "Mehmet",
  },
  {
    workCenter: "Robot-03",
    line: "9.Hat",
    machine: "Robot",
    reason: "OS-PLAT",
    status: "Devam Ediyor",
    mttr: "18 dk",
    waiting: "7 dk",
    technician: "Ali",
    approver: "-",
  },
];
type Props = {
  rows: any[];
};

export default function CallTable({ rows }: Props) { 
  const tableData = rows
  .slice(-5)
  .reverse()
  .map((row) => ({
    workCenter: row["İş Merkezi"] || "-",
    line: row["Hat"] || "-",
    machine: row["Makine"] || row["Ekipman"] || "-",
    reason:
      row["Çağrı Nedeni"] ||
      row["Çağrı Nedeni Kodu"] ||
      "-",
    status: row["Duruş Adı"] || "-",
    mttr:
      row["MTTR"]
        ? `${row["MTTR"]} dk`
        : "-",
  }));
  return (
    <Paper
      sx={{
        mt: 4,
        p: 3,
        borderRadius: 4,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255, 255, 255, 0.87)",
      }}
    >
      <Typography variant="h6" color="white" mb={3}>
        Son Bakım Çağrıları
      </Typography>

      <TableContainer>
        <Table
  sx={{
    "& .MuiTableCell-root": {
      color: "#fff",
    },
  }}
>
          <TableHead>
            <TableRow>
              <TableCell>İş Merkezi</TableCell>
              <TableCell>Hat</TableCell>
              <TableCell>Makine</TableCell>
              <TableCell>Çağrı Nedeni</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>MTTR</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((row, index) => ( 
              <TableRow key={index}>
                <TableCell>{row.workCenter}</TableCell>
                <TableCell>{row.line}</TableCell>
                <TableCell>{row.machine}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={
  row.status.toLowerCase().includes("tamam")
    ? "success"
    : row.status.toLowerCase().includes("devam")
    ? "warning"
    : "info"
}
                  />
                </TableCell>
               <TableCell
  sx={{
    color: "#e2e8f0",
  }}
>
  {row.workCenter}
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}