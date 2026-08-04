import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export default function SectionHeader({
  title,
  subtitle,
  icon,
}: SectionHeaderProps) {
  return (
    <Stack spacing={0.5} mb={3}>
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography
          variant="h5"
          fontWeight={700}
        >
          {title}
        </Typography>
      </Stack>

      {subtitle && (
        <Typography
          variant="body2"
          color="#94A3B8"
        >
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}