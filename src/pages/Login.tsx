import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, InputAdornment } from "@mui/material";
import { User, Lock } from "lucide-react";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === "admin" && password.trim() === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#0f172a" }}>
      {/* Sol taraf - Video */}
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden", display: { xs: 'none', md: 'block' } }}>
        <video
          src="/intro.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7) contrast(1.1)"
          }}
        />
      </Box>

      {/* Sağ taraf - Login Formu */}
      <Box sx={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          background: "radial-gradient(circle at top right, #1e293b 0%, #020617 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Dekoratif Arka Plan Parıltıları */}
        <Box sx={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }} />
        <Box sx={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }} />

        <Paper 
          elevation={24} 
          sx={{ 
            position: "relative",
            zIndex: 10,
            p: { xs: 4, md: 6 }, 
            width: "100%", 
            maxWidth: "420px", 
            borderRadius: 4, 
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            color: "white",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.05)",
            mx: 2,
            animation: `${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`
          }}
        >
          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            <Box textAlign="center" mb={1}>
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="800" 
                sx={{ 
                  background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  letterSpacing: "-0.5px"
                }}
              >
                Opex'e Hoşgeldiniz
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ fontSize: "0.95rem" }}>
                Devam etmek için lütfen hesap bilgilerinizi girin
              </Typography>
            </Box>

            <TextField
              placeholder="Kullanıcı Adı"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User color="#64748b" size={20} />
                  </InputAdornment>
                ),
                style: { color: "white", borderRadius: 12, paddingLeft: 8 },
                sx: {
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" },
                }
              }}
            />

            <TextField
              placeholder="Şifre"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="#64748b" size={20} />
                  </InputAdornment>
                ),
                style: { color: "white", borderRadius: 12, paddingLeft: 8 },
                sx: {
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" },
                }
              }}
            />

            {error && (
              <Typography color="#ef4444" variant="body2" textAlign="center" fontWeight="500">
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 1,
                py: 1.8,
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                fontSize: "1.05rem",
                textTransform: "none",
                fontWeight: "700",
                borderRadius: 3,
                boxShadow: "0 10px 20px -5px rgba(2, 132, 199, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 25px -5px rgba(2, 132, 199, 0.5)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                transition: "all 0.2s ease-in-out"
              }}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
