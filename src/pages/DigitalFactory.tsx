import {
  AlertTriangle,
  BarChart3,
  Clock3,
  Gauge,
} from "lucide-react";
import MachineScene from "../MachineScene";
import { useState } from "react";

const kpiItems = [
  {
    title: "Toplam Üretim",
    value: "128.450",
    unit: "adet",
    change: "%8,4 artış",
    color: "cyan",
    icon: BarChart3,
  },
  {
    title: "Toplam Duruş",
    value: "1.240",
    unit: "dk",
    change: "%3,2 azalış",
    color: "yellow",
    icon: Clock3,
  },
  {
    title: "Hurda Oranı",
    value: "%2,4",
    unit: "",
    change: "Hedef: %2,0",
    color: "green",
    icon: Gauge,
  },
  {
    title: "Kritik Makine",
    value: "1",
    unit: "makine",
    change: "Kontrol gerekli",
    color: "red",
    icon: AlertTriangle,
  },
];

function DigitalFactory() {
  const [selectedMachine, setSelectedMachine] = useState("Kalibre Presi");
  return (
    <>
      <h1>Dijital Fabrika</h1>

      <p className="live-text">
        <span className="live-light"></span>
        Canlı
        <span className="separator">•</span>
        Son güncelleme 15:42
      </p>

      <section className="kpi-grid">
        {kpiItems.map((item) => {
          const Icon = item.icon;

          return (
            <article className="kpi-card" key={item.title}>
              <div className={`kpi-icon ${item.color}`}>
                <Icon size={23} />
              </div>

              <div className="kpi-information">
                <p>{item.title}</p>

                <strong>
                  {item.value}
                  {item.unit && <small>{item.unit}</small>}
                </strong>

                <span className={item.color}>{item.change}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="factory-layout">
        <div className="factory-scene">
          <MachineScene
  selectedMachine={selectedMachine}
  setSelectedMachine={setSelectedMachine}
/>
        </div>

        <aside className="machine-panel">
          <div className="panel-header">
            <h2>Kalibre Presi</h2>
            <span className="critical-badge">KRİTİK</span>
          </div>

          <div className="risk-card">
            <span className="risk-title">Risk Puanı</span>

            <div className="risk-score">
              <span>88</span>
              <small>/100</small>
            </div>

            <div className="risk-bar">
              <div className="risk-value"></div>
            </div>
          </div>

          <div className="info-item">
            Hidrolik basınç problemi
          </div>

          <div className="info-row">
            <span>Duruş</span>
            <strong>42 dk</strong>
          </div>

          <div className="info-row">
            <span>Son bakım</span>
            <strong>8 gün önce</strong>
          </div>

          <button className="inspect-button">
            🔍 Makineyi İncele
          </button>
        </aside>
      </section>
    </>
  );
}

export default DigitalFactory;