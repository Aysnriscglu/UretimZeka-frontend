import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { User, Lock, Mail, KeyRound } from "lucide-react";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Otomatik URL Ayarı: Eğer lokalde çalışıyorsa localhost:5000, eğer Vercel'de ise direkt Railway linkine bağlanır.
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BACKEND_URL = isLocal 
    ? "http://localhost:5000" 
    : "https://uretimzeka-frontend-production.up.railway.app";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (isLoading) return;
    setIsLoading(true);

    if (isLogin) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", data.token);
          navigate("/");
        } else if (data.needsVerification) {
          setError(data.message);
          setNeedsVerification(true);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (res.ok || data.success) {
          setSuccess(data.message);
          setNeedsVerification(true);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          setOpenForgot(false);
          setSuccess("");
        }, 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Bağlantı hatası.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#0f172a" }}>
      <Box sx={{ flex: 1, position: "relative", overflow: "hidden", display: { xs: 'none', md: 'block' } }}>
        <video src="/intro.mp4" autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) contrast(1.1)" }} />
      </Box>

      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(circle at top right, #1e293b 0%, #020617 100%)", color: "white", position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "10%", left: "20%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)", filter: "blur(40px)", borderRadius: "50%" }} />
        <Box sx={{ position: "absolute", bottom: "10%", right: "10%", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)", filter: "blur(40px)", borderRadius: "50%" }} />

        <Paper elevation={24} sx={{ position: "relative", zIndex: 10, p: { xs: 4, md: 6 }, width: "100%", maxWidth: "420px", borderRadius: 4, backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.05)", borderTop: "1px solid rgba(255, 255, 255, 0.1)", color: "white", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.05)", mx: 2, animation: `${fadeIn} 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            <Box textAlign="center" mb={1}>
              <Typography variant="h4" component="h1" fontWeight="800" sx={{ background: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 1, letterSpacing: "-0.5px" }}>
                {needsVerification ? "Hesap Onayı Bekleniyor" : (isLogin ? "Opex'e Hoşgeldiniz" : "Yeni Hesap Oluşturun")}
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ fontSize: "0.95rem" }}>
                {needsVerification ? "Lütfen e-posta adresinize gönderdiğimiz onay linkine tıklayın." : (isLogin ? "Devam etmek için lütfen hesap bilgilerinizi girin" : "Sisteme katılmak için bilgilerinizi doldurun")}
              </Typography>
            </Box>

            {!needsVerification ? (
              <>
                <TextField placeholder={isLogin ? "Kullanıcı Adı veya E-posta" : "Kullanıcı Adı"} variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><User color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
                {!isLogin && (
                  <TextField placeholder="E-posta Adresi" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Mail color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
                )}
                <TextField placeholder="Şifre" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
              </>
            ) : null}

            {error && <Typography color="#ef4444" variant="body2" textAlign="center" fontWeight="500">{error}</Typography>}
            {success && <Typography color="#22c55e" variant="body2" textAlign="center" fontWeight="500">{success}</Typography>}

            {!needsVerification && (
              <Button disabled={isLoading} type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.8, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", fontSize: "1.05rem", textTransform: "none", fontWeight: "700", borderRadius: 3, boxShadow: "0 10px 20px -5px rgba(2, 132, 199, 0.4)", "&:hover": { background: "linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)", transform: "translateY(-2px)", boxShadow: "0 15px 25px -5px rgba(2, 132, 199, 0.5)" }, transition: "all 0.2s ease-in-out" }}>
                {isLoading ? "Yükleniyor..." : (isLogin ? "Giriş Yap" : "Kayıt Ol")}
              </Button>
            )}

            {!needsVerification && (
              <Box sx={{ textAlign: "center", mt: -1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {isLogin && (
                  <Typography component="span" onClick={() => setOpenForgot(true)} sx={{ color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#38bdf8", textDecoration: "underline" } }}>
                    Şifremi Unuttum
                  </Typography>
                )}
                <Typography variant="body2" color="#94a3b8">
                  {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
                  <Typography component="span" onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} sx={{ color: "#38bdf8", cursor: "pointer", fontWeight: "600", transition: "color 0.2s", "&:hover": { color: "#818cf8", textDecoration: "underline" } }}>
                    {isLogin ? "Kayıt Olun" : "Giriş Yapın"}
                  </Typography>
                </Typography>
              </Box>
            )}
            
            {needsVerification && (
              <Box sx={{ textAlign: "center", mt: -1 }}>
                <Typography component="span" onClick={() => {setNeedsVerification(false); setError(""); setSuccess("")}} sx={{ color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#38bdf8", textDecoration: "underline" } }}>
                  Giriş Ekranına Dön
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Forgot Password Modal */}
      <Dialog open={openForgot} onClose={() => setOpenForgot(false)} PaperProps={{ sx: { backgroundColor: "#1e293b", color: "white", borderRadius: 3, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Şifremi Unuttum</DialogTitle>
        <DialogContent sx={{ minWidth: { xs: '300px', md: '400px' } }}>
          {error && <Typography color="#ef4444" variant="body2" mb={2}>{error}</Typography>}
          {success && <Typography color="#22c55e" variant="body2" mb={2}>{success}</Typography>}
          
          <TextField autoFocus margin="dense" label="Kayıtlı E-posta Adresi" type="email" fullWidth variant="outlined" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} InputLabelProps={{ style: { color: '#94a3b8' } }} sx={{ input: { color: 'white' }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenForgot(false)} sx={{ color: '#94a3b8' }}>İptal</Button>
          <Button onClick={handleForgotPassword} variant="contained" sx={{ backgroundColor: '#0284c7' }}>
            Link Gönder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
