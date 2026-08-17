import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import XLSX from "xlsx";
import multer from "multer";
import Groq from "groq-sdk";
import OpenAI from "openai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db, { runAsync, getAsync, allAsync } from "./db.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "./mailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "opex-super-secret-key-1234";
const FRONTEND_URL = process.env.FRONTEND_URL || 
  (process.env.NODE_ENV === "production" ? "https://uretimzeka-frontend-production.up.railway.app" : "http://localhost:5173");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// Derlenmiş frontend dosyalarını servis et (Railway production)
app.use(express.static(path.join(__dirname, "../dist")));

// Dosya Yükleme (Multer) Yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// LM Studio istemcisini dinamik oluşturan yardımcı fonksiyon
const getLMStudioClient = () => {
  const baseURL = process.env.LM_STUDIO_URL || "http://127.0.0.1:1234/v1";
  return new OpenAI({
    baseURL,
    apiKey: process.env.LM_STUDIO_API_KEY || "lm-studio",
  });
};

const groqClient = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Excel verilerini akıllıca özetleyen ve hesaplayan yardımcı fonksiyon (Veri Profilleme)
function summarizeExcelData(excelDataMap) {
  let summaryText = "";

  for (const [filename, rows] of Object.entries(excelDataMap)) {
    if (!rows || rows.length === 0) continue;

    summaryText += `\n### DOSYA: ${filename} (Toplam Kayıt Sayısı: ${rows.length} Satır)\n`;
    
    const keys = Object.keys(rows[0]);
    summaryText += `- Sütunlar: ${keys.join(", ")}\n`;

    let machineGroups = {};
    let totalDowntime = 0;
    let totalCost = 0;
    let totalScrap = 0;
    let failureTypes = {};

    rows.forEach((row) => {
      // Makine kolonunu bul
      const machineKey = keys.find(
        (k) =>
          k.toLowerCase().includes("makine") ||
          k.toLowerCase().includes("machine") ||
          k.toLowerCase().includes("ekipman") ||
          k.toLowerCase().includes("merkez")
      );
      const machineName = machineKey ? String(row[machineKey]) : "Genel";

      if (!machineGroups[machineName]) {
        machineGroups[machineName] = { count: 0, downtime: 0, cost: 0, scrap: 0 };
      }
      machineGroups[machineName].count += 1;

      // Toplam duruş süresini hesapla (plansız duruş, toplam duruş, süre kelimelerini eşleştir)
      const durationKey = keys.find(
        (k) =>
          k.toLowerCase().includes("süre") ||
          k.toLowerCase().includes("duration") ||
          k.toLowerCase().includes("dk") ||
          k.toLowerCase().includes("zaman") ||
          k.toLowerCase().includes("duruş süresi")
      );
      if (durationKey && !isNaN(parseFloat(row[durationKey]))) {
        const val = parseFloat(row[durationKey]);
        machineGroups[machineName].downtime += val;
        totalDowntime += val;
      }

      // Toplam maliyeti hesapla
      const costKey = keys.find(
        (k) =>
          k.toLowerCase().includes("maliyet") ||
          k.toLowerCase().includes("cost") ||
          k.toLowerCase().includes("tl") ||
          k.toLowerCase().includes("tutar")
      );
      if (costKey && !isNaN(parseFloat(row[costKey]))) {
        const val = parseFloat(row[costKey]);
        machineGroups[machineName].cost += val;
        totalCost += val;
      }

      // Toplam hurda sayısını hesapla
      const scrapKey = keys.find(
        (k) =>
          k.toLowerCase().includes("hurda") ||
          k.toLowerCase().includes("scrap") ||
          k.toLowerCase().includes("adet") ||
          k.toLowerCase().includes("miktar")
      );
      if (scrapKey && !isNaN(parseFloat(row[scrapKey]))) {
        const val = parseFloat(row[scrapKey]);
        machineGroups[machineName].scrap += val;
        totalScrap += val;
      }

      // Hata/Arıza kategorilerini say
      const failKey = keys.find(
        (k) =>
          k.toLowerCase().includes("arıza") ||
          k.toLowerCase().includes("neden") ||
          k.toLowerCase().includes("hata") ||
          k.toLowerCase().includes("reason")
      );
      if (failKey && row[failKey]) {
        const type = String(row[failKey]);
        failureTypes[type] = (failureTypes[type] || 0) + 1;
      }
    });

    // Hesaplanan genel özetleri metne dök
    summaryText += `\n#### Hesaplanan Toplam İstatistikler (Tüm Dosya):\n`;
    if (totalDowntime > 0) summaryText += `- Toplam Duruş Süresi: ${totalDowntime.toFixed(1)} dakika\n`;
    if (totalCost > 0) summaryText += `- Toplam Maliyet Etkisi: ${totalCost.toLocaleString("tr-TR")} TL\n`;
    if (totalScrap > 0) summaryText += `- Toplam Hurda Miktarı: ${totalScrap} adet\n`;

    summaryText += `\n#### Makine Bazlı Dağılım:\n`;
    Object.entries(machineGroups).forEach(([mName, stats]) => {
      summaryText += `- **${mName}**: Toplam ${stats.count} kayıt`;
      if (stats.downtime > 0) summaryText += `, ${stats.downtime.toFixed(1)} dk toplam duruş`;
      if (stats.cost > 0) summaryText += `, ${stats.cost.toLocaleString("tr-TR")} TL maliyet`;
      if (stats.scrap > 0) summaryText += `, ${stats.scrap} adet hurda`;
      summaryText += `\n`;
    });

    const topFailures = Object.entries(failureTypes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    if (topFailures.length > 0) {
      summaryText += `\n#### En Sık Rastlanan Arıza/Hata Sebepleri:\n`;
      topFailures.forEach(([type, count]) => {
        summaryText += `- ${type}: ${count} kez\n`;
      });
    }

    // İlk 5 satırı sadece önemli sütunlarla sınırlandırıp örnek olarak ekle (Hafıza/Token tasarrufu için)
    const importantKeywords = ["tarih", "makine", "merkez", "ekipman", "süre", "duruş", "maliyet", "cost", "hurda", "scrap", "arıza", "hata", "neden", "tutar", "adet", "miktar", "operasyon", "malzeme"];
    const filteredRows = rows.slice(0, 5).map((row) => {
      let filteredRow = {};
      keys.forEach((k) => {
        if (importantKeywords.some((kw) => k.toLowerCase().includes(kw))) {
          filteredRow[k] = row[k];
        }
      });
      if (Object.keys(filteredRow).length === 0) {
        keys.slice(0, 5).forEach((k) => {
          filteredRow[k] = row[k];
        });
      }
      return filteredRow;
    });

    summaryText += `\n#### Örnek Kayıt Detayları (İlk 5 Satır - Önemli Sütunlar):\n`;
    summaryText += JSON.stringify(filteredRows, null, 2) + "\n";
  }

  return summaryText;
}

console.log("=================================");
console.log("✅ SERVER BAŞLADI");
console.log(`🤖 Aktif Sağlayıcı: ${process.env.AI_PROVIDER || "groq"}`);
console.log(`🔗 Hedef LM Studio URL: ${process.env.LM_STUDIO_URL || "http://127.0.0.1:1234/v1"}`);
console.log(`📁 Backend Dizini: ${__dirname}`);
console.log("=================================");

// Tablo şemasını güncelle (yeni sütunlar)
(async () => {
  try {
    await runAsync("ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0");
  } catch (e) { /* zaten varsa hata verir, yok sayılır */ }
  try {
    await runAsync("ALTER TABLE users ADD COLUMN locked_until DATETIME");
  } catch (e) { /* zaten varsa hata verir, yok sayılır */ }
})();

// --- AUTH ENDPOINTS ---

// 1. Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Lütfen tüm alanları doldurun." });
    }

    const existingUser = await getAsync("SELECT id FROM users WHERE username = ? OR email = ?", [username, email]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Bu kullanıcı adı veya e-posta zaten kayıtlı." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationCode = crypto.randomBytes(32).toString('hex'); // 64 karakterli token

    await runAsync(
      "INSERT INTO users (username, email, password_hash, verification_code, is_verified, failed_login_attempts) VALUES (?, ?, ?, ?, 0, 0)",
      [username, email, passwordHash, verificationCode]
    );

    // E-postayı arka planda gönder, isteği bekletme
    sendVerificationEmail(email, verificationCode, FRONTEND_URL).catch(console.error);

    const isTestMode = !process.env.GMAIL_USER;
    const msg = isTestMode 
      ? `Kayıt başarılı! (Test Modu Aktif. Doğrulama Linki: ${FRONTEND_URL}/verify-email?token=${verificationCode})` 
      : "Kayıt başarılı! Lütfen e-postanıza gönderilen onay linkine tıklayın.";

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Kayıt işlemi başarısız oldu." });
  }
});

// 2. Verify Token (Magic Link)
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: "Token eksik." });
    
    const user = await getAsync("SELECT * FROM users WHERE verification_code = ?", [token]);
    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş onay linki." });
    }
    
    await runAsync("UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?", [user.id]);
    
    // Doğrulama sonrası otomatik giriş için JWT oluştur
    const jwtToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ success: true, message: "Hesabınız başarıyla onaylandı.", token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Onay işlemi başarısız oldu." });
  }
});

// 3. Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await getAsync("SELECT * FROM users WHERE username = ? OR email = ?", [username, username]);
    if (!user) {
      return res.status(400).json({ success: false, message: "Kullanıcı adı veya şifre hatalı!" });
    }

    // Kilit kontrolü
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const remainingMinutes = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      return res.status(403).json({ success: false, message: `Çok fazla hatalı giriş yaptınız. Lütfen ${remainingMinutes} dakika sonra tekrar deneyin.` });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      if (attempts >= 3) {
        // 15 dakika kilitle
        const lockTime = new Date(new Date().getTime() + 15 * 60000).toISOString();
        await runAsync("UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?", [attempts, lockTime, user.id]);
        return res.status(403).json({ success: false, message: "Çok fazla hatalı giriş yaptınız. Hesabınız 15 dakika kilitlendi." });
      } else {
        await runAsync("UPDATE users SET failed_login_attempts = ? WHERE id = ?", [attempts, user.id]);
        return res.status(400).json({ success: false, message: `Hatalı şifre! (Kalan deneme hakkı: ${3 - attempts})` });
      }
    }

    // Başarılı giriş, kilitleri sıfırla
    if (user.failed_login_attempts > 0 || user.locked_until) {
      await runAsync("UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?", [user.id]);
    }

    if (!user.is_verified) {
      const verificationCode = crypto.randomBytes(32).toString('hex');
      await runAsync("UPDATE users SET verification_code = ? WHERE id = ?", [verificationCode, user.id]);
      // E-postayı arka planda gönder, isteği bekletme
      sendVerificationEmail(user.email, verificationCode, FRONTEND_URL).catch(console.error);
      
      const isTestMode = !process.env.GMAIL_USER;
      const msg = isTestMode 
        ? `Hesabınız onaylanmamış! (Test Modu Aktif. Yeni Doğrulama Linki: ${FRONTEND_URL}/verify-email?token=${verificationCode})` 
        : "Hesabınız onaylanmamış! E-postanıza yeni bir onay linki gönderdik. Lütfen linke tıklayın.";

      return res.status(403).json({ 
        success: false, 
        message: msg,
        needsVerification: true
      });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, message: "Giriş başarılı", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Giriş işlemi başarısız oldu." });
  }
});

// 4. Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { loginId } = req.body; // loginId can be email or username
    if (!loginId) {
      return res.status(400).json({ success: false, message: "Lütfen kullanıcı adı veya e-posta girin." });
    }

    const user = await getAsync("SELECT * FROM users WHERE email = ? OR username = ?", [loginId, loginId]);
    
    if (!user) {
      return res.status(400).json({ success: false, message: "Bu bilgilere ait hesap bulunamadı." });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await runAsync("UPDATE users SET reset_token = ? WHERE id = ?", [resetToken, user.id]);
    
    // E-postayı arka planda gönder, isteği bekletme
    sendPasswordResetEmail(user.email, resetToken, FRONTEND_URL).catch(console.error);

    const isTestMode = !process.env.GMAIL_USER;
    const msg = isTestMode 
      ? `Şifre sıfırlama linki e-posta adresinize gönderildi. (Test Modu Aktif. Şifre Sıfırlama Linki: ${FRONTEND_URL}/reset-password?token=${resetToken})` 
      : "Şifre sıfırlama linki e-posta adresinize gönderildi.";

    res.json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "İşlem başarısız." });
  }
});

// 5. Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: "Token ve yeni şifre gereklidir." });
  }
  
  try {
    const user = await getAsync("SELECT id FROM users WHERE reset_token = ?", [token]);
    if (!user) {
      return res.status(400).json({ success: false, message: "Geçersiz veya süresi dolmuş sıfırlama linki." });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await runAsync(
      "UPDATE users SET password_hash = ?, reset_token = NULL, failed_login_attempts = 0, locked_until = NULL WHERE id = ?",
      [hashedPassword, user.id]
    );
    
    res.json({ success: true, message: "Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz." });
  } catch (error) {
    console.error("Şifre sıfırlama (confirm) hatası:", error);
    res.status(500).json({ success: false, message: "Sunucu hatası, lütfen tekrar deneyin." });
  }
});

// ADMIN ROUTES
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ success: false, message: "Yetkisiz erişim. Lütfen giriş yapın." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: "Oturum süresi dolmuş veya geçersiz." });
    req.user = user;
    next();
  });
};

app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    // Check if the current user is 'admin'
    const user = await getAsync("SELECT username FROM users WHERE id = ?", [req.user.id]);
    
    if (!user || user.username !== 'admin') {
      return res.status(403).json({ success: false, message: "Bu sayfayı görüntüleme yetkiniz yok. Sadece 'admin' hesabı erişebilir." });
    }
    
    // Fetch all users (exclude password hashes)
    const users = await allAsync("SELECT id, username, email, is_verified, locked_until FROM users ORDER BY id DESC");
    
    res.json({ success: true, users });
  } catch (error) {
    console.error("Admin user fetch hatası:", error);
    res.status(500).json({ success: false, message: "Kullanıcılar getirilirken hata oluştu." });
  }
});

// --- AUTH ENDPOINTS FINISH ---


// Dosya Yükleme Endpoint'i
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Dosya yüklenemedi." });
  }
  console.log(`📁 Yeni Excel Yüklendi: ${req.file.originalname}`);
  res.json({
    success: true,
    message: "Dosya başarıyla yüklendi ve işlenmeye hazır.",
    filename: req.file.originalname,
  });
});

// AI Bağlantı Durumunu Kontrol Eden Endpoint
app.get("/api/ai/status", async (req, res) => {
  const provider = process.env.AI_PROVIDER || "groq";
  const url = process.env.LM_STUDIO_URL || "http://127.0.0.1:1234/v1";
  
  if (provider === "lmstudio") {
    try {
      const client = getLMStudioClient();
      const modelsList = await client.models.list();
      const loadedModel = process.env.LM_STUDIO_MODEL || modelsList.data?.[0]?.id || "local-model";
      return res.json({
        success: true,
        online: true,
        provider: "LM Studio",
        url,
        model: loadedModel,
      });
    } catch (err) {
      return res.json({
        success: false,
        online: false,
        provider: "LM Studio",
        url,
        message: `LM Studio sunucusuna bağlanılamadı (${url}).`,
        error: err.message,
      });
    }
  }

  return res.json({
    success: true,
    online: true,
    provider: "Groq",
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  });
});

// HIZLI ÇÖZÜM: Tüm veritabanını sıfırlamak için geçici bir rota
app.get("/api/reset-database", async (req, res) => {
  try {
    await runAsync("DROP TABLE IF EXISTS users");
    
    await runAsync(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            is_verified INTEGER DEFAULT 0,
            verification_code TEXT,
            reset_token TEXT,
            failed_login_attempts INTEGER DEFAULT 0,
            locked_until TIMESTAMP
        )
    `);

    res.send("Veritabanı (Users tablosu) tamamen SİLİNDİ ve SIFIRDAN TERTEMİZ oluşturuldu! Lütfen ana siteye dönüp yeniden Kayıt Olun.");
  } catch (err) {
    res.send("Hata: " + err.message);
  }
});

// HIZLI ÇÖZÜM: E-posta beklemeden herkesi onaylamak için geçici rota
app.get("/api/force-verify", async (req, res) => {
  try {
    await runAsync("UPDATE users SET is_verified = 1");
    res.send("Mükemmel! Kayıtlı olan hesabınız arka planda OTOMATİK ONAYLANDI! Lütfen ana siteye dönüp Giriş Yapmayı (Log In) deneyin.");
  } catch (err) {
    res.send("Hata: " + err.message);
  }
});

app.post("/api/ai", async (req, res) => {
  try {
    console.log("📩 AI isteği geldi.");

    const {
      question,
      card = "",
      history = [],
    } = req.body;

    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Uploads klasöründeki tüm Excel dosyalarını tam olarak yükle (Sınırlama yok)
    let excelDataMap = {};
    try {
      const files = fs.readdirSync(uploadsDir).filter((f) => f.endsWith(".xlsx") || f.endsWith(".xls"));
      files.forEach((f) => {
        try {
          const wb = XLSX.readFile(path.join(uploadsDir, f));
          const sheet = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet);
          if (rows && rows.length > 0) {
            excelDataMap[f] = rows; // Tüm veriyi hafızaya alıyoruz
          }
        } catch (e) {
          console.warn(`⚠️ ${f} okunamadı:`, e.message);
        }
      });
    } catch (excelErr) {
      console.warn("⚠️ Uploads klasörü okunamadı:", excelErr.message);
    }

    // Excel verilerini akıllıca özetle ve hesapla (Data profiling)
    const excelDataSummary = Object.keys(excelDataMap).length > 0
      ? summarizeExcelData(excelDataMap)
      : "Sistemde yüklü Excel verisi bulunmamaktadır.";

    console.log(`📊 Yüklenen Excel Dosyaları: ${Object.keys(excelDataMap).join(", ") || "Yok"}`);

    const cleanedHistory = history
      .slice(-3)
      .map((m) => {
        let content = m.content || "";
        if (content.length > 800) {
          content = content.slice(0, 800) + "... (Uzun içerik temizlendi)";
        }
        return `${m.role}: ${content}`;
      })
      .join("\n");

    let rulesText = `- Cevabı kısa, öz ve net tut (maksimum 250 kelime, 5-6 madde).\n- Türkçe cevap ver.\n- Yönetici dili kullan.\n- Sonunda "Yapay Zeka Yorumu" ekle.`;
    
    if (Object.keys(excelDataMap).length > 0) {
      rulesText += `\n- Yukarıdaki hesaplanmış istatistikleri ve özet verileri detaylı şekilde yorumla.\n- Toplam maliyet, en çok arızalanan makine ve duruş süreleriyle ilgili nokta atışı tespitler yap.`;
    } else {
      rulesText += `\n- Sistemde şu an Excel verisi bulunmadığından, genel prensipler üzerinden mantıklı varsayımlar ve OPEX/Yalın Üretim doğrultusunda cevap ver. Hayali istatistik uydurma.`;
    }

    const prompt = `
Sen deneyimli bir OPEX, Lean Manufacturing ve Sürekli İyileştirme danışmanısın.

HESAPLANMIŞ EXCEL ÖZETLERİ VE İSTATİSTİKLERİ
${excelDataSummary}

SEÇİLEN KART

${card || "Genel"}

SOHBET GEÇMİŞİ (Son Mesajlar)

${cleanedHistory}

KULLANICI SORUSU

${question}

Kurallar:
${rulesText}
`;

    const provider = process.env.AI_PROVIDER || "groq";
    let answer = "";
    let usedModel = "";
    let usedProvider = "";

    if (provider === "lmstudio") {
      const lmUrl = process.env.LM_STUDIO_URL || "http://127.0.0.1:1234/v1";
      const lmClient = getLMStudioClient();

      try {
        let modelName = process.env.LM_STUDIO_MODEL;

        // Model adı belirtilmemişse yüklü olan aktif modeli otomatik algıla
        if (!modelName) {
          try {
            const modelsList = await lmClient.models.list();
            if (modelsList.data && modelsList.data.length > 0) {
              modelName = modelsList.data[0].id;
            }
          } catch (e) {
            console.warn("LM Studio model listesi okunamadı.");
          }
        }

        if (!modelName) modelName = "local-model";

        console.log(`🤖 LM Studio çağrılıyor (${lmUrl}) -> Model: ${modelName}`);

        const completion = await lmClient.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 2500,
        });

        answer = completion.choices[0]?.message?.content || "Cevap üretilemedi.";
        usedModel = modelName;
        usedProvider = "LM Studio";

      } catch (lmErr) {
        console.error("❌ LM Studio Bağlantı Hatası:", lmErr.message);

        if (groqClient) {
          console.log("🔄 LM Studio'ya bağlanılamadı. Groq sistemine geçiliyor...");
          const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
          const completion = await groqClient.chat.completions.create({
            model: modelName,
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.3,
          });
          answer = completion.choices[0]?.message?.content || "Cevap üretilemedi.";
          usedModel = modelName;
          usedProvider = "Groq (Yedek)";
        } else {
          throw new Error(
            `LM Studio sunucusuna (${lmUrl}) bağlanılamadı: ${lmErr.message}`
          );
        }
      }
    } else {
      const modelName = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
      console.log(`🤖 Groq çağrılıyor -> Model: ${modelName}`);
      const completion = await groqClient.chat.completions.create({
        model: modelName,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      answer = completion.choices[0]?.message?.content || "Cevap üretilemedi.";
      usedModel = modelName;
      usedProvider = "Groq";
    }

    res.json({
      success: true,
      answer,
      provider: usedProvider,
      model: usedModel,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error("AI HATASI:", err);
    res.status(500).json({
      success: false,
      answer: err instanceof Error ? err.message : "AI cevap veremedi.",
    });
  }
});

app.get("/api/maintenance", (req, res) => {
  try {
    const filePath = path.join(__dirname, "uploads", "cagri.xlsx");

    if (fs.existsSync(filePath)) {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      return res.json({ success: true, data });
    }

    return res.json({ success: true, data: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Excel okunamadı.",
    });
  }
});

// Tüm bilinmeyen route'ları React'e yönlendir (React Router)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Backend çalışıyor");
  console.log(`🌍 Port: ${PORT}`);
  console.log("=================================");
});