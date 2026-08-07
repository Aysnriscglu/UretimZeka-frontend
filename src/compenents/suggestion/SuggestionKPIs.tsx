import { Box, Paper, Typography } from "@mui/material";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import type { SuggestionRow } from "./utils";
import { isImplemented, isRejected } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function SuggestionKPIs({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const totalCount = rows.length;
  const implementedCount = rows.filter(isImplemented).length;
  const rejectedCount = rows.filter(isRejected).length;
  const approvalRate = totalCount === 0 ? 0 : Math.round((implementedCount / totalCount) * 100);

  const cards = [
    {
      title: "Toplam Öneri",
      value: totalCount,
      subtitle: "Kayıtlı Tüm Öneriler",
      color: "#3b82f6", // Blue
      bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 100%)",
      icon: <EmojiObjectsIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Hayata Geçen",
      value: implementedCount,
      subtitle: "Başarıyla Uygulananlar",
      color: "#10b981", // Emerald
      bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0) 100%)",
      icon: <VerifiedIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Reddedilen",
      value: rejectedCount,
      subtitle: "Uygulanmayanlar",
      color: "#f43f5e", // Rose
      bgGradient: "linear-gradient(135deg, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0) 100%)",
      icon: <CancelIcon sx={{ fontSize: 48 }} />,
    },
    {
      title: "Kabul Oranı",
      value: `%${approvalRate}`,
      subtitle: "Uygulanma Yüzdesi",
      color: "#8b5cf6", // Violet
      bgGradient: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 100%)",
      icon: <AutoGraphIcon sx={{ fontSize: 48 }} />,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
      {cards.map((card) => (
        <Box key={card.title}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "20px",
              background: "#1e293b",
              backgroundImage: card.bgGradient,
              color: "white",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: `0 12px 40px ${card.color}33`,
                border: `1px solid ${card.color}55`,
              },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: -15,
                right: -15,
                color: card.color,
                opacity: 0.1,
                transform: "scale(2.5)",
                pointerEvents: "none",
              }}
            >
              {card.icon}
            </Box>

            <Box>
              <Typography color="#94a3b8" fontSize={13} fontWeight={600} textTransform="uppercase" letterSpacing={1}>
                {card.title}
              </Typography>
              <Typography mt={1} fontSize={36} fontWeight={800} sx={{ color: card.color }}>
                {card.value}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mt={2}>
              <Typography color="#64748b" fontSize={12} fontWeight={500}>
                {card.subtitle}
              </Typography>
              <Box sx={{ color: card.color, opacity: 0.8 }}>{card.icon}</Box>
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
