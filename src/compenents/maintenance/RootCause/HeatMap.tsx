import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Props = {
  rows: any[];
};

export default function HeatMap({ rows }: Props) {
  const reasons = [...new Set(rows.map(r => r["Duruş Tipi Tanımı"]))].slice(0, 8);

  const shifts = ["Vardiya 1", "Vardiya 2", "Vardiya 3"];

  const getCount = (reason: string, shift: string) =>
    rows.filter(
      r =>
        r["Duruş Tipi Tanımı"] === reason &&
        r["Vardiya"] === shift
    ).length;

  const getColor = (value: number) => {
    if (value > 40) return "#ef4444";
    if (value > 20) return "#f97316";
    if (value > 10) return "#eab308";
    if (value > 0) return "#22c55e";
    return "#374151";
  };

  return (
    <Paper
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 3,
        background: "#182434",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          mb: 2,
          fontWeight: 700,
        }}
      >
        🔥 Vardiya / Duruş Tipi Isı Haritası
      </Typography>

      <Table>

        <TableHead>

          <TableRow>

            <TableCell sx={{ color: "#fff" }}>
              Duruş Tipi
            </TableCell>

            {shifts.map(v => (
              <TableCell
                key={v}
                align="center"
                sx={{ color: "#fff" }}
              >
                {v}
              </TableCell>
            ))}

          </TableRow>

        </TableHead>

        <TableBody>

          {reasons.map(reason => (

            <TableRow key={reason}>

              <TableCell sx={{ color: "#fff" }}>
                {reason}
              </TableCell>

              {shifts.map(v => {

                const count = getCount(reason, v);

                return (
                  <TableCell
                    key={v}
                    align="center"
                    sx={{
                      background: getColor(count),
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </TableCell>
                );
              })}

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>
  );
}