import {
  ShieldAlert,
  Factory,
  Wrench,
  Clock3,
  Bot,
  User,
  Send,
  Upload,
} from "lucide-react";
import "./AI.css";

import {
  useState,
  useRef,
  useEffect,
} from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function AI() {

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setUploadStatus("Yükleniyor...");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus(`✅ ${file.name} başarıyla yüklendi!`);
      } else {
        setUploadStatus(`❌ Yükleme hatası: ${data.message}`);
      }
    } catch {
      setUploadStatus("❌ Sunucuya bağlanılamadı.");
    } finally {
      setUploading(false);
    }
  };

  const [aiInfo, setAiInfo] = useState<{ provider: string; model: string; online: boolean }>({
    provider: "LM Studio",
    model: "Local Server",
    online: false,
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "# 👋 Merhaba\n\nBen **OPEX Yapay Zeka Asistanıyım**.\n\nDashboard ve Excel verilerini analiz edebilir,\ntrendleri yorumlayabilir,\nbakım önerileri sunabilir ve yöneticiler için rapor hazırlayabilirim.\n\nSorunu yazabilir veya aşağıdaki hazır analizlerden birini seçebilirsin.",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/ai/status");
        const data = await res.json();
        if (data.provider && data.model) {
          setAiInfo({
            provider: data.provider,
            model: data.model,
            online: data.online ?? true,
          });
        }
      } catch {
        setAiInfo((prev) => ({ ...prev, online: false }));
      }
    }
    checkStatus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function sendQuestion(
    text: string,
    card = "Genel Analiz"
  ) {

    if (!text.trim()) return;

    const history = [
      ...messages,
      {
        role: "user" as const,
        content: text,
      },
    ];

    setMessages(history);

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: text,
            card,
            history,
          }),
        }
      );

      const data = await response.json();

      if (data.provider && data.model) {
        setAiInfo({
          provider: data.provider,
          model: data.model,
          online: true,
        });
      }

      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            data.answer ??
            "AI cevap üretemedi.",
        },
      ]);

    } catch {

      setMessages([
        ...history,
        {
          role: "assistant",
          content:
            "❌ AI sunucusuna bağlanılamadı. Lütfen backend ve LM Studio uygulamasının çalıştığından emin olun.",
        },
      ]);

    }

    setLoading(false);

    setQuestion("");
  }

  const askAI = () => {
    sendQuestion(question);
  };

  const askPreset = (
    prompt: string,
    card: string
  ) => {
    sendQuestion(prompt, card);
  };

  return (
    <div className="ai-page">

      <h2>🤖 AI Kontrol Merkezi</h2>

      <div className="live-ai">
        <span
          className="live-dot"
          style={{ backgroundColor: aiInfo.online ? "#22c55e" : "#ef4444" }}
        ></span>
        {aiInfo.provider} {aiInfo.online ? "Aktif" : "Bağlantı Bekleniyor"}
      </div>

      <div className="ai-top-cards">

        <div className="ai-card">

          <div className="ai-stat-card">

            <div className="stat-icon risk-icon">
              <ShieldAlert size={22}/>
            </div>

            <h3>Risk Skoru</h3>

            <h1>
              88
              <small>/100</small>
            </h1>

            <span className="card-info">
              Genel Sistem Riski
            </span>

          </div>

        </div>        <div className="ai-card">

          <div className="ai-stat-card">

            <div className="stat-icon machine-icon">
              <Factory size={22}/>
            </div>

            <h3>En Riskli Makine</h3>

            <h1>Kalibre Presi</h1>

            <span className="card-info warning">
              Risk Oranı %92
            </span>

          </div>

        </div>

        <div className="ai-card">

          <div className="ai-stat-card">

            <div className="stat-icon tool-icon">
              <Wrench size={22}/>
            </div>

            <h3>En Sık Arıza</h3>

            <h1>Hidrolik</h1>

            <span className="card-info danger">
              Son 14 günde 18 kez
            </span>

          </div>

        </div>

        <div className="ai-card">

          <div className="ai-stat-card">

            <div className="stat-icon time-icon">
              <Clock3 size={22}/>
            </div>

            <h3>Bugünkü Duruş</h3>

            <h1>142 dk</h1>

            <span className="card-info positive">
              Dün'e göre -12 dk
            </span>

          </div>

        </div>

      </div>

      <div className="ai-content">

        <div className="ai-chat">

          <div className="ai-chat-card">

            <h2>🤖 OPEX Yapay Zeka Asistanı</h2>

            <p>
              Dashboard verilerini analiz etmek için aşağıdaki
              hazır analizlerden birini seçebilir, kendi
              sorunuzu yazabilir veya kendi Excel dosyanızı yükleyebilirsiniz.
            </p>

            <div className="upload-section" style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <label htmlFor="excel-upload" className="ask-ai" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", margin: 0, padding: "8px 16px", fontSize: "14px" }}>
                <Upload size={16} />
                {uploading ? "Yükleniyor..." : "📁 Kendi Excel Dosyanı Yükle"}
              </label>
              <input
                id="excel-upload"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              {uploadStatus && <span style={{ fontSize: "13px", color: uploadStatus.includes("✅") ? "#22c55e" : "#ef4444" }}>{uploadStatus}</span>}
            </div>

            <div className="quick-questions">

              <div
                className="quick-card"
                onClick={() =>
                  askPreset(
                    `Excel verilerini analiz et.

En riskli makineyi belirle.

Risk nedenlerini açıkla.

Bakım önceliklerini sırala.

Yönetici için kısa rapor hazırla.`,
                    "En Riskli Makine"
                  )
                }
              >

                <div className="quick-icon">
                  🚨
                </div>

                <h4>
                  En Riskli Makine
                </h4>

                <p>
                  Kritik makine analizi
                </p>

              </div>

              <div
                className="quick-card"
                onClick={() =>
                  askPreset(
                    `Excel verilerine göre bakım önceliklerini analiz et.

Bugün bakım yapılması gereken makineleri sırala.

Nedenlerini açıkla.`,
                    "Bakım Önerisi"
                  )
                }
              >

                <div className="quick-icon">
                  🔧
                </div>

                <h4>
                  Bakım Önerisi
                </h4>

                <p>
                  Öncelikli bakım listesi
                </p>

              </div>

              <div
                className="quick-card"
                onClick={() =>
                  askPreset(
                    `Üretim performansını analiz et.

Verimlilik durumunu açıkla.

Yönetici özeti hazırla.`,
                    "Üretim Özeti"
                  )
                }
              >

                <div className="quick-icon">
                  📈
                </div>

                <h4>
                  Üretim Özeti
                </h4>

                <p>
                  Performans değerlendirmesi
                </p>

              </div>              <div
                className="quick-card"
                onClick={() =>
                  askPreset(
                    `Excel verilerine göre duruşları analiz et.

En uzun duruşları bul.

Temel nedenleri açıkla.

İyileştirme önerileri sun.`,
                    "Duruş Analizi"
                  )
                }
              >
                <div className="quick-icon">
                  ⏱
                </div>

                <h4>Duruş Analizi</h4>

                <p>
                  Duruş nedenlerini incele
                </p>

              </div>

              <div
                className="quick-card"
                onClick={() =>
                  askPreset(
                    `Excel verilerine göre hurda analizini yap.

En yüksek hurda nedenlerini belirle.

Maliyet etkisini açıkla.

İyileştirme önerileri sun.`,
                    "Hurda Analizi"
                  )
                }
              >
                <div className="quick-icon">
                  ♻
                </div>

                <h4>Hurda Analizi</h4>

                <p>
                  Hurda oranlarını değerlendir
                </p>

              </div>

            </div>

            <textarea
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
              onKeyDown={(e) => {

                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {

                  e.preventDefault();

                  askAI();

                }

              }}
              placeholder="Excel verileri hakkında istediğiniz soruyu yazın..."
            />

            <button
              className="ask-ai"
              onClick={askAI}
              disabled={loading}
            >

              <Send size={18} />

              Gönder

            </button>

            <div className="ai-result">

              <h4>
                💬 AI Sohbeti
              </h4>

              <div className="chat-messages">

                {messages.map((message, index) => (

                  <div
                    key={index}
                    className={
                      message.role === "assistant"
                        ? "message ai-message"
                        : "message user-message"
                    }
                  >

                    <div className="message-header">

                      {message.role === "assistant" ? (
                        <>
                          <Bot size={18} />
                          <strong>{aiInfo.provider}</strong>
                        </>
                      ) : (
                        <>
                          <User size={18} />
                          <strong>Sen</strong>
                        </>
                      )}

                    </div>

                    <div className="message-content">

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>

                    </div>

                  </div>

                ))}                {loading && (

                  <div className="message ai-message">

                    <div className="message-header">

                      <Bot size={18} />

                      <strong>{aiInfo.provider}</strong>

                    </div>

                    <div className="thinking">

                      <span></span>
                      <span></span>
                      <span></span>

                      AI analiz ediyor...

                    </div>

                  </div>

                )}

                <div ref={chatEndRef}></div>

              </div>

            </div>

          </div>

        </div>

        {/* SAĞ PANEL */}

        <div className="critical-machines">

          <h3>🔥 Kritik Makineler</h3>

          <div className="machine-risk">

            <div className="machine-top">

              <span>Kalibre Presi</span>

              <strong>92%</strong>

            </div>

            <div className="risk-progress">

              <div
                className="risk-progress-fill danger"
                style={{ width: "92%" }}
              />

            </div>

          </div>

          <div className="machine-risk">

            <div className="machine-top">

              <span>Role 2</span>

              <strong>81%</strong>

            </div>

            <div className="risk-progress">

              <div
                className="risk-progress-fill warning"
                style={{ width: "81%" }}
              />

            </div>

          </div>

          <div className="machine-risk">

            <div className="machine-top">

              <span>Merdane</span>

              <strong>74%</strong>

            </div>

            <div className="risk-progress">

              <div
                className="risk-progress-fill medium"
                style={{ width: "74%" }}
              />

            </div>

          </div>

          <div className="machine-risk">

            <div className="machine-top">

              <span>Ağız Açma Presi</span>

              <strong>68%</strong>

            </div>

            <div className="risk-progress">

              <div
                className="risk-progress-fill low"
                style={{ width: "68%" }}
              />

            </div>

          </div>          <div className="ai-side-card">

            <h3>🧠 AI Önerileri</h3>

            <ul>

              <li>
                Kritik makineleri günlük analiz et.
              </li>

              <li>
                Duruş süresi 60 dakikayı geçen kayıtları
                önceliklendir.
              </li>

              <li>
                Tekrarlayan arızalar için kök neden analizi
                başlat.
              </li>

              <li>
                Bakım planlarını AI önerilerine göre
                güncelle.
              </li>

            </ul>

          </div>

          <div className="ai-side-card">

            <h3>📊 Hızlı İstatistikler</h3>

            <div className="mini-stat">

              <span>Toplam Analiz</span>

              <strong>{messages.length - 1}</strong>

            </div>

            <div className="mini-stat">

              <span>AI Durumu</span>

              <strong
                style={{
                  color: aiInfo.online ? "#22c55e" : "#ef4444",
                }}
              >
                {aiInfo.online ? "Aktif" : "Devre Dışı"}
              </strong>

            </div>

            <div className="mini-stat">

              <span>Model</span>

              <strong>{aiInfo.model}</strong>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default AI;