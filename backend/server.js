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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

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
console.log(`🤖 Aktif Sağlayıcı: ${process.env.AI_PROVIDER || "lmstudio"}`);
console.log(`🔗 Hedef LM Studio URL: ${process.env.LM_STUDIO_URL || "http://127.0.0.1:1234/v1"}`);
console.log(`📁 Backend Dizini: ${__dirname}`);
console.log("=================================");

app.get("/", (req, res) => {
  res.send("Backend çalışıyor.");
});

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
  const provider = process.env.AI_PROVIDER || "lmstudio";
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
- Yukarıdaki hesaplanmış istatistikleri ve özet verileri detaylı şekilde yorumla.
- Toplam maliyet, en çok arızalanan makine ve duruş süreleriyle ilgili nokta atışı tespitler yap.
- Cevabı kısa, öz ve net tut (maksimum 250 kelime, 5-6 madde).
- Türkçe cevap ver.
- Yönetici dili kullan.
- Sonunda "Yapay Zeka Yorumu" ekle.
`;

    const provider = process.env.AI_PROVIDER || "lmstudio";
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

const PORT = 5000;

app.listen(PORT, "127.0.0.1", () => {
  console.log("=================================");
  console.log("🚀 Backend çalışıyor");
  console.log(`🌍 http://127.0.0.1:${PORT}`);
  console.log("=================================");
});