"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { BaseRoomScene } from "../core/base-room-scene";
import { ROOM_CONFIGS } from "../core/room-config";
import type { AppliedTiles } from "../types";

type Props = {
  modelKey: keyof typeof ROOM_CONFIGS;
  tileScale: number;
  appliedTiles: AppliedTiles;
};

function FixedCamera({
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

export default function TwoDRoom({
  modelKey,
  tileScale,
  appliedTiles,
}: Props) {
  const config = ROOM_CONFIGS[modelKey];

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{
        position: config.twoDCamera.position,
        fov: config.twoDCamera.fov,
      }}
    >
      <color attach="background" args={["#ece7df"]} />

      <FixedCamera
        position={config.twoDCamera.position}
        target={config.target}
      />

      <ambientLight intensity={0.85} />
      <hemisphereLight intensity={0.9} groundColor="#d7d0c5" />
      <directionalLight
        castShadow
        intensity={1.25}
        position={[7, 9, 8]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight intensity={0.35} position={[-5, 4, 2]} />

      <Suspense fallback={null}>
        <BaseRoomScene
          modelUrl={config.modelUrl}
          config={config}
          tileScale={tileScale}
          appliedTiles={appliedTiles}
        />
      </Suspense>
    </Canvas>
  );
}