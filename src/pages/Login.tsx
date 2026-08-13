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
  const navigate = useNavigate();

  // OTP State
  const [needsOtp, setNeedsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // Forgot Password Modal State
  const [openForgot, setOpenForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code & New Password

  // URL (Localtest API)
  const BACKEND_URL = `http://${window.location.hostname}:5000`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (needsOtp) {
      // Doğrulama aşaması
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: isLogin ? username : email, code: otpCode })
        });
        const data = await res.json();
        if (data.success) {
          setSuccess("Hesap onaylandı! Giriş yapılıyor...");
          setNeedsOtp(false);
          setIsLogin(true);
          // Auto login process after verification can be implemented here, 
          // or they can just type password again.
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      }
      return;
    }

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
          setEmail(data.email);
          setNeedsOtp(true);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
      }
    } else {
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();
        if (data.success) {
          setSuccess(data.message);
          setNeedsOtp(true);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("Sunucuya bağlanılamadı.");
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
        setForgotStep(2);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Bağlantı hatası.");
    }
  };

  const handleResetPassword = async () => {
    setError(""); setSuccess("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, code: resetCode, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => {
          setOpenForgot(false);
          setForgotStep(1);
          setSuccess("");
        }, 2000);
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
                {needsOtp ? "Hesap Onayı" : (isLogin ? "Opex'e Hoşgeldiniz" : "Yeni Hesap Oluşturun")}
              </Typography>
              <Typography variant="body2" color="#94a3b8" sx={{ fontSize: "0.95rem" }}>
                {needsOtp ? "E-postanıza gönderilen onay kodunu giriniz" : (isLogin ? "Devam etmek için lütfen hesap bilgilerinizi girin" : "Sisteme katılmak için bilgilerinizi doldurun")}
              </Typography>
            </Box>

            {!needsOtp ? (
              <>
                <TextField placeholder={isLogin ? "Kullanıcı Adı veya E-posta" : "Kullanıcı Adı"} variant="outlined" fullWidth value={username} onChange={(e) => setUsername(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><User color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
                {!isLogin && (
                  <TextField placeholder="E-posta Adresi" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Mail color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
                )}
                <TextField placeholder="Şifre" type="password" variant="outlined" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8 }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
              </>
            ) : (
              <TextField placeholder="6 Haneli Onay Kodu" variant="outlined" fullWidth value={otpCode} onChange={(e) => setOtpCode(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><KeyRound color="#64748b" size={20} /></InputAdornment>, style: { color: "white", borderRadius: 12, paddingLeft: 8, textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }, sx: { backgroundColor: "rgba(15, 23, 42, 0.8)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.08)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.15)" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#38bdf8" } } }} />
            )}

            {error && <Typography color="#ef4444" variant="body2" textAlign="center" fontWeight="500">{error}</Typography>}
            {success && <Typography color="#22c55e" variant="body2" textAlign="center" fontWeight="500">{success}</Typography>}

            <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.8, background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)", fontSize: "1.05rem", textTransform: "none", fontWeight: "700", borderRadius: 3, boxShadow: "0 10px 20px -5px rgba(2, 132, 199, 0.4)", "&:hover": { background: "linear-gradient(135deg, #0369a1 0%, #1d4ed8 100%)", transform: "translateY(-2px)", boxShadow: "0 15px 25px -5px rgba(2, 132, 199, 0.5)" }, transition: "all 0.2s ease-in-out" }}>
              {needsOtp ? "Onayla" : (isLogin ? "Giriş Yap" : "Kayıt Ol")}
            </Button>

            {!needsOtp && (
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
            
            {needsOtp && (
              <Box sx={{ textAlign: "center", mt: -1 }}>
                <Typography component="span" onClick={() => {setNeedsOtp(false); setError(""); setSuccess("")}} sx={{ color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem", transition: "color 0.2s", "&:hover": { color: "#38bdf8", textDecoration: "underline" } }}>
                  Geri Dön
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
          
          {forgotStep === 1 ? (
            <TextField autoFocus margin="dense" label="Kayıtlı E-posta Adresi" type="email" fullWidth variant="outlined" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} InputLabelProps={{ style: { color: '#94a3b8' } }} sx={{ input: { color: 'white' }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" } }} />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField label="Sıfırlama Kodu" fullWidth variant="outlined" value={resetCode} onChange={(e) => setResetCode(e.target.value)} InputLabelProps={{ style: { color: '#94a3b8' } }} sx={{ input: { color: 'white' }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" } }} />
              <TextField label="Yeni Şifre" type="password" fullWidth variant="outlined" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} InputLabelProps={{ style: { color: '#94a3b8' } }} sx={{ input: { color: 'white' }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" } }} />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setOpenForgot(false)} sx={{ color: '#94a3b8' }}>İptal</Button>
          <Button onClick={forgotStep === 1 ? handleForgotPassword : handleResetPassword} variant="contained" sx={{ backgroundColor: '#0284c7' }}>
            {forgotStep === 1 ? "Kod Gönder" : "Şifreyi Yenile"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
