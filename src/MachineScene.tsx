import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  Html,
  Line,
} from "@react-three/drei";
import * as THREE from "three";

type MachineStatus = "normal" | "warning" | "critical";

type Machine = {
  id: number;
  name: string;
  status: MachineStatus;
  position: [number, number, number];
  baseColor: string;
};

type MachineSceneProps = {
  selectedMachine: string;
  setSelectedMachine: (machine: string) => void;
};

type MachineModelProps = {
  machine: Machine;
  isSelected: boolean;
  onClick: (machine: Machine) => void;
};

// Makinelere endustriyel cesitlilik katmak icin ozel boya renkleri eklendi
const spacing = 5.0;
const machines: Machine[] = [
  { id: 1, name: "Marka", status: "normal", position: [-spacing * 5.5, 0, 0], baseColor: "#3b82f6" },       // Mavi
  { id: 2, name: "Merdane", status: "normal", position: [-spacing * 4.5, 0, 0], baseColor: "#64748b" },     // Gri/Metal
  { id: 3, name: "Alınkaynak", status: "warning", position: [-spacing * 3.5, 0, 0], baseColor: "#f97316" }, // Turuncu (Robotik)
  { id: 4, name: "Ağız Açma", status: "normal", position: [-spacing * 2.5, 0, 0], baseColor: "#14b8a6" },   // Cam Gobegi
  { id: 5, name: "Role 1", status: "warning", position: [-spacing * 1.5, 0, 0], baseColor: "#eab308" },     // Endustriyel Sari
  { id: 6, name: "Role 2", status: "normal", position: [-spacing * 0.5, 0, 0], baseColor: "#eab308" },      // Endustriyel Sari
  { id: 7, name: "Role 3", status: "normal", position: [spacing * 0.5, 0, 0], baseColor: "#eab308" },       // Endustriyel Sari
  { id: 8, name: "Kalibre Presi", status: "critical", position: [spacing * 1.5, 0, 0], baseColor: "#6366f1" }, // Indigo
  { id: 9, name: "Radüs Torna", status: "normal", position: [spacing * 2.5, 0, 0], baseColor: "#0ea5e9" },  // Acik Mavi
  { id: 10, name: "Subap Delme", status: "warning", position: [spacing * 3.5, 0, 0], baseColor: "#10b981" },// Zumrut Yesili
  { id: 11, name: "Montaj Presi", status: "normal", position: [spacing * 4.5, 0, 0], baseColor: "#84cc16" }, // Limon Yesili
  { id: 12, name: "Ütü Presi", status: "critical", position: [spacing * 5.5, 0, 0], baseColor: "#f43f5e" },  // Endustriyel Kirmizi
];

// Durum (Hata/Uyarı) Renkleri (Sadece lambalar, zemin ve paneller icin kullanilacak)
const statusColors: Record<MachineStatus, string> = {
  normal: "#10b981", // Yesil
  warning: "#f59e0b", // Sari
  critical: "#ef4444", // Kirmizi
};

function MachineModel({ machine, onClick, isSelected }: MachineModelProps) {
  const statusColor = statusColors[machine.status];
  const isCritical = machine.status === "critical";
  const s = isCritical ? 1.15 : 1.0; 
  
  const bodyMat = { color: "#334155", roughness: 0.5, metalness: 0.7 };
  const darkMetal = { color: "#1e293b", roughness: 0.6, metalness: 0.8 };
  const paintMat = { color: machine.baseColor, roughness: 0.3, metalness: 0.5 };

  return (
    <group
      position={machine.position}
      scale={[s, s, s]}
      onClick={(e) => { e.stopPropagation(); onClick(machine); }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "default")}
    >
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow><boxGeometry args={[4.4, 0.8, 3.4]} /><meshStandardMaterial {...darkMetal} /></mesh>
      <mesh position={[0, 0.81, 1.5]} receiveShadow><boxGeometry args={[4.4, 0.05, 0.4]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[-1.4, 2.5, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 3.4, 2.8]} /><meshStandardMaterial {...bodyMat} /></mesh>
      <mesh position={[-2.01, 2.5, 0]} castShadow><boxGeometry args={[0.05, 2.0, 1.5]} /><meshStandardMaterial color="#0f172a" /></mesh>
      <mesh position={[1.4, 2.5, 0]} castShadow receiveShadow><boxGeometry args={[1.2, 3.4, 2.8]} /><meshStandardMaterial {...bodyMat} /></mesh>
      <mesh position={[2.01, 2.5, 0]} castShadow><boxGeometry args={[0.05, 2.0, 1.5]} /><meshStandardMaterial color="#0f172a" /></mesh>
      
      <mesh position={[0, 4.6, 0]} castShadow receiveShadow><boxGeometry args={[4.0, 1.2, 3.0]} /><meshStandardMaterial {...paintMat} /></mesh>
      
      <mesh position={[0, 5.5, 0]} castShadow receiveShadow><cylinderGeometry args={[0.8, 0.8, 0.6, 32]} /><meshStandardMaterial {...darkMetal} /></mesh>
      <mesh position={[0, 5.8, 0]} castShadow><boxGeometry args={[1.0, 0.2, 1.0]} /><meshStandardMaterial color="#0f172a" /></mesh>

      <group position={[0, 2.8, 0]}>
         <mesh position={[0, 1.0, 0]} castShadow><cylinderGeometry args={[0.2, 0.2, 1.5, 16]} /><meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} /></mesh>
         <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[1.8, 0.8, 2.0]} /><meshStandardMaterial {...darkMetal} /></mesh>
         <mesh position={[0, -1.6, 0]} castShadow><boxGeometry args={[2.0, 1.6, 2.2]} /><meshStandardMaterial {...darkMetal} /></mesh>
      </group>

      <group position={[1.4, 2.0, 1.5]}>
         <mesh position={[-0.4, 0, 0.2]} castShadow><boxGeometry args={[0.8, 0.2, 0.2]} /><meshStandardMaterial {...bodyMat} /></mesh>
         <mesh position={[0, 0, 0.4]} rotation={[0.2, -0.2, 0]} castShadow><boxGeometry args={[1.2, 0.8, 0.4]} /><meshStandardMaterial color="#1e293b" /></mesh>
         <mesh position={[-0.1, 0.1, 0.62]} rotation={[0.2, -0.2, 0]}><planeGeometry args={[0.6, 0.4]} /><meshBasicMaterial color={statusColor} /></mesh>
         <group position={[0.35, 0.2, 0.58]} rotation={[0.2, -0.2, 0]}><mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.1, 16]} /><meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} /></mesh></group>
         <group position={[0.35, 0.0, 0.58]} rotation={[0.2, -0.2, 0]}><mesh rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.1, 16]} /><meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1} /></mesh></group>
      </group>

      <group position={[0, 6.0, 0]}>
         <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.1, 0.1, 0.3, 16]} /><meshStandardMaterial color="#475569" /></mesh>
         <mesh position={[0, 0.35, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={5} /></mesh>
         <pointLight position={[0, 0.5, 0]} color={statusColor} intensity={2.5} distance={10} />
      </group>

      <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh><planeGeometry args={[6.8, 6.8]} /><meshBasicMaterial color={statusColor} transparent opacity={0.15} depthWrite={false} /></mesh>
        <Line points={[[-3.4, -3.4, 0], [3.4, -3.4, 0], [3.4, 3.4, 0], [-3.4, 3.4, 0], [-3.4, -3.4, 0]]} color={statusColor} lineWidth={2.5} />
      </group>
      
      <Html position={[0, 7.5, 0]} center zIndexRange={[100, 0]}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${1/s})` }}>
          {isSelected && (
            <div style={{ background: statusColor, color: "#fff", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", marginBottom: "4px", whiteSpace: "nowrap", boxShadow: `0 4px 15px rgba(0,0,0,0.8)`, border: "2px solid rgba(255,255,255,0.4)" }}>
              {machine.name}
            </div>
          )}
          {isSelected && <div style={{ width: 2, height: 16, background: statusColor, marginBottom: 4 }} />}
          <div style={{ width: "32px", height: "32px", background: "rgba(10, 15, 20, 0.9)", border: `2px solid ${statusColor}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: "bold", boxShadow: `0 0 15px ${statusColor}` }}>
            {machine.id}
          </div>
        </div>
      </Html>
    </group>
  );
}

function ConveyorBelt() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow><boxGeometry args={[100, 0.8, 1.4]} /><meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.5} /></mesh>
      <mesh position={[0, 0.81, 0]} receiveShadow><boxGeometry args={[100, 0.05, 1.2]} /><meshStandardMaterial color="#0f172a" roughness={0.9} /></mesh>
      {[-45, -35, -25, -15, -5, 5, 15, 25, 35, 45].map((x) => (
         <mesh key={x} position={[x, 1.0, 0]} castShadow>
            <boxGeometry args={[1.2, 0.3, 1.0]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
         </mesh>
      ))}
    </group>
  );
}

function FactoryEnvironment() {
  return (
    <group>
       <mesh position={[0, 0.01, -7.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 0.1]} /><meshBasicMaterial color="#eab308" /></mesh>
       <mesh position={[0, 0.01, 8.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[100, 0.1]} /><meshBasicMaterial color="#eab308" /></mesh>
       <mesh position={[-50, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.1, 16]} /><meshBasicMaterial color="#eab308" /></mesh>
       <mesh position={[50, 0.01, 0.5]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.1, 16]} /><meshBasicMaterial color="#eab308" /></mesh>

       <group position={[0, 0, -14]}>
          <mesh position={[0, 10, -2]} receiveShadow castShadow><boxGeometry args={[120, 20, 2]} /><meshStandardMaterial color="#0f172a" roughness={1.0} /></mesh>
          {[-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50].map(x => (
             <mesh key={x} position={[x, 10, -0.5]} castShadow><boxGeometry args={[1.5, 20, 1.5]} /><meshStandardMaterial color="#1e293b" roughness={0.9} /></mesh>
          ))}
          <mesh position={[0, 18, 0.5]} castShadow><boxGeometry args={[110, 1.5, 1.5]} /><meshStandardMaterial color="#334155" metalness={0.4} /></mesh>
          <mesh position={[0, 16, 0.2]} rotation={[0, 0, Math.PI / 2]} castShadow><cylinderGeometry args={[0.4, 0.4, 110, 16]} /><meshStandardMaterial color="#94a3b8" metalness={0.8} /></mesh>
          <mesh position={[0, 8, 1]} castShadow receiveShadow><boxGeometry args={[110, 0.5, 3]} /><meshStandardMaterial color="#1e293b" /></mesh>
          <mesh position={[0, 9, 2.4]}><boxGeometry args={[110, 0.1, 0.1]} /><meshStandardMaterial color="#ca8a04" /></mesh>
          <mesh position={[0, 8.5, 2.4]}><boxGeometry args={[110, 0.05, 0.05]} /><meshStandardMaterial color="#475569" /></mesh>
          {Array.from({length: 55}).map((_, i) => (
             <mesh key={i} position={[-54 + i*2, 8.5, 2.4]}><boxGeometry args={[0.05, 1.0, 0.05]} /><meshStandardMaterial color="#475569" /></mesh>
          ))}
          <mesh position={[-35, 4, 0]} castShadow><boxGeometry args={[3, 5, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
          <mesh position={[35, 4, 0]} castShadow><boxGeometry args={[3, 5, 1.5]} /><meshStandardMaterial color="#334155" /></mesh>
       </group>

       <group position={[0, 22, -2]}>
          <mesh castShadow><boxGeometry args={[70, 1.0, 1.0]} /><meshStandardMaterial color="#eab308" metalness={0.3} /></mesh>
          <mesh position={[10, -1, 0]} castShadow><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#1e293b" /></mesh>
          <mesh position={[10, -3, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 3]} /><meshStandardMaterial color="#000000" /></mesh>
       </group>

       <group position={[0, 0, 12]}>
         <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[100, 0.08, 0.05]} /><meshStandardMaterial color="#ca8a04"/></mesh>
         <mesh position={[0, 1.2, 0]} castShadow><boxGeometry args={[100, 0.08, 0.05]} /><meshStandardMaterial color="#ca8a04"/></mesh>
         {Array.from({length: 50}).map((_, i) => (
            <mesh key={i} position={[-49 + i*2, 0.6, 0]} castShadow><boxGeometry args={[0.1, 1.2, 0.1]} /><meshStandardMaterial color="#475569" /></mesh>
         ))}
       </group>
    </group>
  );
}

function MachineScene({
  selectedMachine,
  setSelectedMachine,
}: MachineSceneProps) {
  return (
    <Canvas shadows orthographic camera={{ position: [35, 40, 35], zoom: 11, up: [0, 1, 0] }}>
      <color attach="background" args={["#0a0f18"]} />
      
      <ambientLight intensity={1.2} color="#94a3b8" />
      <directionalLight position={[-20, 50, 20]} intensity={2.8} color="#ffffff" castShadow shadow-mapSize={[4096, 4096]} shadow-bias={-0.0001} />
      <directionalLight position={[40, 20, -20]} intensity={1.5} color="#60a5fa" />
      <directionalLight position={[0, 10, 40]} intensity={0.8} color="#e2e8f0" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0b111a" roughness={0.3} metalness={0.7} />
      </mesh>

      <FactoryEnvironment />
      <ConveyorBelt />

      {machines.map((machine) => (
        <MachineModel
          key={machine.id}
          machine={machine}
          isSelected={selectedMachine === machine.name}
          onClick={(machine) => setSelectedMachine(machine.name)}
        />
      ))}

      <ContactShadows position={[0, 0.02, 0]} opacity={0.9} scale={120} blur={2} far={6} color="#000000" />

      <OrbitControls target={[0, 2, 0]} minZoom={5} maxZoom={50} maxPolarAngle={Math.PI / 2 - 0.15} enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}

export default MachineScene;
