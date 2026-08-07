import { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function IntroVideo() {
  const [showVideo, setShowVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClose = () => {
    setShowVideo(false);
  };

  if (!showVideo) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)", // Sadece hafif karanlık, blur yok
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Buton Kapsayıcısı (Videonun hemen üstünde, sağa hizalı) */}
      <Box sx={{ width: "60%", maxWidth: "700px", display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          startIcon={<CloseIcon />}
          sx={{
            zIndex: 10000,
            fontSize: "0.9rem",
            fontWeight: "bold",
            px: 3,
            py: 1,
            borderRadius: 8,
            boxShadow: "0 4px 20px rgba(239, 68, 68, 0.4)",
            textTransform: "none"
          }}
        >
          Kapat ve Devam Et
        </Button>
      </Box>

      {/* Video kapsayıcısı (Ortalanmış ve Küçültülmüş Kutu) */}
      <Box
        sx={{
          position: "relative",
          width: "60%", 
          maxWidth: "700px", 
          aspectRatio: "16 / 9",
          backgroundColor: "rgba(0,0,0,0.8)",
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          border: "2px solid rgba(255,255,255,0.1)"
        }}
      >
        <video
          ref={videoRef}
          src="/intro.mp4" 
          autoPlay
          muted
          loop
          playsInline
          controls={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
    </Box>
  );
}
