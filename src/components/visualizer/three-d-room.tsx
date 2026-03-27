"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Product } from "@/types";
import { getProductImage } from "@/lib/utils";

function RoomGeometry({ tile }: { tile: Product | null }) {
  const textureColor = tile ? "#d7a56d" : "#d9d1c4";
  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 6, 3]} intensity={1.3} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color={textureColor} />
      </mesh>
      <mesh position={[0, 1, -4]}><planeGeometry args={[8, 4]} /><meshStandardMaterial color="#f5ecdf" /></mesh>
      <mesh position={[-4, 1, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[8, 4]} /><meshStandardMaterial color="#ede0cc" /></mesh>
      <mesh position={[1.2, -0.3, 0.5]}><boxGeometry args={[1.6, 0.4, 1.6]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[-1.8, -0.1, 1.2]}><boxGeometry args={[1.2, 0.8, 1.2]} /><meshStandardMaterial color="#d0b28f" /></mesh>
    </>
  );
}

export default function ThreeDRoom({ tile }: { tile: Product | null }) {
  return (
    <div className="card-surface h-[480px] overflow-hidden">
      <div className="border-b border-[var(--border-soft)] px-4 py-3 text-sm text-[var(--text-secondary)]">{tile ? `Selected texture source: ${getProductImage(tile)}` : "Select a tile to influence the room floor material"}</div>
      <Canvas camera={{ position: [5, 3.5, 7], fov: 48 }}>
        <RoomGeometry tile={tile} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
