import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "./ScrapAnalysis.css";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function DurusAnalysis() {
    const [data, setData] = useState<any[]>([]); //excelden gelen ham veriyi tutucak
const [filteredData, setFilteredData] = useState<any[]>([]);//filtrelere göre anlık değişen veriyi tutar
const [selectedRecord, setSelectedRecord] = useState<any>(null);//tablodan seçtiğimde detayına bakmek için

const [machines, setMachines] = useState<string[]>([]);
const [selectedMachine, setSelectedMachine] = useState("Tümü");

const [stopTypes, setStopTypes] = useState<string[]>([]);
const [selectedStopType, setSelectedStopType] = useState("Tümü");

const [fileName, setFileName] = useState("");//arayüzde dosya adını göstermek için
const handleFileUpload = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  setFileName(file.name);//yüklenen dosyanın adını state e ata 

  const reader = new FileReader();

  reader.onload = (e) => {
    const data = e.target?.result;

    const workbook = XLSX.read(data, {
      type: "binary",
    });

    const sheetName = workbook.SheetNames[0];//ilk sayfayı seç

    const worksheet = workbook.Sheets[sheetName];

    const jsonData: any[] = XLSX.utils.sheet_to_json( //sayfadaki verileri JSON formatına çevir
      worksheet,
      { defval: "" }
    );
    console.log(jsonData[0]);   
    console.log(
  [...new Set(jsonData.map(item => item["Çağrı Nedeni"]))]
);

    setData(jsonData);//ham veriyi ve filtreleneccek başlangıç verisini güncelle
    setFilteredData(jsonData);

    const machineList = [//exceldeki makine isimlerini tara tekrar etmeyecek sekilde set kullandım liste yap
      ...new Set(
        jsonData.map((item) => item["Makine"])
      ),
    ];

    setMachines(machineList);

    const stopTypeList = [//aynı sekilde durus tiplerini de 
      ...new Set(
        jsonData.map((item) => item["Duruş Tipi"])
      ),
    ];

    setStopTypes(stopTypeList);
  };

  reader.readAsBinaryString(file);
};
const totalStops = filteredData.length;//toplam durus sayısı

const totalDuration = filteredData//toplam durus süresini hesaplama metni sayıya çevir topla
  .reduce(
    (sum, item) =>
      sum + Number(item["Toplam Süre(dk)"] || 0),
    0
  )
  .toFixed(1);
  const machineCounts: Record<string, number> = {};//her makinenin kaç kez durduğunu saymak için nesne olusturdum

filteredData.forEach((item) => {
  const machine = item["Makine"];

  if (!machine) return;

  machineCounts[machine] =
    (machineCounts[machine] || 0) + 1;
});

const mostStoppedMachine =//en çok duran makineyi bulan fonksiyon sıralama yaptım ve ilk makineyi al
  Object.entries(machineCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "-";
  const reasonCounts: Record<string, number> = {};

filteredData.forEach((item) => {//durus  nedenlerinn sıklığını say 
  const reason = item["Duruş"];

  if (!reason) return;

  reasonCounts[reason] =
    (reasonCounts[reason] || 0) + 1;
});
const autoManualCounts: Record<string, number> = {};//otomatik ve manuel olarak filtrele

filteredData.forEach((item) => {
  const type = item["Duruş otomatik mi?"];

  if (!type) return;

  autoManualCounts[type] =
    (autoManualCounts[type] || 0) + 1;
});

const autoManualChartData = Object.entries(autoManualCounts).map(
  ([type, count]) => ({
    type,
    count,
  })
);

const mostCommonReason =// en sık görülen durus nedenini bul
  Object.entries(reasonCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "-";const currentReasonCount =
  selectedRecord
    ? reasonCounts[selectedRecord["Duruş"]] || 0
    : 0;
  const machineChartData = Object.entries(machineCounts)
  .map(([machine, count]) => ({
    machine,
    count,
  }))//en çok duran ilk 10 makineyi grafşk için hazırla
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);

  const reasonChartData = Object.entries(reasonCounts)
  .map(([reason, count]) => ({
    reason,
    count,
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);//en cok görülen ilk 8 durus nedenini grafik için hazırla
const averageDuration = totalStops > 0//ortalama durus süresini hesapla

    ? (
        Number(totalDuration) / totalStops
      ).toFixed(1)
    : "0";
    useEffect(() => {
//FİLTRELEME
  let temp = [...data];

  if (selectedMachine !== "Tümü") {
    temp = temp.filter(
      (item) => item["Makine"] === selectedMachine
    );
  }

  if (selectedStopType !== "Tümü") {
    temp = temp.filter(
      (item) =>
        item["Duruş Tipi"] === selectedStopType
    );
  }

  setFilteredData(temp);//kullanıcı dropdowndan makşne veya durus tipi seçtiğinde bu bloğa gelir
   //filtrelenemis veriyi güncelle
}, [data, selectedMachine, selectedStopType]);
//YAPAY ZEKA FONKSİYONLARI
const getAIAnalysis = (reason: string) => {// bu fonksiyon olası sebep ve çzöüm önerileri üretir

  if (reason.toUpperCase().includes("SENSÖR")) {
  return {
    causes: [
      "Sensör kirlenmiş olabilir.",
      "Kablo kopuk olabilir.",
      "PLC giriş sinyali kontrol edilmelidir."
    ],
    actions: [
      "Sensör temizlenmeli.",
      "Bağlantılar kontrol edilmeli.",
      "PLC giriş testi yapılmalıdır."
    ]
  };
}

if (reason.toUpperCase().includes("ROBOT")) {
  return {
    causes: [
      "Robot referans kaybetmiş olabilir.",
      "Servo alarmı oluşmuş olabilir."
    ],
    actions: [
      "Robot resetlenmeli.",
      "Teach Point kontrol edilmeli."
    ]
  };
}

if (reason.toUpperCase().includes("PALET")) {
  return {
    causes: [
      "Palet beslemesi durmuş olabilir.",
      "Lojistik gecikmesi yaşanmış olabilir."
    ],
    actions: [
      "Palet stoğu kontrol edilmeli.",
      "Forklift akışı gözden geçirilmeli."
    ]
  };
}

return {
  causes: [
    "Makine detaylı incelenmelidir."
  ],
  actions: [
    "Bakım geçmişi kontrol edilmelidir."
  ]
};

};
const createAIComment = (record: any) => {
  const machine = record["Makine"];
  const reason = record["Duruş"];
  const duration = Number(record["Toplam Süre(dk)"]);

  let risk =
    duration > 30
      ? "kritik"
      : duration > 10
      ? "orta"
      : "düşük";

  switch (reason) {

    case "Sensör Arızası":
      return `
${machine} makinesinde sensör arızası nedeniyle ${duration} dakikalık plansız duruş meydana gelmiştir.

Bu duruş ${risk} risk seviyesindedir.

Yapay zekâ değerlendirmesine göre sensör bağlantıları, PLC giriş sinyalleri ve mekanik hizalama kontrol edilmelidir.

Benzer arızaların tekrar etmesi durumunda sensör değişimi ve planlı bakım önerilmektedir.
`;

    case "Robot Arızası":
      return `
${machine} makinesinde robot kaynaklı ${duration} dakikalık duruş oluşmuştur.

Robot alarm geçmişi incelendiğinde benzer hatalar tekrar edebilir.

Robot referans noktaları, servo motorlar ve Teach Point ayarları kontrol edilmelidir.

Kalibrasyon işlemi sonrası test üretimi yapılması önerilir.
`;

    case "BOŞ PALET/SEPET":
      return `
${machine} makinesinde üretim, malzeme besleme yetersizliği nedeniyle durmuştur.

Yaklaşık ${duration} dakikalık üretim kaybı oluşmuştur.

Lojistik akışı, forklift operasyonları ve palet stokları kontrol edilmelidir.

Bu tip duruşların azaltılması üretim verimliliğini artıracaktır.
`;

    default:
      return `
${machine} makinesinde "${reason}" nedeniyle ${duration} dakikalık duruş oluşmuştur.

Bu olay ${risk} risk seviyesindedir.

Yapay zekâ değerlendirmesine göre operatör kayıtları, bakım geçmişi ve benzer duruş kayıtları birlikte incelenmelidir.

Tekrarlayan arızalar için kök neden analizi yapılması önerilmektedir.
`;
  }
};
;const aiComment = selectedRecord
  ? createAIComment(selectedRecord)
  : "";
  
const analysis = selectedRecord
  ? getAIAnalysis(selectedRecord["Duruş"])
  : null;
console.log(machineChartData);
console.log(filteredData.filter(item => item["Çağrı Nedeni"] !== ""));
//ARAYÜZ GÖRÜNTÜSÜ
  return (
    <div className="dashboard-container">

      <h1>⏱️ Duruş Analizi</h1>
      <div style={{ marginBottom: "25px" }}>
  <label className="upload-btn">
    📂 Excel Yükle
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFileUpload}
      hidden
    />
  </label>

  {fileName && (
    <p style={{ marginTop: "10px" }}>
      📄 {fileName}
    </p>
  )}
</div>

      {/* KPI Kartları */}

      <div className="kpi-grid">
        <div className="kpi-card">
  <span>⏱</span>

  <h2>{totalDuration} dk</h2>

  <p>Toplam Duruş Süresi</p>
</div>

<div className="kpi-card">
  <span>🚨</span>

 <h2>{totalStops}</h2>

  <p>Toplam Duruş Sayısı  </p>
</div>

<div className="kpi-card">
  <span>📈</span>

  <h2>{averageDuration} dk</h2>

  <p>Ortalama Süre</p>
</div>

<div className="kpi-card">
  <span>🏭</span>

  <h2>{mostStoppedMachine}</h2>
<p>En Çok Duran Makine</p>
</div>

<div className="kpi-card">
  <span>🔧</span>
<h2>{mostCommonReason}</h2>
<p>En Sık Çağrı Nedeni</p>
</div>

      </div>

      {/* Filtreler */}

    <div className="chart-card">

  <div className="filter-layout">

    <div className="filter-left">

      <h3>🔍 Filtreler</h3>

      <div className="filters-row">

       <div className="filter-item">

  <label>Makine</label>

  <select
    value={selectedMachine}
    onChange={(e) => setSelectedMachine(e.target.value)}
  >
    <option>Tümü</option>

    {machines.map((machine) => (
      <option key={machine} value={machine}>
        {machine}
      </option>
    ))}
  </select>

</div>

<div className="filter-item">

  <label>Duruş Tipi</label>

  <select
    value={selectedStopType}
    onChange={(e) => setSelectedStopType(e.target.value)}
  >
    <option>Tümü</option>

    {stopTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>

</div>

        <button
          className="reset-button"
          onClick={() => {
            setSelectedMachine("Tümü");
            setSelectedStopType("Tümü");
          }}
        >
          ♻ Filtreyi Temizle
        </button>

      </div>

    </div>

    <div className="filter-right">

      <h3>⚙️ Duruş Türü</h3>

      <p>🟢 Otomatik</p>
      <h2>{autoManualCounts["Otomatik"] || 0}</h2>

      <hr />

      <p>🔵 Manuel</p>
      <h2>{autoManualCounts["Manuel"] || 0}</h2>

    </div>

  </div>

</div>

      {/* Grafikler */}

    {/* Grafikler */}

<div className="charts-grid">

  <div className="chart-card">

    <h3>🏭 En Çok Duran 10 Makine</h3>

    <ResponsiveContainer width="100%" height={350}>

      <BarChart data={machineChartData}>

        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

        <XAxis
  dataKey="machine"
  interval={0}
  angle={-35}
  textAnchor="end"
  height={120}
  tick={{ fontSize: 11 }}
/>

        <YAxis stroke="#cbd5e1" />

        <Tooltip
    contentStyle={{
        background:"#14233b",
        border:"1px solid #2d4d7d",
        borderRadius:"10px",
        color:"white"
    }}
/>

        <Bar
    dataKey="count"
    fill="#38bdf8"
    radius={[8,8,0,0]}
/>

      </BarChart>

    </ResponsiveContainer>
    

  </div>
  <div className="chart-card">

  <h3>⚠ En Çok Görülen Duruş Nedenleri</h3>

 <ResponsiveContainer width="100%" height={420}>

    <BarChart data={reasonChartData} layout="vertical">

      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

      <XAxis type="number" stroke="#cbd5e1" />

 <YAxis
  dataKey="reason"
  type="category"
  width={320}
  tick={{ fontSize: 11 }}
/>

      <Tooltip />

      <Bar
        dataKey="count"
        fill="#ef4444"
        radius={[0, 8, 8, 0]}
      />

    </BarChart>

  </ResponsiveContainer>

</div>
<div className="chart-card">

<h3>⚙️ Duruş Türü Dağılımı</h3>

<ResponsiveContainer width="100%" height={260}>

<BarChart data={autoManualChartData}>

<CartesianGrid strokeDasharray="3 3" stroke="#334155"/>

<XAxis dataKey="type"/>

<YAxis/>

<Tooltip/>

<Bar
dataKey="count"
fill="#22c55e"
radius={[8,8,0,0]}
/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

      <div className="chart-card">

  <h3>📋 Son Duruş Kayıtları</h3>

  <table className="data-table">

    <thead>
      <tr>
        <th>Makine</th>
        <th>Duruş</th>
        <th>Süre (dk)</th>
        <th>Çağrı Nedeni</th>
      </tr>
    </thead>

    <tbody>

      {filteredData.slice(0,20).map((item,index)=>(

        <tr
  key={index}
  onClick={() => {
    console.log(item);
    setSelectedRecord(item);
  }}
>

          <td>{item["Makine"]}</td>

          <td>{item["Duruş"]}</td>

          <td>{item["Toplam Süre(dk)"]}</td>

          <td>{item["Duruş"]}</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

     {/* Olay İnceleme */}

<div className="chart-card">

  <h3>🧠 Duruş Olay İnceleme</h3>

  {!selectedRecord ? (

    <p style={{ opacity: 0.6 }}>
      📋 Analiz görmek için tablodan bir duruş kaydı seçin.
    </p>

  ) : (

    <div className="analysis-box">
        

      <h4>🤖 Yapay Zekâ Değerlendirmesi</h4>

      <p><strong>Makine:</strong> {selectedRecord["Makine"]}</p>

      <p><strong>Duruş:</strong> {selectedRecord["Duruş"]}</p>

   

      <p><strong>Süre:</strong> {selectedRecord["Toplam Süre(dk)"]} dk</p>
      <p>
  <strong>Risk Seviyesi:</strong>{" "}
  {Number(selectedRecord["Toplam Süre(dk)"]) > 30
    ? "🔴 Kritik"
    : Number(selectedRecord["Toplam Süre(dk)"]) > 10
    ? "🟡 Orta"
    : "🟢 Düşük"}
</p>
<hr />
<h4>📈 AI Değerlendirmesi</h4>

<div
  style={{
    background: "#0f172a",
    padding: "15px",
    borderRadius: "10px",
    borderLeft: "4px solid #38bdf8",
    whiteSpace: "pre-line",
    marginTop: "10px",
  }}
>
  {aiComment}
</div>
<hr />

<h4>📊 Geçmiş Analizi</h4>

<p>
  Bu çağrı nedeni veri setinde <strong>{currentReasonCount}</strong> kez
  tespit edilmiştir.
</p>

<p>
  {currentReasonCount > 10
    ? "⚠ Bu arıza sık tekrar ettiği için kalıcı iyileştirme çalışması önerilmektedir."
    : "✅ Bu arıza veri setinde düşük sıklıkta görülmektedir."}
</p><hr />

<p>
  <strong>Öncelik:</strong>{" "}

  {Number(selectedRecord["Toplam Süre(dk)"]) > 30
    ? "🚨 Acil Müdahale"

    : Number(selectedRecord["Toplam Süre(dk)"]) > 10
    ? "⚠ Planlı Kontrol"

    : "✅ Normal"}
</p><hr />

<h4>📊 İşletmeye Etkisi</h4>

<p>
{
Number(selectedRecord["Toplam Süre(dk)"]) > 30

? "Bu duruş üretim verimliliğini ciddi düzeyde etkileyebilir. Tekrarlaması halinde bakım planı oluşturulması önerilir."

: Number(selectedRecord["Toplam Süre(dk)"]) > 10

? "Bu duruş orta seviyede üretim kaybına neden olabilir."

: "Üretim üzerindeki etkisi düşük seviyededir."
}
</p>
      <hr />

      <h4>🔍 Olası Sebepler</h4>

      <ul>
        {analysis?.causes.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <h4>✅ Önerilen Aksiyonlar</h4>

      <ul>
        {analysis?.actions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

    </div>

  )}

</div>

    </div>
  );
}

export default DurusAnalysis;

