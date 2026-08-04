
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Clock3,
  Factory,
  Gauge,
  Home,
  PackageX,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import ScrapAnalysis from "./pages/ScrapAnalysis";
import DurusAnalysis from "./pages/DurusAnalysis";
import Maintenance from "./pages/Maintenance";
import OpexDashboard from "./pages/OpexDashboard";


import "./App.css";

import DigitalFactory from "./pages/DigitalFactory";
import AI from "./pages/AI";

const menuItems = [
  { name: "Opex", icon: Home },
  { name: "Dijital Fabrika", icon: Factory },
  { name: "Duruş Analizi", icon: Clock3 },
  { name: "Hurda Analizi", icon: PackageX },
  { name: "Bakım", icon: Wrench },
  { name: "Yapay Zekâ", icon: Bot },

];

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

function App() {
  const [activePage, setActivePage] = useState("Opex");
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          Üretim<span>Zekâ</span>
        </div>

        <nav className="menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
  key={item.name}
  onClick={() => setActivePage(item.name)}
  className={
    activePage === item.name
      ? "menu-item active"
      : "menu-item"
  }
>
                <Icon size={21} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="system-status">
          <div className="status-light"></div>

          <div>
            <p>Sistem Durumu</p>
            <span>Tüm sistemler çalışıyor</span>
          </div>
        </div>
      </aside>
<main className="main-content">
  {activePage === "Opex" && <OpexDashboard />}
 
  {activePage === "Dijital Fabrika" && <DigitalFactory />}

  {activePage === "Yapay Zekâ" && <AI />}
  {activePage === "Hurda Analizi" && <ScrapAnalysis />}
  {activePage === "Duruş Analizi" && <DurusAnalysis />}
  {activePage === "Bakım" && <Maintenance />}
  
 


    
</main>
    </div>
  );
}

export default App;