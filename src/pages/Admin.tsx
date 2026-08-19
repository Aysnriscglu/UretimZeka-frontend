import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button,
  CircularProgress
} from "@mui/material";
import { Users, LogOut, CheckCircle, XCircle } from "lucide-react";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface User {
  id: number;
  username: string;
  email: string;
  is_verified: number;
  locked_until: string | null;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BACKEND_URL = isLocal 
    ? "http://localhost:5000" 
    : "";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Giriş yapılmamış. Lütfen 'admin' hesabıyla giriş yapın.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/admin/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || "Erişim reddedildi.");
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f172a' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f172a', p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500, bgcolor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', color: 'white' }}>
          <XCircle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
          <Typography variant="h5" gutterBottom color="error">Erişim Reddedildi</Typography>
          <Typography sx={{ color: '#94a3b8', mb: 3 }}>{error}</Typography>
          <Button variant="contained" onClick={() => navigate("/login")}>Giriş Sayfasına Dön</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0f172a', pt: { xs: 4, md: 8 }, pb: 8, px: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', animation: `${fadeIn} 0.5s ease-out` }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1.5, bgcolor: 'rgba(56, 189, 248, 0.1)', borderRadius: 2 }}>
              <Users size={32} color="#38bdf8" />
            </Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Yönetici Paneli
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<LogOut size={18} />}
            onClick={handleLogout}
            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
          >
            Çıkış Yap
          </Button>
        </Box>

        {/* Data Table */}
        <Paper sx={{ 
          bgcolor: 'rgba(30, 41, 59, 0.7)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'rgba(15, 23, 42, 0.5)' }}>
                <TableRow>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2 }}>ID</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2 }}>Kullanıcı Adı</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2 }}>E-posta</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2 }}>Durum</TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontWeight: 600, py: 2 }}>Güvenlik</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                      Henüz kayıtlı kullanıcı bulunmuyor.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'rgba(255,255,255,0.02)' } }}>
                      <TableCell sx={{ color: 'white', borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        #{user.id}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 500, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        {user.username}
                      </TableCell>
                      <TableCell sx={{ color: '#94a3b8', borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        {user.email}
                      </TableCell>
                      <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        {user.is_verified ? (
                          <Chip 
                            icon={<CheckCircle size={14} />} 
                            label="Onaylı" 
                            size="small"
                            sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', '& .MuiChip-icon': { color: '#4ade80' } }} 
                          />
                        ) : (
                          <Chip 
                            label="Onay Bekliyor" 
                            size="small"
                            sx={{ bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24' }} 
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ borderBottomColor: 'rgba(255,255,255,0.05)' }}>
                        {user.locked_until && new Date(user.locked_until) > new Date() ? (
                          <Chip 
                            icon={<XCircle size={14} />} 
                            label="Kilitli" 
                            size="small"
                            sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', '& .MuiChip-icon': { color: '#f87171' } }} 
                          />
                        ) : (
                          <Chip 
                            label="Aktif" 
                            size="small"
                            sx={{ bgcolor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }} 
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}
