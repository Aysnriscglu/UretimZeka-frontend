import { Box, Typography, Avatar, Paper } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonIcon from "@mui/icons-material/Person";
import type { SuggestionRow } from "./utils";
import { getSuggestionAuthor } from "./utils";

interface Props {
  rows: SuggestionRow[];
}

export default function TopAuthors({ rows }: Props) {
  if (!rows || rows.length === 0) return null;

  const authorMap = new Map<string, number>();

  rows.forEach((r) => {
    const author = getSuggestionAuthor(r);
    if (!author || author === "Bilinmeyen") return;
    authorMap.set(author, (authorMap.get(author) || 0) + 1);
  });

  const topAuthors = Array.from(authorMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  const colors = ["#fbbf24", "#94a3b8", "#b45309", "#3b82f6", "#10b981"]; // Gold, Silver, Bronze, Blue, Green

  return (
    <Box mt={1}>
      {topAuthors.map((author, index) => (
        <Paper
          key={author.name}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            mb: 2,
            background: "rgba(255,255,255,0.03)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "rgba(255,255,255,0.08)",
              transform: "translateX(5px)",
            },
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box position="relative">
              <Avatar
                sx={{
                  bgcolor: colors[index] || "#475569",
                  width: 48,
                  height: 48,
                  fontWeight: "bold",
                }}
              >
                {index < 3 ? <EmojiEventsIcon /> : <PersonIcon />}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -5,
                  right: -5,
                  background: "#1e293b",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: "bold",
                  border: "2px solid #0f172a",
                  color: "white"
                }}
              >
                {index + 1}
              </Box>
            </Box>
            <Box>
              <Typography color="white" fontWeight={700} fontSize={15}>
                {author.name}
              </Typography>
              <Typography color="#94a3b8" fontSize={12}>
                Sıralama: {index + 1}. Sıra
              </Typography>
            </Box>
          </Box>
          
          <Box textAlign="right">
            <Typography color={colors[index] || "#38bdf8"} fontWeight={800} fontSize={20} sx={{ lineHeight: 1 }}>
              {author.count}
            </Typography>
            <Typography color="#64748b" fontSize={11} textTransform="uppercase" fontWeight={600} mt={0.5}>
              Öneri
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
