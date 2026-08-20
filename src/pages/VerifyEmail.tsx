import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress, Button } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BACKEND_URL = isLocal 
  ? "http://localhost:5000" 
  : "https://opexdijitalweb.up.railway.app";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Hesabınız onaylanıyor, lütfen bekleyin...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Geçersiz veya eksik onay linki.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token })
        });
        const data = await res.json();
        
        if (data.success) {
          setStatus("success");
          setMessage("Hesabınız başarıyla onaylandı!");
          // Otomatik giriş
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", data.token);
          
          // 3 saniye sonra yönlendir
          setTimeout(() => navigate("/"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Onay işlemi başarısız oldu.");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Sunucuya bağlanılamadı.");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", alignItems: "center", justifyContent: "center", backgroundColor: "#0f172a", color: "white" }}>
      <Paper elevation={24} sx={{ p: 5, maxWidth: "400px", textAlign: "center", borderRadius: 4, backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}>
        {status === "loading" && <CircularProgress size={60} sx={{ color: "#38bdf8", mb: 3 }} />}
        {status === "success" && <CheckCircle size={60} color="#22c55e" style={{ margin: "0 auto 20px" }} />}
        {status === "error" && <XCircle size={60} color="#ef4444" style={{ margin: "0 auto 20px" }} />}
        
        <Typography variant="h5" fontWeight="bold" mb={2}>
          {status === "loading" ? "Onaylanıyor..." : (status === "success" ? "Başarılı!" : "Hata!")}
        </Typography>
        <Typography variant="body1" color="#94a3b8" mb={4}>
          {message}
        </Typography>

        {status === "success" && (
          <Typography variant="body2" color="#38bdf8">
            Uygulamaya yönlendiriliyorsunuz...
          </Typography>
        )}

        {status === "error" && (
          <Button variant="outlined" onClick={() => navigate("/login")} sx={{ borderColor: "rgba(255,255,255,0.2)", color: "white", "&:hover": { borderColor: "#38bdf8" } }}>
            Giriş Ekranına Dön
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
