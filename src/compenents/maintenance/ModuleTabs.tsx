import { Box, Card, CardActionArea, Typography } from "@mui/material";

interface Props {
  active: "learning" | "5s" | "kaizen";
  onChange: (tab: "learning" | "5s" | "kaizen") => void;
}

export default function ModuleTabs({
  active,
  onChange,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        mt: 4,
        mb: 4,
      }}
    >
      <Card sx={{ flex: 1 }}>
        <CardActionArea
          onClick={() => onChange("learning")}
          sx={{ p: 3 }}
        >
          <Typography align="center">
            Öğrenen Organizasyon
          </Typography>
        </CardActionArea>
      </Card>

      <Card sx={{ flex: 1 }}>
        <CardActionArea
          onClick={() => onChange("5s")}
          sx={{ p: 3 }}
        >
          <Typography align="center">
            5S
          </Typography>
        </CardActionArea>
      </Card>

      <Card sx={{ flex: 1 }}>
        <CardActionArea
          onClick={() => onChange("kaizen")}
          sx={{ p: 3 }}
        >
          <Typography align="center">
            Kaizen
          </Typography>
        </CardActionArea>
      </Card>
    </Box>
  );
}