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
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/opex-logo.png" alt="OPEX Jantsa" style={{ width: '100%', maxWidth: '200px', height: 'auto' }} />
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
        
        <button 
          onClick={() => {
            localStorage.removeItem("isAuthenticated");
            navigate("/login");
          }}
          className="menu-item"
          style={{ marginTop: 'auto', marginBottom: '20px', color: '#ef4444' }}
        >
          <LogOut size={21} />
          <span>Çıkış Yap</span>
        </button>
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