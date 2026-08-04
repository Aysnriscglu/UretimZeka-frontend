import { Card, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function KPICard({
  title,
  value,
  icon,
}: KPICardProps) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        background: "#1E293B",
        color: "#fff",
        border: "1px solid rgba(255,255,255,.08)",
        transition: ".25s",
        "&:hover": {
          transform: "translateY(-3px)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="space-between">
          {icon}

          <Typography
            fontSize={28}
            fontWeight={700}
          >
            {value}
          </Typography>
        </Stack>

        <Typography
          color="#94A3B8"
        >
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}