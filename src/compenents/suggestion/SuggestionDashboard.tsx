import { Box, Typography, Paper } from "@mui/material";
import SuggestionKPIs from "./SuggestionKPIs";
import StatusChart from "./StatusChart";
import RewardChart from "./RewardChart";
import BenefitChart from "./BenefitChart";
import TopAuthors from "./TopAuthors";
import type { SuggestionRow } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function SuggestionDashboard({ rows }: Props) {
  if (!rows || rows.length === 0) {
    return (
      <Box>
        <Typography color="#94A3B8" mt={4} textAlign="center" sx={{ p: 10, background: 'rgba(255,255,255,0.02)', borderRadius: 4, border: '1px dashed rgba(255,255,255,0.1)' }}>
          Öneri verilerini görüntülemek için lütfen Excel dosyasını yükleyin.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={4}>
        <SuggestionKPIs rows={rows} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4, mb: 4 }}>
        {/* Statü Dağılımı */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "20px",
            background: "rgba(31, 41, 55, 0.7)",
            backdropFilter: "blur(12px)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            height: 400,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            📊 Statü Dağılımı
          </Typography>
          <Typography variant="body2" color="#94a3b8" mb={3}>
            Önerilerin mevcut durumlarına göre oranları
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <StatusChart rows={rows} />
          </Box>
        </Paper>

        {/* Ödüllendirme Dağılımı */}
        <Paper
          sx={{
            p: 3,
            borderRadius: "20px",
            background: "rgba(31, 41, 55, 0.7)",
            backdropFilter: "blur(12px)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            height: 400,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            🎁 Ödüllendirme Dağılımı
          </Typography>
          <Typography variant="body2" color="#94a3b8" mb={3}>
            Önerilerin ödüllendirme durumları
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <RewardChart rows={rows} />
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' }, gap: 4 }}>
        {/* Top Authors */}
        <Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "rgba(31, 41, 55, 0.7)",
              backdropFilter: "blur(12px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              height: 400,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={1}>
              🏆 En İyi Öneri Verenler
            </Typography>
            <Typography variant="body2" color="#94a3b8" mb={3}>
              En çok öneri sunan çalışanların liderlik tablosu
            </Typography>
            <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1 }}>
              <TopAuthors rows={rows} />
            </Box>
          </Paper>
        </Box>

        {/* Fayda Analizi */}
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "rgba(31, 41, 55, 0.7)",
              backdropFilter: "blur(12px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              height: 450,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={1}>
              📈 Ön Görülen Fayda Analizi
            </Typography>
            <Typography variant="body2" color="#94a3b8" mb={3}>
              Sunulan önerilerin sağladığı fayda kategorileri
            </Typography>
            <Box sx={{ flexGrow: 1, minHeight: 0 }}>
              <BenefitChart rows={rows} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
