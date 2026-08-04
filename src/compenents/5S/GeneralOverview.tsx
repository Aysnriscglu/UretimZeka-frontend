import { Box } from "@mui/material";
import {
  Clock3,
  Target,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import SectionHeader from "../common/SectionHeader";
import KPICard from "../common/KPICard";

export default function GeneralOverview() {
  return (
    <>
      <SectionHeader
        title="Genel Bakış"
        subtitle="5S performans göstergeleri"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        <KPICard
          title="Ortalama Süre"
          value="31.4 dk"
          icon={<Clock3 size={34} color="#3B82F6" />}
        />

        <KPICard
          title="Hedefe Uyum"
          value="%89"
          icon={<Target size={34} color="#22C55E" />}
        />

        <KPICard
          title="Yapılan Kokpit"
          value="126"
          icon={<CheckCircle2 size={34} color="#10B981" />}
        />

        <KPICard
          title="Yapılmayan"
          value="8"
          icon={<XCircle size={34} color="#EF4444" />}
        />
      </Box>
    </>
  );
}