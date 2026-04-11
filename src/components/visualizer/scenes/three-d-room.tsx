"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BaseRoomScene } from "../core/base-room-scene";
import { ROOM_CONFIGS } from "../core/room-config";
import type { AppliedTiles, SurfaceMaterialSettings } from "../types";

type Props = {
  modelKey: keyof typeof ROOM_CONFIGS;
  materialSettings: SurfaceMaterialSettings;
  appliedTiles: AppliedTiles;
};

function CameraSetup({
  position,
  target,
}: {
  position: [number, number, number];
  target: [number, number, number];
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, position, target]);

  return null;
}

export default function ThreeDRoom({
  modelKey,
  materialSettings,
  appliedTiles,
}: Props) {
  const config = ROOM_CONFIGS[modelKey];

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{
        position: config.threeDCamera.position,
        fov: config.threeDCamera.fov,
      }}
    >
      <color attach="background" args={["#ece7df"]} />

      <CameraSetup
        position={config.threeDCamera.position}
        target={config.target}
      />

      <ambientLight intensity={0.82} />
      <hemisphereLight intensity={0.95} groundColor="#d8d0c4" />
      <directionalLight
        castShadow
        intensity={1.3}
        position={[8, 10, 8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight intensity={0.36} position={[-5, 4, 2]} />

      <Suspense fallback={null}>
        <BaseRoomScene
          modelUrl={config.modelUrl}
          config={config}
          materialSettings={materialSettings}
          appliedTiles={appliedTiles}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        target={config.target}
        minDistance={config.controls.minDistance}
        maxDistance={config.controls.maxDistance}
        minPolarAngle={config.controls.minPolarAngle ?? 0.72}
        maxPolarAngle={config.controls.maxPolarAngle ?? 1.42}
      />
    </Canvas>
  );
}