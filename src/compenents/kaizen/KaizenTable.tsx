import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

type Props = { data: any[] };

export default function KaizenTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, bgcolor: "#1E293B", borderRadius: 3 }}>
        <Typography color="white">Veri bulunamadi. Lutfen Excel dosyasi yukleyin.</Typography>
      </Paper>
    );
  }

  const keys = Object.keys(data[0]);

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Typography color="white" fontWeight={700} mb={2}>Kaizen Tablosu</Typography>
      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "#1E293B",
          borderRadius: 3,
          maxHeight: 500,
          overflowX: "auto",
          overflowY: "auto",
          width: "100%",
        }}
      >
        <Table stickyHeader size="small" sx={{ tableLayout: "auto", minWidth: "max-content" }}>
          <TableHead>
            <TableRow>
              {keys.map((key) => (
                <TableCell
                  key={key}
                  sx={{
                    bgcolor: "#0F172A",
                    color: "#94A3B8",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    maxWidth: 200,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} sx={{ "&:hover": { bgcolor: "#1E3A5F" } }}>
                {keys.map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      color: "#CBD5E1",
                      borderColor: "#334155",
                      whiteSpace: "nowrap",
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    title={String(row[key] ?? "")}
                  >
                    {row[key] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
