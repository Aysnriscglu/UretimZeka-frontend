import {
  
  Bot,
  Clock3,
  Factory,
  Home,
  PackageX,
  Wrench,
} from "lucide-react";

const menuItems = [
  { name: "Genel Bakış", icon: Home },
  { name: "Dijital Fabrika", icon: Factory },
  { name: "Duruş Analizi", icon: Clock3 },
  { name: "Hurda Analizi", icon: PackageX },
  { name: "Bakım", icon: Wrench },
  { name: "Yapay Zekâ", icon: Bot },
  
];

function Sidebar() {
  return (
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
              className={
                item.name === "Dijital Fabrika"
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
  );
}

export default Sidebar;