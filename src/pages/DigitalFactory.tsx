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
  "Marka": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Merdane": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Alınkaynak": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Ağız Açma": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Role 1": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Role 2": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Role 3": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Kalibre Presi": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Radüs Torna": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Subap Delme": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Montaj Presi": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
  "Ütü Presi": { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 },
};

const parseNumber = (val: any) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const str = String(val).replace(',', '.');
  const num = Number(str);
  return isNaN(num) ? 0 : num;
};

const getKey = (obj: any, possibleKeys: string[]) => {
  if (!obj) return undefined;
  
  const exactMatch = Object.keys(obj).find(k => {
    const cleanK = k.toLowerCase().replace(/[\s\*\-\_\(\)\[\]]/g, '');
    return possibleKeys.some(pk => {
       const cleanPk = pk.toLowerCase().replace(/[\s\*\-\_\(\)\[\]]/g, '');
       return cleanK === cleanPk;
    });
  });
  
  if (exactMatch) return obj[exactMatch];

  const includesMatch = Object.keys(obj).find(k => {
    const cleanK = k.toLowerCase().replace(/[\s\*\-\_\(\)\[\]]/g, '');
    return possibleKeys.some(pk => {
       const cleanPk = pk.toLowerCase().replace(/[\s\*\-\_\(\)\[\]]/g, '');
       return cleanK.includes(cleanPk);
    });
  });
  
  return includesMatch ? obj[includesMatch] : undefined;
};

// Excel'deki Is Merkezi isimlerini bizim makine isimlerimize cevir
const mapMachineName = (rawName: string) => {
  if (!rawName) return null;
  const name = rawName.toUpperCase();
  if (name.includes("KALİBRE") || name.includes("KALIBRE")) return "Kalibre Presi";
  if (name.includes("AĞIZ") || name.includes("AGIZ")) return "Ağız Açma";
  if (name.includes("MERDANE")) return "Merdane";
  if (name.includes("MARKA")) return "Marka";
  if (name.includes("ALIN")) return "Alınkaynak";
  if (name.includes("ROLE 1") || name.includes("RÖLE 1")) return "Role 1";
  if (name.includes("ROLE 2") || name.includes("RÖLE 2")) return "Role 2";
  if (name.includes("ROLE 3") || name.includes("RÖLE 3")) return "Role 3";
  if (name.includes("RADÜS") || name.includes("RADUS")) return "Radüs Torna";
  if (name.includes("SUBAP")) return "Subap Delme";
  if (name.includes("MONTAJ")) return "Montaj Presi";
  if (name.includes("ÜTÜ") || name.includes("UTU")) return "Ütü Presi";
  return null;
};

function DigitalFactory() {
  const [selectedMachine, setSelectedMachine] = useState("Kalibre Presi");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const [machineData, setMachineData] = useState(defaultMachineDataMap);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);

      Promise.all(files.map(file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve(evt.target?.result);
        reader.readAsBinaryString(file);
      }))).then(results => {
        try {
          let parsedMachines = JSON.parse(JSON.stringify(machineData));
          let totalProduction = 0;
          let totalScrap = 0;
          let totalDowntime = 0;

          results.forEach(bstr => {
            const wb = XLSX.read(bstr, { type: 'binary' });
            wb.SheetNames.forEach(sheetName => {
            const ws = wb.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(ws);
            if (!json || json.length === 0) return;

            json.forEach((row: any) => {
              const rawMachine = getKey(row, ["İş Merkezi", "Is Merkezi", "Makine"]);
              const mappedMachine = mapMachineName(rawMachine);
              
              const uretim = getKey(row, ["Üretilen Miktar", "Uretim"]);
              if (uretim) totalProduction += parseNumber(uretim);

              const hurdaMiktar = getKey(row, ["Hurda Miktarı", "Hurda Miktari"]);
              if (hurdaMiktar) totalScrap += parseNumber(hurdaMiktar);

              const durusSuresi = getKey(row, ["Müdahale Süresi(dk)", "Müdahale Süresi", "Çağrı Süresi(dk)", "Çağrı Süresi", "Toplam Süre(dk)", "Toplam Süre", "Duruş Süresi", "Durus Suresi", "Downtime", "Sure", "Süre"]);
              const durusNedeni = getKey(row, ["Duruş Adı", "Durus Adi", "Duruş Tipi", "Duruş Nedeni", "Durus Nedeni", "Çağrı Nedeni", "Sebep", "Açıklama", "Neden", "Duruş", "Durus"]);
              const pDurusSuresi = parseNumber(durusSuresi);
              if (pDurusSuresi > 0) totalDowntime += pDurusSuresi;

              if (mappedMachine && parsedMachines[mappedMachine]) {
                 if (!parsedMachines[mappedMachine].downtimeRecords) {
                    parsedMachines[mappedMachine].downtimeRecords = [];
                 }
                 
                 if (uretim) {
                    parsedMachines[mappedMachine].machineProduction = (parsedMachines[mappedMachine].machineProduction || 0) + parseNumber(uretim);
                 }
                 if (hurdaMiktar) {
                    parsedMachines[mappedMachine].machineScrap = (parsedMachines[mappedMachine].machineScrap || 0) + parseNumber(hurdaMiktar);
                 }
                 if (pDurusSuresi > 0) {
                    parsedMachines[mappedMachine].downtime = `${Math.round((parsedMachines[mappedMachine].machineDowntime || 0) + pDurusSuresi)} dk`;
                    parsedMachines[mappedMachine].machineDowntime = (parsedMachines[mappedMachine].machineDowntime || 0) + pDurusSuresi;
                 }

                const hurdaSebep = getKey(row, ["Hurda", "Hurda Kodu", "Hurda Sebebi"]);
                const tarih = getKey(row, ["Tarih", "Zaman", "Ay"]);
                
                if (hurdaSebep && hurdaMiktar) {
                   parsedMachines[mappedMachine].scrapRecords.push({
                      reason: hurdaSebep,
                      amount: parseNumber(hurdaMiktar),
                      date: tarih ? String(tarih).split(' ')[0] : 'Bilinmiyor'
                   });
                }
                
                if (durusNedeni && pDurusSuresi > 0) {
                   parsedMachines[mappedMachine].downtimeRecords.push({
                      reason: String(durusNedeni),
                      amount: pDurusSuresi,
                      date: tarih ? String(tarih).split(' ')[0] : 'Bilinmiyor'
                   });
                }
              }
            });
          }); // end results.forEach

          // Process and aggregate scrap records for each machine
          Object.keys(parsedMachines).forEach(key => {
             const machine = parsedMachines[key];
             const records = machine.scrapRecords;
             const dRecords = machine.downtimeRecords || [];
             
             if (dRecords.length > 0) {
                const groupedD = dRecords.reduce((acc: any, curr: any) => {
                   acc[curr.reason] = (acc[curr.reason] || 0) + curr.amount;
                   return acc;
                }, {});
                
                const sortedDowntimes = Object.keys(groupedD)
                   .map(reason => ({ reason, amount: groupedD[reason] }))
                   .sort((a, b) => b.amount - a.amount)
                   .slice(0, 3);
                   
                machine.topDowntimes = sortedDowntimes;
                machine.totalMachineDowntime = dRecords.reduce((sum: number, r: any) => sum + r.amount, 0);
                
                if (sortedDowntimes.length > 0) {
                   machine.issue = sortedDowntimes[0].reason; // Set latest issue to top downtime reason
                   machine.aiWarning = `Son günlerde en çok zaman kaybı (${Math.round(sortedDowntimes[0].amount)} dk) '${sortedDowntimes[0].reason}' nedeniyle yaşandı.`;
                   machine.alertsCount = dRecords.length;
                }
             }

             // Hesaplama
             if (machine.machineProduction > 0) {
                 const scrapRate = (machine.machineScrap || 0) / machine.machineProduction;
                 let calculatedScore = 100 - Math.round(scrapRate * 100);
                 if (calculatedScore < 0) calculatedScore = 0;
                 if (calculatedScore > 100) calculatedScore = 100;
                 machine.score = calculatedScore;
                 
             } else if (machine.totalMachineDowntime > 0) {
                 // Uretim yok ama durus var. Her 10 dk durus 1 puan dusursun
                 let calculatedScore = 100 - Math.min(100, Math.round(machine.totalMachineDowntime / 10));
                 if (calculatedScore < 0) calculatedScore = 0;
                 machine.score = calculatedScore;
             }
             
             if (machine.machineProduction > 0 || machine.totalMachineDowntime > 0) {
                 if (machine.score >= 85) {
                     machine.status = "NORMAL";
                     machine.statusColor = "#10b981";
                 } else if (machine.score >= 60) {
                     machine.status = "UYARI";
                     machine.statusColor = "#f59e0b";
                 } else {
                     machine.status = "KRİTİK";
                     machine.statusColor = "#ef4444";
                 }
             }

             if (records.length > 0) {
                const grouped = records.reduce((acc: any, curr: any) => {
                   acc[curr.reason] = (acc[curr.reason] || 0) + curr.amount;
                   return acc;
                }, {});
                
                const sortedScraps = Object.keys(grouped)
                   .map(reason => ({ reason, amount: grouped[reason] }))
                   .sort((a, b) => b.amount - a.amount)
                   .slice(0, 3);
                   
                machine.topScraps = sortedScraps;
                machine.totalMachineScrap = records.reduce((sum: number, r: any) => sum + r.amount, 0);
             }
          });

          setMachineData(parsedMachines);
        } catch (error) {
          console.error("Error parsing Excel:", error);
        }
      });
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


      <section className="factory-layout">
        <div className="factory-scene">
          <MachineScene selectedMachine={selectedMachine} setSelectedMachine={setSelectedMachine} />
        </div>

        <aside className="machine-panel" style={{ overflowY: "auto", paddingRight: 8 }}>
          <div className="panel-header">
            <h2>{selectedMachine}</h2>
            <span className="critical-badge" style={{ background: data.statusColor + "30", color: data.statusColor, border: `1px solid ${data.statusColor}` }}>
              {data.status === "BİLGİ YOK" ? "VERİ BEKLENİYOR" : data.status}
            </span>
          </div>

          {/* Duruş Özeti Kartı */}
          <div style={{ background: "#162539", padding: "16px 20px", borderRadius: 12, border: "1px solid #1f3a5a", marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 13, marginBottom: 8, fontWeight: 500 }}>
              <Clock3 size={16} color="#eab308" /> Toplam Duruş Süresi
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: data.totalMachineDowntime > 0 ? "#ef4444" : "#10b981", lineHeight: 1 }}>
                {data.totalMachineDowntime ? Math.round(data.totalMachineDowntime) : 0}
              </span>
              <span style={{ color: "#94a3b8", fontSize: 16, fontWeight: 500 }}>dk</span>
            </div>
          </div>

          {/* Duruş Nedenleri Listesi */}
          {data.topDowntimes && data.topDowntimes.length > 0 ? (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ color: "#cbd5e1", marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
                En Sık Yaşanan Duruş Nedenleri
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {data.topDowntimes.map((dw: any, index: number) => (
                  <div key={index} style={{ background: "#1b2d45", padding: "12px 16px", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${index === 0 ? "#ef4444" : "#f59e0b"}` }}>
                    <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, maxWidth: "75%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={dw.reason}>
                      {dw.reason}
                    </span>
                    <strong style={{ color: index === 0 ? "#ef4444" : "#f59e0b", fontSize: 14 }}>{Math.round(dw.amount)} dk</strong>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 24, background: "#1b2d45", padding: 20, borderRadius: 8, textAlign: "center", color: "#64748b", fontSize: 13, border: "1px dashed #334155" }}>
              Seçili makine için henüz duruş kaydı bulunmuyor. Lütfen güncel raporu yükleyin.
            </div>
          )}

          {/* Yapay Zeka Uyarıları */}
          <div className="ai-recommendations" style={{ padding: 16, borderRadius: 12, marginTop: 24, background: "#162d48", border: "1px solid #1f3a5a" }}>
            <div className="ai-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "white", fontWeight: 600 }}>
                <Brain size={18} color="#39bdf8" /> Yapay Zekâ Analizi
              </div>
              <div className="badge" style={{ width: 24, height: 24, borderRadius: "50%", background: data.alertsCount > 0 ? "#ef4444" : "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>
                {data.alertsCount || 0}
              </div>
            </div>

            <div className="ai-warning" style={{ padding: 14, borderRadius: 8, background: "#1b2d45", borderLeft: `4px solid ${data.alertsCount > 0 ? "#ef4444" : "#10b981"}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <AlertTriangle size={18} color={data.alertsCount > 0 ? "#ef4444" : "#10b981"} style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ margin: 0, color: "#d2dbe7", fontSize: 13, lineHeight: 1.5 }}>
                    {data.aiWarning || "Makine stabil görünüyor. Önemli bir duruş tespit edilmedi."}
                  </p>
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
