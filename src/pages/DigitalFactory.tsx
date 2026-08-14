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
  const str = String(val).replace(/[^0-9,\.-]/g, '').replace(',', '.');
  const num = Number(str);
  return isNaN(num) ? 0 : num;
};

const normalizeString = (str: any) => {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s\*\-\_\(\)\[\]\.]/g, '');
};

const getKey = (obj: any, possibleKeys: string[]) => {
  if (!obj) return undefined;
  
  for (const pk of possibleKeys) {
    const cleanPk = normalizeString(pk);
    const exactMatch = Object.keys(obj).find(k => normalizeString(k) === cleanPk);
    if (exactMatch) return obj[exactMatch];
  }

  for (const pk of possibleKeys) {
    const cleanPk = normalizeString(pk);
    const includesMatch = Object.keys(obj).find(k => normalizeString(k).includes(cleanPk));
    if (includesMatch) return obj[includesMatch];
  }
  
  return undefined;
};

const getMachineName = (rawName: any) => {
  if (!rawName || typeof rawName !== 'string') return null;
  return rawName.trim();
};

function DigitalFactory() {
  const [selectedMachine, setSelectedMachine] = useState("Makine 1");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [dynamicMachineList, setDynamicMachineList] = useState<{name: string, status: any}[]>([]);
  
  const [machineData, setMachineData] = useState<Record<string, any>>({});

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
          let parsedMachines: Record<string, any> = { ...machineData };

          results.forEach(bstr => {
            const wb = XLSX.read(bstr, { type: 'binary' });
            wb.SheetNames.forEach(sheetName => {
            const ws = wb.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(ws);
            if (!json || json.length === 0) return;

            json.forEach((row: any) => {
              let rawMachine = getKey(row, ["İş Merkezi_2", "İş Merkezi_1", "İş Merkezi", "Is Merkezi_2", "Is Merkezi_1", "Is Merkezi", "Makine_2", "Makine_1", "Makine", "Makina", "Tezgah", "Hat"]);
              let mappedMachine = getMachineName(rawMachine);
              
              if (mappedMachine) {
                 if (!parsedMachines[mappedMachine]) {
                    parsedMachines[mappedMachine] = { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0, downtimeRecords: [], scrapRecords: [] };
                 }

                 const uretim = getKey(row, ["Üretilen Miktar", "Uretim"]);
                 const hurdaMiktar = getKey(row, ["Hurda Miktarı", "Hurda Miktari"]);
                 const durusSuresi = getKey(row, ["Müdahale Süresi(dk)", "Müdahale Süresi", "Çağrı Süresi(dk)", "Çağrı Süresi", "Toplam Süre(dk)", "Toplam Süre", "Duruş Süresi", "Durus Suresi", "Downtime", "Sure", "Süre"]);
                 const durusNedeni = getKey(row, ["Arıza Tipi", "Ariza Tipi", "Duruş Adı", "Durus Adi", "Duruş Tipi", "Duruş Nedeni", "Durus Nedeni", "Çağrı Nedeni", "Sebep", "Açıklama", "Neden", "Duruş", "Durus"]);
                 const technician = getKey(row, ["Müdahale Eden", "Teknisyen", "Bakımcı", "Gideren", "Sorumlu", "Personel"]);
                 const solution = getKey(row, ["Çözüm", "Cozum", "M. Bitiş Yorumu", "Yapılan İşlem", "Yapilan Islem", "Aksiyon"]);
                 const priority = getKey(row, ["Önem Derecesi", "Onem Derecesi", "Önem", "Onem", "Priority"]);
                 const status = getKey(row, ["Durum", "Status"]);
                 const callType = getKey(row, ["Çağrı Tipi", "Cagri Tipi", "Tip", "Type"]);
                 const caller = getKey(row, ["Çağrıyı Açan", "Cagriyi Acan", "Bildiren", "Caller"]);
                 
                 const pDurusSuresi = parseNumber(durusSuresi);

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
                 
                 // Tüm çağrıları kaydet
                 if (durusNedeni || caller || callType) {
                    parsedMachines[mappedMachine].downtimeRecords.push({
                       reason: durusNedeni ? String(durusNedeni) : "Bilinmeyen Neden",
                       amount: pDurusSuresi,
                       date: tarih ? String(tarih).split(' ')[0] : 'Bilinmiyor',
                       technician: technician ? String(technician) : null,
                       solution: solution ? String(solution) : null,
                       priority: priority ? String(priority) : null,
                       status: status ? String(status) : null,
                       callType: callType ? String(callType) : null,
                       caller: caller ? String(caller) : null
                    });
                 }
              }
            });
            }); // end wb.SheetNames.forEach
          }); // end results.forEach

          // Process and aggregate records for each machine
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
                   machine.issue = sortedDowntimes[0].reason;
                   machine.aiWarning = `Son günlerde en çok zaman kaybı (${Math.round(sortedDowntimes[0].amount)} dk) '${sortedDowntimes[0].reason}' nedeniyle yaşandı.`;
                   machine.alertsCount = dRecords.length;
                }
             }

             if (dRecords.length > 0) {
                 const openCalls = dRecords.filter((r: any) => {
                     if (!r.status) return false;
                     const s = String(r.status).toLowerCase();
                     return s.includes('açık') || s.includes('beklemede') || s.includes('devam');
                 });
                 
                 if (openCalls.length > 0) {
                     machine.status = "KRİTİK";
                     machine.statusColor = "#ef4444";
                 } else if (machine.totalMachineDowntime > 60) {
                     machine.status = "UYARI";
                     machine.statusColor = "#f59e0b";
                 } else {
                     machine.status = "NORMAL";
                     machine.statusColor = "#10b981";
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

          // Top 12 makineleri sec (durus suresi ve cagrı sayısına gore siralayalim)
          const allMachinesList = Object.keys(parsedMachines).map(name => ({
             name,
             totalDowntime: parsedMachines[name].totalMachineDowntime || 0,
             status: parsedMachines[name].status === "KRİTİK" ? "critical" : parsedMachines[name].status === "UYARI" ? "warning" : "normal"
          })).sort((a, b) => b.totalDowntime - a.totalDowntime).slice(0, 12);
          
          setDynamicMachineList(allMachinesList);

          if (allMachinesList.length > 0) {
             setSelectedMachine(allMachinesList[0].name);
          }

          setMachineData(parsedMachines);
        } catch (error) {
          console.error("Error parsing Excel:", error);
        }
      });
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  const data = machineData[selectedMachine] || { status: "BİLGİ YOK", statusColor: "#64748b", alertsCount: 0 };
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
          <MachineScene selectedMachine={selectedMachine} setSelectedMachine={setSelectedMachine} machineDataList={dynamicMachineList} />
        </div>

        <aside className="machine-panel" style={{ overflowY: "auto", paddingRight: 8 }}>
          <div className="panel-header">
            <h2>{selectedMachine}</h2>
            <span className="critical-badge" style={{ background: data.statusColor + "30", color: data.statusColor, border: `1px solid ${data.statusColor}` }}>
              {data.status === "BİLGİ YOK" ? "VERİ BEKLENİYOR" : data.status}
            </span>
          </div>

          {/* Çağrı Raporu KPI'ları */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
            <div style={{ background: "#162539", padding: "16px", borderRadius: 12, border: "1px solid #1f3a5a" }}>
              <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>Toplam Çağrı</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#38bdf8" }}>
                {data.downtimeRecords ? data.downtimeRecords.length : 0}
              </div>
            </div>
            <div style={{ background: "#162539", padding: "16px", borderRadius: 12, border: "1px solid #1f3a5a" }}>
              <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>Toplam Süre (dk)</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: data.totalMachineDowntime > 0 ? "#ef4444" : "#10b981" }}>
                {data.totalMachineDowntime ? Math.round(data.totalMachineDowntime) : 0}
              </div>
            </div>
          </div>

          <div style={{ background: "#162539", padding: "16px", borderRadius: 12, border: "1px solid #1f3a5a", marginTop: 12 }}>
             <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 8, fontWeight: 500 }}>Açık / Bekleyen Çağrılar</div>
             <div style={{ fontSize: 24, fontWeight: 700, color: "#f59e0b" }}>
               {data.downtimeRecords ? data.downtimeRecords.filter((r: any) => {
                  if (!r.status) return false;
                  const s = String(r.status).toLowerCase();
                  return s.includes('açık') || s.includes('beklemede') || s.includes('devam');
               }).length : 0}
             </div>
          </div>

          {/* Detaylı Çağrı Listesi */}
          {data.downtimeRecords && data.downtimeRecords.length > 0 ? (
            <div style={{ marginTop: 24 }}>
              <h4 style={{ color: "#cbd5e1", marginBottom: 12, fontSize: 14, fontWeight: 600 }}>
                Çağrı ve Bakım Geçmişi
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[...data.downtimeRecords].reverse().slice(0, 15).map((rec: any, idx: number) => {
                  const isOpen = rec.status ? (String(rec.status).toLowerCase().includes('açık') || String(rec.status).toLowerCase().includes('beklemede')) : false;
                  return (
                  <div key={idx} style={{ background: "#162d48", padding: "16px", borderRadius: 8, borderLeft: `4px solid ${isOpen ? '#f59e0b' : '#10b981'}`, borderTop: "1px solid #1f3a5a", borderRight: "1px solid #1f3a5a", borderBottom: "1px solid #1f3a5a" }}>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                       <div>
                         <div style={{ color: "#38bdf8", fontSize: 11, fontWeight: 700, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 }}>
                           {rec.callType || "GENEL"} ÇAĞRI
                         </div>
                         <strong style={{ color: "#f8fafc", fontSize: 14, display: "block", lineHeight: 1.3 }}>{rec.reason}</strong>
                       </div>
                       <div style={{ textAlign: "right" }}>
                         <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600, background: isOpen ? "#f59e0b20" : "#10b98120", color: isOpen ? "#f59e0b" : "#10b981", marginBottom: 4 }}>
                           {rec.status || (isOpen ? "Açık" : "Tamamlandı")}
                         </span>
                         <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 700 }}>
                           {Math.round(rec.amount)} dk
                         </div>
                       </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "#94a3b8", background: "#0f172a", padding: "10px", borderRadius: "6px", marginBottom: (rec.solution ? 8 : 0) }}>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: 10 }}>Çağrıyı Açan</span>
                        <span style={{ color: "#e2e8f0" }}>{rec.caller || "-"}</span>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block", fontSize: 10 }}>Müdahale Eden</span>
                        <span style={{ color: "#e2e8f0" }}>{rec.technician || "-"}</span>
                      </div>
                      {rec.priority && (
                         <div style={{ gridColumn: "span 2", marginTop: 4 }}>
                           <span style={{ color: "#64748b", display: "block", fontSize: 10 }}>Önem Derecesi</span>
                           <span style={{ color: rec.priority.toLowerCase().includes('yüksek') ? '#ef4444' : '#e2e8f0' }}>{rec.priority}</span>
                         </div>
                      )}
                    </div>

                    {rec.solution && (
                      <div style={{ fontSize: 12, color: "#cbd5e1", background: "#1e3a5f", padding: "10px", borderRadius: "6px" }}>
                        <span style={{ color: "#38bdf8", fontWeight: 600, display: "block", fontSize: 11, marginBottom: 2 }}>Çözüm / Yapılan İşlem:</span>
                        {rec.solution}
                      </div>
                    )}
                  </div>
                )})}
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 24, background: "#1b2d45", padding: 20, borderRadius: 8, textAlign: "center", color: "#64748b", fontSize: 13, border: "1px dashed #334155" }}>
              Seçili makine için henüz çağrı kaydı bulunmuyor. Lütfen güncel raporu yükleyin.
            </div>
          )}
        </aside>
      </section>
    </>
  );
}

export default DigitalFactory;
