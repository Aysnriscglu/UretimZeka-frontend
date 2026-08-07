import {
  AlertTriangle,
  BarChart3,
  Clock3,
  Gauge,
  Brain,
  UploadCloud,
  CheckCircle2,
  FileSpreadsheet,
  Trash2,
} from "lucide-react";
import MachineScene from "../MachineScene";
import { useState } from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import * as XLSX from "xlsx";

const defaultKpiItems = [
  { title: "Toplam Üretim", value: "Veri Bekleniyor", unit: "", change: "--", color: "cyan", icon: BarChart3 },
  { title: "Toplam Duruş", value: "Veri Bekleniyor", unit: "", change: "--", color: "yellow", icon: Clock3 },
  { title: "Hurda Miktarı", value: "Veri Bekleniyor", unit: "", change: "--", color: "red", icon: Trash2 },
  { title: "Kritik Makine", value: "Veri Bekleniyor", unit: "", change: "--", color: "red", icon: AlertTriangle },
];

const generatePerf = (base: number) => {
  return Array.from({length: 7}).map(() => ({ value: base + Math.floor(Math.random() * 10 - 5) }));
};

const defaultMachineDataMap: Record<string, any> = {
  "Marka": { status: "NORMAL", statusColor: "#10b981", score: 92, issue: "Sorun yok", downtime: "0 dk", maintenance: "3 gün önce", aiWarning: "Stabil", alertsCount: 0, performance: generatePerf(90), scrapRecords: [] },
  "Merdane": { status: "NORMAL", statusColor: "#10b981", score: 88, issue: "Sorun yok", downtime: "5 dk", maintenance: "10 gün önce", aiWarning: "Optimum", alertsCount: 0, performance: generatePerf(85), scrapRecords: [] },
  "Alınkaynak": { status: "UYARI", statusColor: "#f59e0b", score: 75, issue: "Kaynak ısısı dengesiz", downtime: "12 dk", maintenance: "15 gün önce", aiWarning: "Isı sensörü kontrol edilmeli", alertsCount: 1, performance: generatePerf(75), scrapRecords: [] },
  "Ağız Açma": { status: "NORMAL", statusColor: "#10b981", score: 95, issue: "Sorun tespit edilmedi", downtime: "0 dk", maintenance: "12 gün önce", aiWarning: "Optimum çalışma sıcaklığında.", alertsCount: 0, performance: generatePerf(95), scrapRecords: [] },
  "Role 1": { status: "UYARI", statusColor: "#f59e0b", score: 68, issue: "Sensör gecikmesi", downtime: "22 dk", maintenance: "18 gün önce", aiWarning: "Sensör 2 yanıt süresi limitin üzerinde.", alertsCount: 3, performance: generatePerf(68), scrapRecords: [] },
  "Role 2": { status: "NORMAL", statusColor: "#10b981", score: 92, issue: "Sorun tespit edilmedi", downtime: "0 dk", maintenance: "2 gün önce", aiWarning: "Sistem verimliliği maksimumda.", alertsCount: 0, performance: generatePerf(92), scrapRecords: [] },
  "Role 3": { status: "NORMAL", statusColor: "#10b981", score: 89, issue: "Sorun tespit edilmedi", downtime: "0 dk", maintenance: "4 gün önce", aiWarning: "Normal", alertsCount: 0, performance: generatePerf(89), scrapRecords: [] },
  "Kalibre Presi": { status: "KRİTİK", statusColor: "#ef4444", score: 34, issue: "Hidrolik basınç problemi", downtime: "42 dk", maintenance: "8 gün önce", aiWarning: "Hidrolik arıza son 14 günde 4 kez tekrarlandı.", alertsCount: 1, performance: generatePerf(40), scrapRecords: [] },
  "Radüs Torna": { status: "NORMAL", statusColor: "#10b981", score: 94, issue: "Sorun yok", downtime: "0 dk", maintenance: "1 gün önce", aiWarning: "Kesici uç ömrü %80", alertsCount: 0, performance: generatePerf(94), scrapRecords: [] },
  "Subap Delme": { status: "UYARI", statusColor: "#f59e0b", score: 70, issue: "Titreşim artışı", downtime: "18 dk", maintenance: "20 gün önce", aiWarning: "Motor devrinde dalgalanma", alertsCount: 2, performance: generatePerf(70), scrapRecords: [] },
  "Montaj Presi": { status: "NORMAL", statusColor: "#10b981", score: 96, issue: "Sorun yok", downtime: "0 dk", maintenance: "5 gün önce", aiWarning: "Güç tüketimi stabil", alertsCount: 0, performance: generatePerf(96), scrapRecords: [] },
  "Ütü Presi": { status: "KRİTİK", statusColor: "#ef4444", score: 45, issue: "Aşırı ısınma uyarısı", downtime: "35 dk", maintenance: "25 gün önce", aiWarning: "Soğutma sistemi yetersiz", alertsCount: 2, performance: generatePerf(45), scrapRecords: [] },
};

const getKey = (obj: any, possibleKeys: string[]) => {
  if (!obj) return undefined;
  const foundKey = Object.keys(obj).find(k => 
    possibleKeys.some(pk => k.toLowerCase().trim() === pk.toLowerCase().trim() || k.toLowerCase().includes(pk.toLowerCase()))
  );
  return foundKey ? obj[foundKey] : undefined;
};

// Excel'deki Is Merkezi isimlerini bizim makine isimlerimize cevir
const mapMachineName = (rawName: string) => {
  if (!rawName) return null;
  const name = rawName.toUpperCase();
  if (name.includes("KALİBRE")) return "Kalibre Presi";
  if (name.includes("AĞIZ")) return "Ağız Açma";
  if (name.includes("MERDANE")) return "Merdane";
  if (name.includes("MARKA")) return "Marka";
  if (name.includes("ALIN")) return "Alınkaynak";
  if (name.includes("ROLE 1") || name.includes("RÖLE 1")) return "Role 1";
  if (name.includes("ROLE 2") || name.includes("RÖLE 2")) return "Role 2";
  if (name.includes("ROLE 3") || name.includes("RÖLE 3")) return "Role 3";
  if (name.includes("RADÜS")) return "Radüs Torna";
  if (name.includes("SUBAP")) return "Subap Delme";
  if (name.includes("MONTAJ")) return "Montaj Presi";
  if (name.includes("ÜTÜ")) return "Ütü Presi";
  return null;
};

function DigitalFactory() {
  const [selectedMachine, setSelectedMachine] = useState("Kalibre Presi");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const [kpis, setKpis] = useState(defaultKpiItems);
  const [machineData, setMachineData] = useState(defaultMachineDataMap);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          
          let parsedMachines = JSON.parse(JSON.stringify(defaultMachineDataMap));
          let totalProduction = 0;
          let totalScrap = 0;

          wb.SheetNames.forEach(sheetName => {
            const ws = wb.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(ws);
            if (!json || json.length === 0) return;

            json.forEach((row: any) => {
              const rawMachine = getKey(row, ["İş Merkezi", "Is Merkezi", "Makine"]);
              const mappedMachine = mapMachineName(rawMachine);
              
              const uretim = getKey(row, ["Üretilen Miktar", "Uretim"]);
              if (uretim) totalProduction += Number(uretim) || 0;

              const hurdaMiktar = getKey(row, ["Hurda Miktarı", "Hurda Miktari"]);
              if (hurdaMiktar) totalScrap += Number(hurdaMiktar) || 0;

              if (mappedMachine && parsedMachines[mappedMachine]) {
                const hurdaSebep = getKey(row, ["Hurda", "Hurda Kodu", "Sebep"]);
                const tarih = getKey(row, ["Tarih", "Zaman"]);
                
                if (hurdaSebep && hurdaMiktar) {
                   parsedMachines[mappedMachine].scrapRecords.push({
                      reason: hurdaSebep,
                      amount: Number(hurdaMiktar),
                      date: tarih ? String(tarih).split(' ')[0] : 'Bilinmiyor'
                   });
                }
              }
            });
          });

          // Process and aggregate scrap records for each machine
          Object.keys(parsedMachines).forEach(key => {
             const records = parsedMachines[key].scrapRecords;
             if (records.length > 0) {
                // Group by reason to find top scrap issues
                const grouped = records.reduce((acc: any, curr: any) => {
                   acc[curr.reason] = (acc[curr.reason] || 0) + curr.amount;
                   return acc;
                }, {});
                
                // Sort by highest amount
                const sortedScraps = Object.keys(grouped)
                   .map(reason => ({ reason, amount: grouped[reason] }))
                   .sort((a, b) => b.amount - a.amount)
                   .slice(0, 3); // Top 3 reasons
                   
                parsedMachines[key].topScraps = sortedScraps;
                parsedMachines[key].totalMachineScrap = records.reduce((sum: number, r: any) => sum + r.amount, 0);
             }
          });

          let newKpis = [...kpis];
          if (totalProduction > 0) {
             newKpis[0].value = totalProduction.toLocaleString('tr-TR');
             newKpis[0].unit = "adet";
             newKpis[0].change = "Excel Verisi";
          }
          if (totalScrap > 0) {
             newKpis[2].value = totalScrap.toLocaleString('tr-TR');
             newKpis[2].unit = "adet";
             newKpis[2].change = "Excel Verisi";
             newKpis[2].color = "red";
          }

          setKpis(newKpis);
          setMachineData(parsedMachines);
        } catch (error) {
          console.error("Error parsing Excel:", error);
        }
      };
      reader.readAsBinaryString(files[0]);
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  const data = machineData[selectedMachine] || machineData["Kalibre Presi"];
  const IssueIcon = data.alertsCount > 0 || data.status === "KRİTİK" || data.status === "UYARI" ? AlertTriangle : CheckCircle2;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dijital Fabrika</h1>
          <p className="live-text" style={{ margin: "4px 0 0 0" }}>
            <span className="live-light"></span>
            Canlı
            <span className="separator">•</span>
            {uploadedFiles.length > 0 ? "Veriler Excel'den Alınıyor" : "Lütfen Excel Yükleyin"}
          </p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <label style={{
            display: "flex", alignItems: "center", gap: "8px", background: "#2563eb",
            color: "white", padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
            fontSize: "14px", fontWeight: 600, transition: "0.2s"
          }}>
            <UploadCloud size={18} />
            Toplu Veri Yükle (Excel)
            <input type="file" multiple accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={handleFileUpload} />
          </label>
          
          {uploadedFiles.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
              {uploadedFiles.map((file, idx) => (
                 <div key={idx} style={{ 
                   display: "flex", alignItems: "center", gap: "6px", background: "#162d48", padding: "4px 10px", 
                   borderRadius: "6px", fontSize: "12px", color: "#9db2c7", border: "1px solid #1f3a5a"
                 }}>
                   <FileSpreadsheet size={14} color="#38bdf8" />
                   {file}
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="kpi-grid" style={{ marginTop: 16 }}>
        {kpis.map((item, i) => {
          const Icon = item.icon;
          return (
            <article className="kpi-card" key={i}>
              <div className={`kpi-icon ${item.color}`}><Icon size={23} /></div>
              <div className="kpi-information">
                <p>{item.title}</p>
                <strong>{item.value} {item.unit && <small>{item.unit}</small>}</strong>
                <span className={item.color}>{item.change}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="factory-layout">
        <div className="factory-scene">
          <MachineScene selectedMachine={selectedMachine} setSelectedMachine={setSelectedMachine} />
        </div>

        <aside className="machine-panel" style={{ overflowY: "auto", paddingRight: 8 }}>
          <div className="panel-header">
            <h2>{selectedMachine}</h2>
            <span className="critical-badge" style={{ background: data.statusColor + "30", color: data.statusColor, border: `1px solid ${data.statusColor}` }}>
              {data.status}
            </span>
          </div>

          <div className="risk-card">
            <span className="risk-title">Risk Puanı / Performans</span>
            <div className="risk-score">
              <span style={{ color: data.statusColor }}>{data.score}</span>
              <small>/100</small>
            </div>
            <div className="risk-bar" style={{ background: "#1b2d45" }}>
              <div className="risk-value" style={{ width: `${data.score}%`, background: data.statusColor }}></div>
            </div>
          </div>

          <div className="info-item" style={{ display: "flex", alignItems: "center", gap: 8, color: data.statusColor, marginTop: 14 }}>
            <IssueIcon size={16} /> {data.issue}
          </div>

          <div className="performance" style={{ marginTop: 20 }}>
            <h4>Performans <small>(Son 7 Gün)</small></h4>
            <div style={{ width: "100%", height: 70, background: "#11263d", borderRadius: 12, padding: 8, boxSizing: "border-box" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.performance}>
                  <Line type="stepAfter" dataKey="value" stroke={data.statusColor} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {data.topScraps && data.topScraps.length > 0 && (
             <div style={{ marginTop: 24, background: "#162539", borderRadius: 12, padding: 14, border: "1px solid #1f3a5a" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                   <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#f87171", fontWeight: 600 }}>
                      <Trash2 size={16} /> Hurda Analizi
                   </div>
                   <span style={{ fontSize: 12, background: "#ef444430", color: "#ef4444", padding: "2px 8px", borderRadius: 12 }}>
                      Toplam: {data.totalMachineScrap}
                   </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                   {data.topScraps.map((scrap: any, index: number) => (
                      <div key={index} style={{ background: "#1b2d45", padding: "8px 12px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <span style={{ color: "#cbd5e1", fontSize: 12, maxWidth: "70%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={scrap.reason}>
                            {scrap.reason}
                         </span>
                         <strong style={{ color: "#f87171", fontSize: 14 }}>{scrap.amount} adet</strong>
                      </div>
                   ))}
                </div>
             </div>
          )}

          <div className="ai-recommendations" style={{ padding: 14, borderRadius: 12, marginTop: 24, background: "#162d48" }}>
            <div className="ai-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontWeight: 600 }}>
                <Brain size={18} color="#39bdf8" /> Yapay Zekâ Uyarıları
              </div>
              <div className="badge" style={{ width: 24, height: 24, borderRadius: "50%", background: data.alertsCount > 0 ? "#ef4444" : "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                {data.alertsCount}
              </div>
            </div>

            <div className="ai-warning" style={{ padding: 14, borderRadius: 8, background: "#1b2d45", borderLeft: `4px solid ${data.statusColor}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <AlertTriangle size={18} color={data.statusColor} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ margin: 0, color: "#d2dbe7", fontSize: 13, lineHeight: 1.4 }}>{data.aiWarning}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

export default DigitalFactory;
