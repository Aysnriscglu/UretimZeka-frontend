import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}

export default function DashboardCard({
  title,
  children,
  action,
}: DashboardCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        background: "#1E293B",
        color: "#F8FAFC",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
        },
      }}
    >
      {(title || action) && (
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
          >
            {title}
          </Typography>

          {action}
        </Box>
      )}

      <CardContent
        sx={{
          p: 3,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}