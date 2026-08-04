import { scrapRecommendations } from "../scrapRecommendations";
import "./ScrapAnalysis.css";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type ScrapRow = {
  Tarih?: string;
  "İş Merkezi"?: string;
  Operasyon?: string;
  "Hurda Kodu"?: string;
  "Hurda Miktarı"?: number;
  "Hurda Oranı"?: number;
  [key: string]: any;
};

function ScrapAnalysis() {
  /* -------------------- STATE -------------------- */

  const [excelData, setExcelData] = useState<ScrapRow[]>([]);//ham veriyi tut
  const [selectedRecord, setSelectedRecord] =//tablodan detayına tıklanan satırı tut
  useState<ScrapRow | null>(null);
//filtreleme stateleri kullanıcının seçtikleri
  const [selectedCenter, setSelectedCenter] =
    useState<string>("Tümü");

  const [selectedMaterial, setSelectedMaterial] =
  useState<string>("Tümü");

  const [selectedDate, setSelectedDate] =
    useState<string>("Tümü");
    

 //EXCEL KISMI

  const handleExcelUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
  //xlsx ile excel dosyasını binary formatta oku
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target?.result;

      const workbook = XLSX.read(data, {
        type: "binary",
      });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const json =
        XLSX.utils.sheet_to_json<ScrapRow>(worksheet);

      setExcelData(json);//ham veriyi state e at
      console.log(json);
      //yeni dosya yükelyince filtreleri sıfırla
      setSelectedCenter("Tümü");
setSelectedMaterial("Tümü");
setSelectedDate("Tümü");
    };

    reader.readAsBinaryString(file);
  };

 //FİLTRE SEÇENEKLERİ usememo performans için gereksiz hesaplamaları önlüyor

  const centers = useMemo(
    () => [
      "Tümü",
      ...new Set(//iş merkezlerini set verş yapısı kullanarak tekilleştiirdim
        excelData.map((x) => x["İş Merkezi"])
      ),
    ],
    [excelData]
  );

  const materials = useMemo(//malzeme kodlarını tekilleştir
  () => [
    "Tümü",
    ...new Set(
      excelData.map((x) =>
        String(x["Malzeme Kodu"])
      )
    ),
  ],
  [excelData]
);

  const dates = useMemo(//tarihleri gün bazında ayıt 
    () => [
      "Tümü",
      ...new Set(
        excelData.map((x) =>
          String(x["Tarih"] || "").split(" ")[0]
        )
      ),
    ],
    [excelData]
  );  
  //DİNAMİK FİLTRELEME
//kullancıı filtre seçtiğinde veriyi süzgeçten geçir
  const filteredData = useMemo(() => {
    return excelData.filter((item) => {
      const centerOK =
        selectedCenter === "Tümü" ||
        item["İş Merkezi"] === selectedCenter;
const materialOK =
  selectedMaterial === "Tümü" ||
  String(item["Malzeme Kodu"]) === selectedMaterial;

      const dateOK =
        selectedDate === "Tümü" ||
        String(item["Tarih"] || "").startsWith(selectedDate);

      return centerOK && materialOK && dateOK;
    });
  }, [
    excelData,
    selectedCenter,
 selectedMaterial,
    selectedDate,
  ]);

  //KPI HESAPLAMALARI
 //toplam hurda miktarını hesaplama
  const totalScrap = useMemo(() => {
    return filteredData.reduce(
      (sum, item) =>
        sum + Number(item["Hurda Miktarı"] || 0),
      0
    );
  }, [filteredData]);

  const totalRecords = filteredData.length;
//ortlama hurda miktarını hesapla
  const averageScrapRate = useMemo(() => {
    if (!filteredData.length) return 0;

    const total = filteredData.reduce(
      (sum, item) =>
        sum + Number(item["Hurda Oranı"] || 0),
      0
    );

    return total / filteredData.length;
  }, [filteredData]);

  const mostScrapCode = useMemo(() => {
    if (!filteredData.length) return null;

    const counts = filteredData.reduce(
      (acc: Record<string, number>, item) => {
        const code =
          item["Hurda Kodu"] || "Bilinmiyor";

        acc[code] = (acc[code] || 0) + 1;

        return acc;
      },
      {}
    );

    return Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0];
  }, [filteredData]);  
  //GRAFİK VERİLERİ
  //saatlik hurda dağımı çizgi grafikte kullanmak için 
  const dailyScrapData = useMemo(() => {
    return Object.values(
      filteredData.reduce(
        (acc: Record<string, any>, item) => {
          const tarih = item["Tarih"];

          if (!tarih) return acc;

          const hour = String(tarih)
            .split(" ")[1]
            ?.split(":")[0];

          if (!hour) return acc;

          if (!acc[hour]) {
            acc[hour] = {
              saat: hour,
              hurda: 0,
            };
          }

          acc[hour].hurda += Number(
            item["Hurda Miktarı"] || 0
          );

          return acc;
        },
        {}
      )
    ).sort(
      (a: any, b: any) =>
        Number(a.saat) - Number(b.saat)
    );
  }, [filteredData]);
//en sık görülen hurda kodları ilk 10
  const scrapCodeData = useMemo(() => {
    return Object.values(
      filteredData.reduce(
        (acc: Record<string, any>, item) => {
          const code =
            item["Hurda Kodu"] || "Bilinmiyor";

          if (!acc[code]) {
         acc[code] = {
  kod: code,
  adet: 0,
  aciklama: item["Hurda"] || "Açıklama bulunamadı",
            };
          }

          acc[code].adet++;

          return acc;
        },
        {}
      )
    )
      .sort((a: any, b: any) => b.adet - a.adet)
      .slice(0, 10);
  }, [filteredData]);
 //iş merkezien göre hurda dağılımı
  const centerScrapData = useMemo(() => {
    return Object.values(
      filteredData.reduce(
        (acc: Record<string, any>, item) => {
          const center =
            item["İş Merkezi"] || "Bilinmiyor";

          if (!acc[center]) {
            acc[center] = {
              merkez: center,
              hurda: 0,
            };
          }

          acc[center].hurda += Number(
            item["Hurda Miktarı"] || 0
          );

          return acc;
        },
        {}
      )
    );
  }, [filteredData]);
//malzeme koduna göre hurda dağılımı
 const materialScrapData = useMemo(() => {
  return Object.values(
    filteredData.reduce(
      (acc: Record<string, any>, item) => {
        const material =
          item["Malzeme Kodu"] || "Bilinmiyor";

        if (!acc[material]) {
          acc[material] = {
            malzeme: material,
            hurda: 0,
          };
        }

        acc[material].hurda += Number(
          item["Hurda Miktarı"] || 0
        );

        return acc;
      },
      {}
    )
  )
    .sort((a: any, b: any) => b.hurda - a.hurda)
    .slice(0, 10);
}, [filteredData]); return (
    <div className="scrap-page">

      {/* ---------------- HEADER ---------------- */}

      <div className="page-header">

        <div>
          <h1>Hurda Analizi</h1>
          <p>
            Üretim süreçlerindeki hurda performansını analiz edin.
          </p>
        </div>

        <label className="upload-btn">
          📂 Excel Yükle

          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            onChange={handleExcelUpload}
          />
        </label>

      </div>

      {/* ---------------- FILTERS ---------------- */}

      <div className="filter-row">

        <select
          value={selectedCenter}
          onChange={(e) =>
            setSelectedCenter(e.target.value)
          }
        >
          {centers.map((center) => (
            <option
              key={center}
              value={center}
            >
              {center}
            </option>
          ))}
        </select>

        <select
  value={selectedMaterial}
  onChange={(e) =>
    setSelectedMaterial(e.target.value)
  }
>
  {materials.map((material) => (
    <option
      key={material}
      value={material}
    >
      {material}
    </option>
  ))}
</select>

        <select
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(e.target.value)
          }
        >
          {dates.map((date) => (
            <option
              key={date}
              value={date}
            >
              {date}
            </option>
          ))}
        </select>

      </div>
      {excelData.length === 0 && (
  <div
    style={{
      background: "#16273f",
      border: "1px solid #253c5d",
      borderRadius: 16,
      padding: 25,
      marginBottom: 25,
      textAlign: "center",
      color: "#9fb0c9",
    }}
  >
    📂 Analizi başlatmak için bir Excel dosyası yükleyin.
  </div>
)}

      {/* ---------------- KPI CARDS ---------------- */}

      <div className="scrap-kpi-grid">        <div className="scrap-card">
          <div className="card-icon green">♻️</div>

          <span>Toplam Hurda</span>

          <h2>{totalScrap.toFixed(2)} Adet</h2>

          <p>Yüklenen Excel verisinden hesaplandı.</p>
        </div>

        <div className="scrap-card">
          <div className="card-icon orange">📉</div>

          <span>Hurda Oranı</span>

          <h2>%{averageScrapRate.toFixed(2)}</h2>

          <p>Ortalama hurda oranı</p>
        </div>

        <div className="scrap-card">
          <div className="card-icon blue">📋</div>

          <span>Toplam Kayıt</span>

          <h2>{totalRecords}</h2>

          <p>Filtreye uyan kayıt sayısı</p>
        </div>

        <div className="scrap-card">
          <div className="card-icon red">⚠️</div>

          <span>En Çok Hurda Kodu</span>

          <h2>
            {mostScrapCode
              ? String(mostScrapCode[0])
              : "-"}
          </h2>

          <p>
            {mostScrapCode
              ? `${mostScrapCode[1]} kayıt`
              : "Veri bulunamadı"}
          </p>
        </div>

      </div>

      {/* ---------------- CHART GRID ---------------- */}

      <div className="chart-grid">        {/* ---------- Saatlik Hurda ---------- */}

        <div className="chart-card">
          <h3>📈 Saatlik Hurda Miktarı (Adet)</h3>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={dailyScrapData}>
              <CartesianGrid stroke="#25354a" />

              <XAxis
                dataKey="saat"
                stroke="#8da2bd"
              />

              <YAxis stroke="#8da2bd" />

              <Tooltip
                formatter={(value: any) => [
                  `${value} Adet`,
                  "Hurda",
                ]}
                labelFormatter={(label) => `${label}:00`}
              />

              <Line
                type="monotone"
                dataKey="hurda"
                stroke="#22c55e"
                strokeWidth={4}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ---------- Hurda Kodları ---------- */}

        <div className="chart-card">
          <h3>🔥 En Sık Görülen Hurda Kodları</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scrapCodeData}>
              <CartesianGrid stroke="#25354a" />

              <XAxis
                dataKey="kod"
                stroke="#8da2bd"
              />

              <YAxis stroke="#8da2bd" />

              <Tooltip
  formatter={(value: any) => [`${value} kayıt`, "Adet"]}
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #3b82f6",
            borderRadius: 10,
            padding: 12,
            color: "white",
            maxWidth: 280,
          }}
        >
          <div><strong>Hurda Kodu:</strong> {data.kod}</div>

          <div style={{ marginTop: 8 }}>
            <strong>Açıklama:</strong>
            <br />
            {data.aciklama}
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Kayıt Sayısı:</strong> {data.adet}
          </div>
        </div>
      );
    }

    return null;
  }}
/>

              <Bar
                dataKey="adet"
                fill="#3b82f6"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>        {/* ---------- İş Merkezine Göre Hurda ---------- */}

        <div className="chart-card">
          <h3>🏭 İş Merkezine Göre Hurda</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={centerScrapData}>
              <CartesianGrid stroke="#25354a" />

             <XAxis
  dataKey="merkez"
  stroke="#8da2bd"
  interval={0}
  angle={-35}
  textAnchor="end"
  height={100}
  tick={{ fontSize: 15 }}
/>

              <YAxis stroke="#8da2bd" />

              <Tooltip
                formatter={(value: any) => [
                  `${value} Adet`,
                  "Hurda",
                ]}
              />

              <Bar
                dataKey="hurda"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ---------- Operasyona Göre Hurda ---------- */}

        <div className="chart-card">
          <h3>📦 Malzeme Koduna Göre Hurda</h3>

          <ResponsiveContainer width="100%" height={320}>
  <BarChart data={materialScrapData}>
    <CartesianGrid stroke="#25354a" />

   <XAxis
  dataKey="malzeme"
  stroke="#8da2bd"
  interval={0}
  angle={-20}
  textAnchor="end"
  height={70}
  tick={{ fontSize: 15 }}
/>
  


    <YAxis stroke="#8da2bd" />

    <Tooltip
      formatter={(value: any) => [
        `${value} Adet`,
        "Hurda",
      ]}
    />

    <Bar
      dataKey="hurda"
      fill="#f59e0b"
      radius={[8, 8, 0, 0]}
      animationDuration={1500}
    />
  </BarChart>
</ResponsiveContainer>
        </div>

      </div>      {/* ---------------- TABLE ---------------- */}

      <div className="chart-card">
        <h3>📋 Son Hurda Kayıtları</h3>

        <div className="table-container">
          <table className="scrap-table">

            <thead>
              <tr>
                <th>Tarih</th>
                <th>İş Merkezi</th>
               <th>Malzeme Kodu</th>
                <th>Hurda Kodu</th>
                <th>Hurda (Adet)</th>
              </tr>
            </thead>

            <tbody>

              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Gösterilecek veri bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredData
                  .slice(-10)
                  .reverse()
                  .map((item, index) => (
                    <tr
            key={index}
               onClick={() => setSelectedRecord(item)}
                   style={{
                  cursor: "pointer",
                     transition: "0.2s",
                       }}
                       onMouseEnter={(e) =>
                 (e.currentTarget.style.background = "#223550")
              }
                    onMouseLeave={(e) =>
             (e.currentTarget.style.background = "transparent")
                      }
                     >
                      <td>{item["Tarih"]}</td>

                      <td>{item["İş Merkezi"]}</td>

                     <td>{item["Malzeme Kodu"]}</td>

                      <td>{item["Hurda Kodu"]}</td>

                      <td>
                        {Number(
                          item["Hurda Miktarı"] || 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))
              )}

            </tbody>

          </table>
        </div>
           </div>
           <div className="chart-card">

  <h3>📋 Hurda Olay İnceleme</h3>

  {!selectedRecord ? (

    <div
      style={{
        textAlign: "center",
        padding: "40px",
        color: "#9fb0c9",
      }}
    >
      Tablodan bir kayıt seçiniz.
    </div>

  ) : (

    <div className="detail-grid">

      <div className="detail-box">
        <h4>⚠ Hurda</h4>

        <p><strong>Kod:</strong> {selectedRecord["Hurda Kodu"]}</p>

        <p><strong>Sebep:</strong> {selectedRecord["Hurda"]}</p>
      </div>

      <div className="detail-box">
        <h4>📦 Ürün</h4>

        <p><strong>Malzeme Kodu:</strong> {selectedRecord["Malzeme Kodu"]}</p>

        <p><strong>Malzeme:</strong> {selectedRecord["Malzeme"]}</p>
      </div>

      <div className="detail-box">
        <h4>🏭 Üretim</h4>

        <p><strong>İş Merkezi:</strong> {selectedRecord["İş Merkezi"]}</p>

        <p><strong>Operasyon:</strong> {selectedRecord["Operasyon"]}</p>

        <p><strong>Ekipman:</strong> {selectedRecord["Ekipmanlar"]}</p>
      </div>

      <div className="detail-box">
        <h4>👤 Personel</h4>

        <p><strong>Operatör:</strong> {selectedRecord["Operatör"]}</p>

        <p><strong>Güncelleyen:</strong> {selectedRecord["Güncelleyen"]}</p>
      </div>

      <div className="detail-box">
        <h4>📅 Tarih</h4>

        <p><strong>Kayıt:</strong> {selectedRecord["Tarih"]}</p>

        <p><strong>Güncelleme:</strong> {selectedRecord["Güncelleme Tarihi"]}</p>
      </div>

      <div className="detail-box">
        <h4>📄 Üretim</h4>

        <p><strong>İş Emri:</strong> {selectedRecord["İş Emri No"]}</p>

        <p><strong>Üretim ID:</strong> {selectedRecord["Üretim Id"]}</p>

        <p><strong>Lot:</strong> {selectedRecord["Lot No"]}</p>
      </div>

      <div className="detail-box">

  <h4>🧠 Kalite Değerlendirmesi</h4>

  {(() => {

    const code = String(selectedRecord["Hurda Kodu"] || "");

const defaultRecommendation = {
  reasons: [
    selectedRecord["Hurda"] || "Hurda nedeni belirtilmemiş.",
  ],
  checks: [
    "İlgili ekipmanı kontrol edin.",
    "Operasyon parametrelerini doğrulayın.",
    "Operatör kaydını inceleyin.",
  ],
};

const recommendation =
  scrapRecommendations[code] || defaultRecommendation;
 

    return (
      <>

        <div style={{ marginBottom: 18 }}>
          <strong>🔍 Olası Nedenler</strong>

          <ul style={{ marginTop: 8 }}>
            {recommendation.reasons.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <strong>✅ Kontrol Edilecek Noktalar</strong>

          <ul style={{ marginTop: 8 }}>
            {recommendation.checks.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

      </>
    );

  })()}

</div>

    </div>

  )}

</div>

    </div>
  );
}

export default ScrapAnalysis;