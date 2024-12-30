import "./App.css";
import { Canvas } from "@react-three/fiber";
import { useState, useMemo } from "react";
import * as THREE from "three";

function DottedSphere({ rotation, position }: { rotation: [number, number, number]; position: [number, number, number] }) {
  // יצירת טקסטורה דינמית
  const texture = useMemo(() => {
    const size = 512; // גודל הקנבס
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "hotpink"; // צבע רקע ורוד
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = "black"; // צבע הנקודות
    const dotSize = 10; // גודל הנקודה
    for (let x = 0; x < size; x += 50) {
      for (let y = 0; y < size; y += 50) {
        ctx.beginPath();
        ctx.arc(x, y, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh rotation={rotation} position={position} scale={[2, 2, 2]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function App() {
  // ניהול המצב של סיבוב ומיקום
  const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  // מאזין לתנועת העכבר
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // חישוב ערכי הסיבוב
    const xRotation = (clientY / height) * Math.PI * 2; // סיבוב לפי Y
    const yRotation = (clientX / width) * Math.PI * 2; // סיבוב לפי X

    // חישוב ערכי המיקום
    const xPosition = (clientX / width) * 4 - 2; // טווח: [-2, 2]
    const yPosition = -(clientY / height) * 4 + 2; // טווח: [-2, 2]

    setRotation([xRotation, yRotation, 0]); // עדכון הסיבוב
    setPosition([xPosition, yPosition, 0]); // עדכון המיקום
  };

  return (
    <div
      style={{ width: "100vw", height: "100vh" }}
      onMouseMove={handleMouseMove} // מאזין לתנועת העכבר
    >
      <Canvas fallback={<div>Sorry, WebGL is not supported!</div>}>
        <ambientLight intensity={1} />
        <DottedSphere rotation={rotation} position={position} />
      </Canvas>
    </div>
  );
}

export default App;
