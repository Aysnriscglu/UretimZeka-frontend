import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, TextField, Button, CircularProgress, InputAdornment } from "@mui/material";
import { Lock, CheckCircle, XCircle } from "lucide-react";

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = isLocal 
  ? "http://localhost:5000" 
  : "https://opexdijitalweb.up.railway.app";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid_token">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid_token");
      setMessage("Geçersiz veya eksik sıfırlama linki.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password })
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMessage("Şifreniz başarıyla güncellendi!");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", data.token);
        
        setTimeout(() => navigate("/"), 3000);
      } else {
        setStatus("error");
        setMessage(data.message || "Sıfırlama işlemi başarısız oldu.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Sunucuya bağlanılamadı.");
    }
  };

  if (status === "invalid_token") {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a" }}>
        <Paper elevation={24} sx={{ p: 5, textAlign: "center", borderRadius: 4, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}>
          <XCircle size={60} color="#ef4444" style={{ margin: "0 auto 20px" }} />
          <Typography variant="h5" fontWeight="bold" mb={2}>Geçersiz Link</Typography>
          <Typography color="#94a3b8" mb={3}>{message}</Typography>
          <Button variant="outlined" onClick={() => navigate("/login")} sx={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }}>Giriş Ekranına Dön</Button>
        </Paper>
      </Box>
    );
  }

  if (status === "success") {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a" }}>
        <Paper elevation={24} sx={{ p: 5, textAlign: "center", borderRadius: 4, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}>
          <CheckCircle size={60} color="#22c55e" style={{ margin: "0 auto 20px" }} />
          <Typography variant="h5" fontWeight="bold" mb={2}>Başarılı!</Typography>
          <Typography color="#94a3b8" mb={3}>{message}</Typography>
          <Typography variant="body2" color="#38bdf8">Uygulamaya yönlendiriliyorsunuz...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", color: "white" }}>
      <Paper elevation={24} sx={{ p: { xs: 4, md: 5 }, width: "100%", maxWidth: "400px", borderRadius: 4, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.1)", mx: 2 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1} sx={{ color: "white" }}>
          Yeni Şifre Belirle
        </Typography>
        <Typography variant="body2" color="#94a3b8" textAlign="center" mb={4}>
          Lütfen hesabınız için yeni bir şifre girin.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField 
              placeholder="Yeni Şifre" 
              type="password" 
              variant="outlined" 
              fullWidth 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Lock color="#64748b" size={20} /></InputAdornment>, 
                style: { color: "white", borderRadius: 12 }, 
                sx: { backgroundColor: "rgba(0,0,0,0.2)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" } } 
              }} 
            />
            <TextField 
              placeholder="Şifreyi Onayla" 
              type="password" 
              variant="outlined" 
              fullWidth 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Lock color="#64748b" size={20} /></InputAdornment>, 
                style: { color: "white", borderRadius: 12 }, 
                sx: { backgroundColor: "rgba(0,0,0,0.2)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" } } 
              }} 
            />

            {status === "error" && (
              <Typography color="#ef4444" variant="body2" textAlign="center" fontWeight="500">{message}</Typography>
            )}

            <Button 
              disabled={status === "loading"} 
              type="submit" 
              variant="contained" 
              fullWidth 
              size="large" 
              sx={{ 
                py: 1.8, 
                background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", 
                borderRadius: 3,
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              {status === "loading" ? <CircularProgress size={24} color="inherit" /> : "Şifreyi Güncelle"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
