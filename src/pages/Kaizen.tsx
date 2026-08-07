import { useState, useMemo } from "react";
import "./Kaizen.css";

// ─── Tip tanımları ───────────────────────────────────────────────────────────
interface KaizenRow {
  id: number;
  ay: string;
  ekip1: string;
  ekip2: string;
  ekip3: string;
  yazan: string;
  bolum: string;
  uygulayan: string;
  puan: number;
  detayTur: string;
  iyilestirmeAlani: string;
  durum: "Tamamlandı" | "Devam Ediyor" | "Beklemede";
}

// ─── Örnek veri ──────────────────────────────────────────────────────────────
const kaizenData: KaizenRow[] = [
  { id: 1,  ay: "Ocak",    ekip1: "Ali Vural",     ekip2: "Selma Kaya",    ekip3: "Okan Demir",    yazan: "Kalite",    bolum: "Montaj",       uygulayan: "Üretim",     puan: 85,  detayTur: "5S",           iyilestirmeAlani: "İş İstasyonu Düzeni",    durum: "Tamamlandı"     },
  { id: 2,  ay: "Ocak",    ekip1: "Murat Çelik",   ekip2: "Ayşe Şahin",   ekip3: "Berk Yıldız",   yazan: "Üretim",    bolum: "Boya",         uygulayan: "Bakım",      puan: 72,  detayTur: "Hata Azaltma", iyilestirmeAlani: "Fire Oranı",             durum: "Tamamlandı"     },
  { id: 3,  ay: "Şubat",   ekip1: "Deniz Arslan",  ekip2: "Ceren Toprak",  ekip3: "Emre Kurt",     yazan: "Bakım",     bolum: "Kaynak",       uygulayan: "Kalite",     puan: 91,  detayTur: "SMED",         iyilestirmeAlani: "Setup Süresi",           durum: "Tamamlandı"     },
  { id: 4,  ay: "Şubat",   ekip1: "Fatih Güneş",   ekip2: "Melike Öz",    ekip3: "Sinan Aksoy",   yazan: "Planlama",  bolum: "Depo",         uygulayan: "Lojistik",   puan: 60,  detayTur: "Kaizen",       iyilestirmeAlani: "Stok Yönetimi",          durum: "Devam Ediyor"   },
  { id: 5,  ay: "Mart",    ekip1: "Hakan Polat",    ekip2: "Gizem Yıldız", ekip3: "Tolga Kılıç",   yazan: "Kalite",    bolum: "Montaj",       uygulayan: "Kalite",     puan: 78,  detayTur: "Poka-Yoke",    iyilestirmeAlani: "Hata Önleme",            durum: "Tamamlandı"     },
  { id: 6,  ay: "Mart",    ekip1: "İrem Doğan",    ekip2: "Kemal Aydın",  ekip3: "Nur Şimşek",    yazan: "Üretim",    bolum: "Presleme",     uygulayan: "Üretim",     puan: 55,  detayTur: "5S",           iyilestirmeAlani: "Çalışma Ortamı",         durum: "Beklemede"      },
  { id: 7,  ay: "Nisan",   ekip1: "Levent Başaran", ekip2: "Pınar Güler",  ekip3: "Cem Öztürk",    yazan: "Bakım",     bolum: "Elektrik",     uygulayan: "Bakım",      puan: 88,  detayTur: "TPM",          iyilestirmeAlani: "Ekipman Verimliliği",     durum: "Tamamlandı"     },
  { id: 8,  ay: "Nisan",   ekip1: "Rıza Koç",      ekip2: "Seda Türk",    ekip3: "Volkan Alp",    yazan: "Kalite",    bolum: "Test",         uygulayan: "Kalite",     puan: 94,  detayTur: "Hata Azaltma", iyilestirmeAlani: "Ürün Kalitesi",          durum: "Tamamlandı"     },
  { id: 9,  ay: "Mayıs",   ekip1: "Yusuf Çınar",   ekip2: "Zeynep Ay",    ekip3: "Ahmet Kara",    yazan: "Üretim",    bolum: "Montaj",       uygulayan: "Üretim",     puan: 67,  detayTur: "SMED",         iyilestirmeAlani: "Çevrim Süresi",          durum: "Devam Ediyor"   },
  { id: 10, ay: "Mayıs",   ekip1: "Burak Ege",     ekip2: "Cansu Mert",   ekip3: "Dila Esen",     yazan: "Planlama",  bolum: "Boya",         uygulayan: "Üretim",     puan: 82,  detayTur: "Kaizen",       iyilestirmeAlani: "Renk Kalitesi",          durum: "Tamamlandı"     },
  { id: 11, ay: "Haziran", ekip1: "Erhan Sönmez",  ekip2: "Ferda Yaman",  ekip3: "Gökhan Tan",    yazan: "Kalite",    bolum: "Kaynak",       uygulayan: "Kalite",     puan: 76,  detayTur: "Poka-Yoke",    iyilestirmeAlani: "Kaynak Kalitesi",        durum: "Tamamlandı"     },
  { id: 12, ay: "Haziran", ekip1: "Hacer Duman",   ekip2: "İlker Aslan",  ekip3: "Jale Tunç",     yazan: "Bakım",     bolum: "Depo",         uygulayan: "Lojistik",   puan: 59,  detayTur: "5S",           iyilestirmeAlani: "Depo Düzeni",            durum: "Beklemede"      },
  { id: 13, ay: "Temmuz",  ekip1: "Kadir Bozkurt", ekip2: "Leman Yüce",   ekip3: "Mustafa Cin",   yazan: "Üretim",    bolum: "Presleme",     uygulayan: "Üretim",     puan: 90,  detayTur: "TPM",          iyilestirmeAlani: "Makine Güvenilirliği",   durum: "Tamamlandı"     },
  { id: 14, ay: "Temmuz",  ekip1: "Nalan Kurt",    ekip2: "Oğuz Savaş",   ekip3: "Pelin Ateş",    yazan: "Kalite",    bolum: "Test",         uygulayan: "Kalite",     puan: 71,  detayTur: "Hata Azaltma", iyilestirmeAlani: "Test Süreci",            durum: "Devam Ediyor"   },
  { id: 15, ay: "Ağustos", ekip1: "Ramazan Bal",   ekip2: "Selcan Kılıç", ekip3: "Turgay Er",     yazan: "Planlama",  bolum: "Montaj",       uygulayan: "Üretim",     puan: 84,  detayTur: "SMED",         iyilestirmeAlani: "Montaj Hızı",            durum: "Tamamlandı"     },
];

const AYLAR = ["Tüm Aylar", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const TUR_RENKLERI: Record<string, string> = {
  "5S": "tur-5s",
  "SMED": "tur-smed",
  "TPM": "tur-tpm",
  "Poka-Yoke": "tur-poka",
  "Kaizen": "tur-kaizen",
  "Hata Azaltma": "tur-hata",
};
const DURUM_RENKLERI: Record<string, string> = {
  "Tamamlandı": "durum-tamam",
  "Devam Ediyor": "durum-devam",
  "Beklemede": "durum-bekle",
};

export default function Kaizen() {
  const [aktifAy, setAktifAy] = useState("Tüm Aylar");
  const [aramaMetni, setAramaMetni] = useState("");
  const [siralamaAlani, setSiralamaAlani] = useState<keyof KaizenRow>("id");
  const [siralamaYonu, setSiralamaYonu] = useState<"asc" | "desc">("asc");
  const [seciliSatir, setSeciliSatir] = useState<number | null>(null);

  // Filtrelenmiş ve sıralanmış veri
  const filtreliVeri = useMemo(() => {
    let veri = [...kaizenData];

    if (aktifAy !== "Tüm Aylar") {
      veri = veri.filter((r) => r.ay === aktifAy);
    }

    if (aramaMetni.trim()) {
      const kw = aramaMetni.toLowerCase();
      veri = veri.filter(
        (r) =>
          r.ekip1.toLowerCase().includes(kw) ||
          r.ekip2.toLowerCase().includes(kw) ||
          r.ekip3.toLowerCase().includes(kw) ||
          r.bolum.toLowerCase().includes(kw) ||
          r.iyilestirmeAlani.toLowerCase().includes(kw) ||
          r.detayTur.toLowerCase().includes(kw) ||
          r.uygulayan.toLowerCase().includes(kw)
      );
    }

    veri.sort((a, b) => {
      const av = a[siralamaAlani];
      const bv = b[siralamaAlani];
      if (av < bv) return siralamaYonu === "asc" ? -1 : 1;
      if (av > bv) return siralamaYonu === "asc" ? 1 : -1;
      return 0;
    });

    return veri;
  }, [aktifAy, aramaMetni, siralamaAlani, siralamaYonu]);

  // KPI özeti
  const toplamKaizen = filtreliVeri.length;
  const ortPuan = toplamKaizen ? Math.round(filtreliVeri.reduce((s, r) => s + r.puan, 0) / toplamKaizen) : 0;
  const tamamlanan = filtreliVeri.filter((r) => r.durum === "Tamamlandı").length;
  const enYuksekPuan = toplamKaizen ? Math.max(...filtreliVeri.map((r) => r.puan)) : 0;

  const handleSiralama = (alan: keyof KaizenRow) => {
    if (siralamaAlani === alan) {
      setSiralamaYonu((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSiralamaAlani(alan);
      setSiralamaYonu("asc");
    }
  };

  const SortIcon = ({ alan }: { alan: keyof KaizenRow }) => {
    if (siralamaAlani !== alan) return <span className="sort-icon inactive">↕</span>;
    return <span className="sort-icon active">{siralamaYonu === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="kaizen-page">
      {/* ── Başlık ── */}
      <div className="kaizen-header">
        <div>
          <h1 className="kaizen-title">
            <span className="kaizen-icon">⚡</span>
            Kaizen Yönetimi
          </h1>
          <p className="kaizen-subtitle">İyileştirme faaliyetlerini takip edin ve analiz edin</p>
        </div>
        <button className="btn-primary" onClick={() => alert("Yeni Kaizen ekle (yakında)")}>
          + Yeni Kaizen
        </button>
      </div>

      {/* ── KPI Kartları ── */}
      <div className="kz-kpi-grid">
        <div className="kz-kpi-card kz-cyan">
          <div className="kz-kpi-label">Toplam Kaizen</div>
          <div className="kz-kpi-value">{toplamKaizen}</div>
          <div className="kz-kpi-sub">kayıt</div>
        </div>
        <div className="kz-kpi-card kz-green">
          <div className="kz-kpi-label">Tamamlanan</div>
          <div className="kz-kpi-value">{tamamlanan}</div>
          <div className="kz-kpi-sub">adet</div>
        </div>
        <div className="kz-kpi-card kz-yellow">
          <div className="kz-kpi-label">Ortalama Puan</div>
          <div className="kz-kpi-value">{ortPuan}</div>
          <div className="kz-kpi-sub">/ 100</div>
        </div>
        <div className="kz-kpi-card kz-purple">
          <div className="kz-kpi-label">En Yüksek Puan</div>
          <div className="kz-kpi-value">{enYuksekPuan}</div>
          <div className="kz-kpi-sub">puan</div>
        </div>
      </div>

      {/* ── Ay Sekmeleri ── */}
      <div className="ay-tabs-wrapper">
        <div className="ay-tabs">
          {AYLAR.map((ay) => (
            <button
              key={ay}
              className={`ay-tab ${aktifAy === ay ? "ay-tab-active" : ""}`}
              onClick={() => setAktifAy(ay)}
            >
              {ay}
              {ay !== "Tüm Aylar" && (
                <span className="ay-count">
                  {kaizenData.filter((r) => r.ay === ay).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Arama ── */}
      <div className="kz-toolbar">
        <div className="kz-search-box">
          <span className="kz-search-icon">🔍</span>
          <input
            className="kz-search"
            placeholder="Ekip üyesi, bölüm, iyileştirme alanı..."
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
          />
          {aramaMetni && (
            <button className="kz-clear" onClick={() => setAramaMetni("")}>✕</button>
          )}
        </div>
        <div className="kz-result-count">
          <span>{filtreliVeri.length}</span> sonuç
        </div>
      </div>

      {/* ── Tablo ── */}
      <div className="kz-table-wrapper">
        <table className="kz-table">
          <thead>
            <tr>
              <th onClick={() => handleSiralama("ay")} className="th-sortable">
                Ay <SortIcon alan="ay" />
              </th>
              <th onClick={() => handleSiralama("ekip1")} className="th-sortable">
                Ekip Üyesi 1 <SortIcon alan="ekip1" />
              </th>
              <th>Ekip Üyesi 2</th>
              <th>Ekip Üyesi 3</th>
              <th onClick={() => handleSiralama("yazan")} className="th-sortable">
                Kaizeni Yazan <SortIcon alan="yazan" />
              </th>
              <th onClick={() => handleSiralama("iyilestirmeAlani")} className="th-sortable">
                İyileştirme Alanı <SortIcon alan="iyilestirmeAlani" />
              </th>
              <th onClick={() => handleSiralama("uygulayan")} className="th-sortable">
                Uygulayan Bölüm <SortIcon alan="uygulayan" />
              </th>
              <th onClick={() => handleSiralama("puan")} className="th-sortable th-center">
                Puan <SortIcon alan="puan" />
              </th>
              <th onClick={() => handleSiralama("detayTur")} className="th-sortable">
                İyileştirme Türü <SortIcon alan="detayTur" />
              </th>
              <th className="th-center">Durum</th>
            </tr>
          </thead>
          <tbody>
            {filtreliVeri.length === 0 ? (
              <tr>
                <td colSpan={10} className="kz-empty">
                  <div className="kz-empty-inner">
                    <span>📋</span>
                    <p>Kayıt bulunamadı</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtreliVeri.map((row) => (
                <tr
                  key={row.id}
                  className={`kz-row ${seciliSatir === row.id ? "kz-row-selected" : ""}`}
                  onClick={() => setSeciliSatir(seciliSatir === row.id ? null : row.id)}
                >
                  <td>
                    <span className="ay-badge">{row.ay}</span>
                  </td>
                  <td>
                    <div className="ekip-cell">
                      <span className="avatar">{row.ekip1.charAt(0)}</span>
                      {row.ekip1}
                    </div>
                  </td>
                  <td>
                    <div className="ekip-cell">
                      <span className="avatar avatar-2">{row.ekip2.charAt(0)}</span>
                      {row.ekip2}
                    </div>
                  </td>
                  <td>
                    <div className="ekip-cell">
                      <span className="avatar avatar-3">{row.ekip3.charAt(0)}</span>
                      {row.ekip3}
                    </div>
                  </td>
                  <td>
                    <span className="bolum-tag">{row.yazan}</span>
                  </td>
                  <td className="alani-cell">{row.iyilestirmeAlani}</td>
                  <td>
                    <span className="bolum-tag bolum-uygulayan">{row.uygulayan}</span>
                  </td>
                  <td className="td-center">
                    <div className="puan-wrapper">
                      <div
                        className="puan-bar"
                        style={{ "--puan": `${row.puan}%` } as React.CSSProperties}
                      />
                      <span className={`puan-text ${row.puan >= 80 ? "puan-high" : row.puan >= 60 ? "puan-mid" : "puan-low"}`}>
                        {row.puan}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`tur-badge ${TUR_RENKLERI[row.detayTur] ?? ""}`}>
                      {row.detayTur}
                    </span>
                  </td>
                  <td className="td-center">
                    <span className={`durum-badge ${DURUM_RENKLERI[row.durum]}`}>
                      {row.durum}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Seçili Satır Detayı ── */}
      {seciliSatir !== null && (() => {
        const r = kaizenData.find((x) => x.id === seciliSatir);
        if (!r) return null;
        return (
          <div className="kz-detail-panel">
            <div className="kz-detail-header">
              <span className="kz-detail-title">📌 Kaizen Detayı — {r.ay}</span>
              <button className="kz-close" onClick={() => setSeciliSatir(null)}>✕ Kapat</button>
            </div>
            <div className="kz-detail-grid">
              <div className="kz-detail-item"><span>Ekip 1</span><strong>{r.ekip1}</strong></div>
              <div className="kz-detail-item"><span>Ekip 2</span><strong>{r.ekip2}</strong></div>
              <div className="kz-detail-item"><span>Ekip 3</span><strong>{r.ekip3}</strong></div>
              <div className="kz-detail-item"><span>Kaizeni Yazan</span><strong>{r.yazan}</strong></div>
              <div className="kz-detail-item"><span>İyileştirme Alanı</span><strong>{r.iyilestirmeAlani}</strong></div>
              <div className="kz-detail-item"><span>Uygulayan Bölüm</span><strong>{r.uygulayan}</strong></div>
              <div className="kz-detail-item"><span>Kaizen Puanı</span><strong className="puan-high">{r.puan} / 100</strong></div>
              <div className="kz-detail-item"><span>İyileştirme Türü</span><strong>{r.detayTur}</strong></div>
              <div className="kz-detail-item"><span>Durum</span><strong>{r.durum}</strong></div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
