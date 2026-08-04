import {
  Paper,
  Typography,
  Box,
} from "@mui/material";

type Props = {
  data: any[];
};

export default function TopEmployees({ data }: Props) {

 const employeeCounts: Record<string, number> = {};

data.forEach((item) => {
  if (item["Statü"] !== "Hayata Geçti") return;

  const name = item["Yazar"];
  if (!name) return;

  employeeCounts[name] = (employeeCounts[name] || 0) + 1;
});

const topEmployees = Object.entries(employeeCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5);
    
   
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#182434",
        height: 450,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontSize: 22,
          fontWeight: 700,
          mb: 3,
        }}
      >
        🏆 En Başarılı Personeller
      </Typography>

      {topEmployees.map(([name, count], index) => (
        <Box
          key={name}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1.5,
            borderBottom: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <Typography sx={{ color: "#fff" }}>
            {index + 1}. {name}
          </Typography>

          <Typography
            sx={{
              color: "#22c55e",
              fontWeight: 700,
            }}
          >
         {count as number} Hayata geçen öneri
          </Typography>
        </Box>
      ))}
    </Paper>
  );
}