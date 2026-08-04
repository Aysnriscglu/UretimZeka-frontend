import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

type MachineStatus = "normal" | "warning" | "critical";

type Machine = {
  id: number;
  name: string;
  status: MachineStatus;
  position: [number, number, number];
};

type MachineSceneProps = {
  selectedMachine: string;
  setSelectedMachine: (machine: string) => void;
};

const machines: Machine[] = [
  {
    id: 1,
    name: "Ağız Açma Presi",
    status: "normal",
    position: [-5, 0, -1],
  },
  {
    id: 2,
    name: "Merdane Makinesi",
    status: "warning",
    position: [-3, 0, 1],
  },
  {
    id: 3,
    name: "Alın Kaynak Makinesi",
    status: "normal",
    position: [-1, 0, -1],
  },
  {
    id: 4,
    name: "Kalibre Presi",
    status: "critical",
    position: [1.5, 0, 0.5],
  },
  {
    id: 5,
    name: "Role 2",
    status: "warning",
    position: [4, 0, -1],
  },
  {
    id: 6,
    name: "Kaynak Hattı",
    status: "normal",
    position: [6, 0, 1],
  },
];

const statusColors: Record<MachineStatus, string> = {
  normal: "#32d583",
  warning: "#f5b942",
  critical: "#ff5d66",
};

type MachineModelProps = {
  machine: Machine;
  onClick: (machine: Machine) => void;
};

function MachineModel({ machine, onClick }: MachineModelProps) {
  const color = statusColors[machine.status];

  return (
    <group position={machine.position}>
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[2.1, 0.3, 2.1]} />
        <meshStandardMaterial color="#142338" />
      </mesh>

      <mesh
        position={[0, 1, 0]}
        castShadow
        onClick={() => onClick(machine)}
      >
        <boxGeometry args={[1.4, 1.7, 1.25]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.55, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>

      <pointLight
        position={[0, 2.6, 0]}
        color={color}
        intensity={2}
        distance={4}
      />
    </group>
  );
}

function MachineScene({
  selectedMachine,
  setSelectedMachine,
}: MachineSceneProps) {
  return (
    <Canvas shadows>
      <color attach="background" args={["#07111f"]} />

      <PerspectiveCamera
        makeDefault
        position={[10, 10, 15]}
        fov={42}
      />

      <ambientLight intensity={1.2} />

      <directionalLight
        position={[4, 10, 4]}
        intensity={2.5}
        castShadow
      />

      <Grid
        position={[0, 0.01, 0]}
        args={[30, 22]}
        cellSize={1}
        cellColor="#1b334b"
        sectionColor="#235276"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[35, 25]} />
        <meshStandardMaterial color="#0d1c2e" />
      </mesh>

      {machines.map((machine) => (
        <MachineModel
          key={machine.id}
          machine={machine}
          onClick={(machine) => setSelectedMachine(machine.name)}
        />
      ))}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.5}
        scale={28}
        blur={2}
      />

      <OrbitControls
        target={[0.5, 0.8, 0]}
        minDistance={10}
        maxDistance={24}
      />
    </Canvas>
  );
}

export default MachineScene;