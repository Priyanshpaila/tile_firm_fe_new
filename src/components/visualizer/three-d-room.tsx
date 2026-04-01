"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AccumulativeShadows,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  PMREMGenerator,
  RepeatWrapping,
  SRGBColorSpace,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { resolveAssetUrl } from "./utils";

type ThreeDRoomProps = {
  sceneId: "living" | "bathroom" | "kitchen";
  tileUrl?: string;
  surfaceType: "floor" | "wall" | "ceiling";
};

type Vec3 = [number, number, number];
type RepeatUV = [number, number];

const ROOM = {
  width: 8.8,
  depth: 8.1,
  height: 3.24,
};

const FALLBACK_TEXTURE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#e7dccd"/>
  <g stroke="#cab9a5" stroke-width="4">
    <path d="M0 0H256V256H0Z" fill="none"/>
    <path d="M128 0V256"/>
    <path d="M0 128H256"/>
  </g>
  <g opacity="0.1">
    <circle cx="40" cy="32" r="12" fill="#fff"/>
    <circle cx="200" cy="64" r="16" fill="#000"/>
    <circle cx="110" cy="190" r="14" fill="#fff"/>
    <circle cx="214" cy="214" r="10" fill="#000"/>
  </g>
</svg>
`)}`;

function RendererSetup() {
  const { gl, scene } = useThree();

  useEffect(() => {
    gl.outputColorSpace = SRGBColorSpace;
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.02;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = PCFSoftShadowMap;

    const prevEnvironment = scene.environment;

    const envScene = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(gl);
    const envRT = pmremGenerator.fromScene(envScene, 0.04, 0.1, 60);

    scene.environment = envRT.texture;

    return () => {
      scene.environment = prevEnvironment;
      envRT.dispose();
      pmremGenerator.dispose();
      envScene.dispose();
    };
  }, [gl, scene]);

  return null;
}

function usePreparedTexture(url?: string, repeat: RepeatUV = [4, 4]) {
  const { gl } = useThree();
  const resolved = useMemo(() => resolveAssetUrl(url), [url]);
  const texture = useTexture(resolved || FALLBACK_TEXTURE);

  useEffect(() => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = Math.min(12, gl.capabilities.getMaxAnisotropy());
    texture.needsUpdate = true;
  }, [gl, repeat, texture]);

  return {
    texture,
    hasRealTexture: Boolean(resolved),
  };
}

function TileMaterial({
  tileUrl,
  repeat,
  fallbackColor,
  polished = false,
  bumpScale = 0.025,
}: {
  tileUrl?: string;
  repeat: RepeatUV;
  fallbackColor: string;
  polished?: boolean;
  bumpScale?: number;
}) {
  const { texture, hasRealTexture } = usePreparedTexture(tileUrl, repeat);

  return polished ? (
    <meshPhysicalMaterial
      map={texture}
      bumpMap={texture}
      bumpScale={hasRealTexture ? bumpScale : 0.012}
      color={hasRealTexture ? "#ffffff" : fallbackColor}
      roughness={0.22}
      metalness={0.02}
      clearcoat={0.72}
      clearcoatRoughness={0.18}
      reflectivity={0.28}
    />
  ) : (
    <meshStandardMaterial
      map={texture}
      bumpMap={texture}
      bumpScale={hasRealTexture ? bumpScale : 0.01}
      color={hasRealTexture ? "#ffffff" : fallbackColor}
      roughness={0.58}
      metalness={0.03}
    />
  );
}

function PlainSurface({
  color,
  roughness = 0.95,
  metalness = 0.02,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
}) {
  return (
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  );
}

function Shell({
  tileUrl,
  surfaceType,
  sceneId,
}: {
  tileUrl?: string;
  surfaceType: ThreeDRoomProps["surfaceType"];
  sceneId: ThreeDRoomProps["sceneId"];
}) {
  const backZ = -ROOM.depth / 2;
  const sideX = ROOM.width / 2;

  const repeats = {
    living: {
      floor: [6, 6] as RepeatUV,
      wall: [5, 3] as RepeatUV,
      ceiling: [4, 4] as RepeatUV,
    },
    bathroom: {
      floor: [8, 8] as RepeatUV,
      wall: [7, 4] as RepeatUV,
      ceiling: [5, 5] as RepeatUV,
    },
    kitchen: {
      floor: [6, 6] as RepeatUV,
      wall: [8, 4] as RepeatUV,
      ceiling: [4, 4] as RepeatUV,
    },
  }[sceneId];

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        {surfaceType === "floor" ? (
          <TileMaterial
            tileUrl={tileUrl}
            repeat={repeats.floor}
            fallbackColor="#d7c4ad"
            polished={sceneId !== "bathroom"}
            bumpScale={0.03}
          />
        ) : (
          <PlainSurface color="#d6cab9" roughness={0.96} />
        )}
      </mesh>

      <mesh receiveShadow position={[0, ROOM.height / 2, backZ]}>
        <planeGeometry args={[ROOM.width, ROOM.height]} />
        {surfaceType === "wall" ? (
          <TileMaterial
            tileUrl={tileUrl}
            repeat={repeats.wall}
            fallbackColor="#efe7dc"
            bumpScale={0.018}
          />
        ) : (
          <PlainSurface color="#f1e9de" roughness={0.98} />
        )}
      </mesh>

      <mesh
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        position={[-sideX, ROOM.height / 2, 0]}
      >
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        {surfaceType === "wall" ? (
          <TileMaterial
            tileUrl={tileUrl}
            repeat={repeats.wall}
            fallbackColor="#eee4d7"
            bumpScale={0.018}
          />
        ) : (
          <PlainSurface color="#ede3d5" roughness={0.98} />
        )}
      </mesh>

      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        position={[sideX, ROOM.height / 2, 0]}
      >
        <planeGeometry args={[ROOM.depth, ROOM.height]} />
        {surfaceType === "wall" ? (
          <TileMaterial
            tileUrl={tileUrl}
            repeat={repeats.wall}
            fallbackColor="#ece0d2"
            bumpScale={0.018}
          />
        ) : (
          <PlainSurface color="#ece1d3" roughness={0.98} />
        )}
      </mesh>

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
        position={[0, ROOM.height, 0]}
      >
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        {surfaceType === "ceiling" ? (
          <TileMaterial
            tileUrl={tileUrl}
            repeat={repeats.ceiling}
            fallbackColor="#efe7db"
            bumpScale={0.01}
          />
        ) : (
          <PlainSurface color="#efe8dc" roughness={0.99} />
        )}
      </mesh>
    </>
  );
}

function Baseboards() {
  const z = -ROOM.depth / 2 + 0.03;
  const x = ROOM.width / 2 - 0.03;

  return (
    <>
      <mesh castShadow receiveShadow position={[0, 0.08, z]}>
        <boxGeometry args={[ROOM.width, 0.16, 0.06]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.92} />
      </mesh>
      <mesh castShadow receiveShadow position={[-x, 0.08, 0]}>
        <boxGeometry args={[0.06, 0.16, ROOM.depth]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.92} />
      </mesh>
      <mesh castShadow receiveShadow position={[x, 0.08, 0]}>
        <boxGeometry args={[0.06, 0.16, ROOM.depth]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.92} />
      </mesh>
    </>
  );
}

function CrownMolding() {
  const z = -ROOM.depth / 2 + 0.035;
  const x = ROOM.width / 2 - 0.035;

  return (
    <>
      <mesh castShadow receiveShadow position={[0, ROOM.height - 0.07, z]}>
        <boxGeometry args={[ROOM.width, 0.14, 0.07]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[-x, ROOM.height - 0.07, 0]}>
        <boxGeometry args={[0.07, 0.14, ROOM.depth]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
      <mesh castShadow receiveShadow position={[x, ROOM.height - 0.07, 0]}>
        <boxGeometry args={[0.07, 0.14, ROOM.depth]} />
        <meshStandardMaterial color="#f7f2ea" roughness={0.9} />
      </mesh>
    </>
  );
}

function CeilingDownlights({ sceneId }: { sceneId: ThreeDRoomProps["sceneId"] }) {
  const positions =
    sceneId === "bathroom"
      ? ([
          [-1.8, ROOM.height - 0.06, -0.8],
          [1.2, ROOM.height - 0.06, -0.8],
          [0.0, ROOM.height - 0.06, 1.4],
        ] as Vec3[])
      : sceneId === "kitchen"
      ? ([
          [-2.2, ROOM.height - 0.06, 0.4],
          [0.0, ROOM.height - 0.06, 0.4],
          [2.2, ROOM.height - 0.06, 0.4],
        ] as Vec3[])
      : ([
          [-2.2, ROOM.height - 0.06, 0.8],
          [0.0, ROOM.height - 0.06, 0.6],
          [2.2, ROOM.height - 0.06, 0.8],
        ] as Vec3[]);

  return (
    <>
      {positions.map((pos, index) => (
        <group key={index} position={pos}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.06, 24]} />
            <meshStandardMaterial color="#faf8f2" roughness={0.4} />
          </mesh>
          <pointLight
            position={[0, -0.18, 0]}
            intensity={sceneId === "bathroom" ? 0.38 : 0.32}
            distance={6}
            color="#fff6ea"
          />
        </group>
      ))}
    </>
  );
}

function LivingWindow() {
  const wallZ = -ROOM.depth / 2 + 0.012;

  return (
    <>
      <mesh position={[1.7, 1.95, wallZ + 0.018]} receiveShadow>
        <planeGeometry args={[2.55, 1.45]} />
        <meshPhysicalMaterial
          color="#d8ebf7"
          transparent
          opacity={0.22}
          transmission={0.65}
          roughness={0.08}
          metalness={0}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[1.7, 1.95, wallZ + 0.006]}>
        <boxGeometry args={[2.72, 1.62, 0.03]} />
        <meshStandardMaterial color="#fbf8f2" roughness={0.88} />
      </mesh>

      <mesh castShadow receiveShadow position={[0.26, 1.95, wallZ + 0.024]}>
        <boxGeometry args={[0.1, 1.62, 0.04]} />
        <meshStandardMaterial color="#e6d8c7" roughness={0.84} />
      </mesh>

      <mesh castShadow receiveShadow position={[3.14, 1.95, wallZ + 0.024]}>
        <boxGeometry args={[0.1, 1.62, 0.04]} />
        <meshStandardMaterial color="#e6d8c7" roughness={0.84} />
      </mesh>

      <mesh castShadow receiveShadow position={[1.7, 2.73, wallZ + 0.03]}>
        <boxGeometry args={[2.95, 0.13, 0.08]} />
        <meshStandardMaterial color="#d8c5ae" roughness={0.74} />
      </mesh>

      <mesh castShadow receiveShadow position={[0.3, 1.88, wallZ + 0.04]}>
        <boxGeometry args={[0.12, 1.8, 0.03]} />
        <meshStandardMaterial color="#cfc2b6" roughness={0.96} />
      </mesh>

      <mesh castShadow receiveShadow position={[3.1, 1.88, wallZ + 0.04]}>
        <boxGeometry args={[0.12, 1.8, 0.03]} />
        <meshStandardMaterial color="#cfc2b6" roughness={0.96} />
      </mesh>
    </>
  );
}

function LivingSet() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.25, 0.015, 0.95]} receiveShadow>
        <planeGeometry args={[4.1, 2.85]} />
        <meshStandardMaterial color="#d6c4ae" roughness={1} />
      </mesh>

      <RoundedBox
        args={[3.5, 0.54, 1.02]}
        radius={0.08}
        smoothness={4}
        position={[0.15, 0.29, 2.35]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#cdb598" roughness={0.98} />
      </RoundedBox>

      <RoundedBox
        args={[1.28, 0.54, 1.92]}
        radius={0.08}
        smoothness={4}
        position={[-1.12, 0.29, 1.9]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#ccb395" roughness={0.98} />
      </RoundedBox>

      {[
        [0.15, 0.56, 2.38, 3.2, 0.18, 0.26],
        [-1.46, 0.72, 1.92, 0.22, 0.5, 1.72],
        [1.72, 0.72, 2.38, 0.22, 0.5, 0.96],
      ].map((item, idx) => (
        <RoundedBox
          key={idx}
          args={[item[3], item[4], item[5]]}
          radius={0.05}
          smoothness={4}
          position={[item[0], item[1], item[2]]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#b59678" roughness={0.98} />
        </RoundedBox>
      ))}

      {[
        [-0.9, 0.63, 2.25],
        [0.0, 0.63, 2.25],
        [0.95, 0.63, 2.25],
        [-1.1, 0.63, 1.4],
      ].map((pos, idx) => (
        <RoundedBox
          key={idx}
          args={[0.8, 0.12, 0.56]}
          radius={0.04}
          smoothness={4}
          position={pos as Vec3}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#d8c0a2" roughness={0.9} />
        </RoundedBox>
      ))}

      {[
        [-0.58, 0.86, 2.18],
        [0.45, 0.87, 2.16],
        [-1.15, 0.86, 1.48],
      ].map((pos, idx) => (
        <RoundedBox
          key={idx}
          args={[0.46, 0.24, 0.16]}
          radius={0.05}
          smoothness={4}
          position={pos as Vec3}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={idx === 1 ? "#efe8df" : "#b59273"} roughness={0.96} />
        </RoundedBox>
      ))}

      <RoundedBox
        args={[1.2, 0.1, 0.62]}
        radius={0.05}
        smoothness={4}
        position={[0.28, 0.34, 0.44]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f4ece1" roughness={0.26} metalness={0.03} />
      </RoundedBox>

      {[
        [-0.18, 0.18, 0.21],
        [0.74, 0.18, 0.21],
        [-0.18, 0.18, 0.67],
        [0.74, 0.18, 0.67],
      ].map((pos, idx) => (
        <mesh key={idx} castShadow receiveShadow position={pos as Vec3}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 16]} />
          <meshStandardMaterial color="#7d6753" roughness={0.75} />
        </mesh>
      ))}

      <RoundedBox
        args={[1.7, 0.46, 0.42]}
        radius={0.04}
        smoothness={4}
        position={[2.85, 0.23, -2.95]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#b99e81" roughness={0.96} />
      </RoundedBox>

      <mesh castShadow receiveShadow position={[2.85, 0.73, -2.94]}>
        <boxGeometry args={[1.26, 0.05, 0.04]} />
        <meshStandardMaterial color="#f5f0e8" roughness={0.24} />
      </mesh>

      <mesh castShadow receiveShadow position={[2.7, 0.28, -0.95]}>
        <cylinderGeometry args={[0.34, 0.38, 0.56, 24]} />
        <meshStandardMaterial color="#dbcbb7" roughness={0.94} />
      </mesh>
      <mesh castShadow receiveShadow position={[2.7, 0.95, -0.95]}>
        <cylinderGeometry args={[0.045, 0.045, 0.74, 16]} />
        <meshStandardMaterial color="#d8c4a9" roughness={0.7} />
      </mesh>
      <mesh castShadow receiveShadow position={[2.7, 1.57, -0.95]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#8c9a7d" roughness={1} />
      </mesh>

      <mesh castShadow receiveShadow position={[-3.3, 1.28, -3.95]}>
        <boxGeometry args={[1.4, 0.9, 0.02]} />
        <meshStandardMaterial color="#1d1d1e" roughness={0.45} />
      </mesh>
    </>
  );
}

function BathroomSet() {
  const wallZ = -ROOM.depth / 2 + 0.012;

  return (
    <>
      <RoundedBox
        args={[2.34, 0.92, 0.62]}
        radius={0.05}
        smoothness={4}
        position={[2.18, 0.46, 1.48]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#e4ddd2" roughness={0.96} />
      </RoundedBox>

      <RoundedBox
        args={[2.52, 0.06, 0.72]}
        radius={0.03}
        smoothness={4}
        position={[2.18, 0.95, 1.48]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#faf7f2" roughness={0.2} />
      </RoundedBox>

      <mesh castShadow receiveShadow position={[2.18, 1.03, 1.44]}>
        <cylinderGeometry args={[0.28, 0.22, 0.12, 28]} />
        <meshStandardMaterial color="#ffffff" roughness={0.18} />
      </mesh>

      <mesh castShadow receiveShadow position={[2.18, 1.72, wallZ + 0.015]}>
        <planeGeometry args={[1.74, 1.18]} />
        <meshStandardMaterial color="#cfe0e9" roughness={0.14} metalness={0.12} />
      </mesh>

      <mesh castShadow receiveShadow position={[2.18, 1.72, wallZ + 0.006]}>
        <boxGeometry args={[1.88, 1.32, 0.03]} />
        <meshStandardMaterial color="#f7f4ef" roughness={0.86} />
      </mesh>

      <mesh position={[-0.72, 1.28, 1.56]} receiveShadow>
        <planeGeometry args={[1.72, 2.05]} />
        <meshPhysicalMaterial
          color="#e6f1f7"
          transparent
          opacity={0.2}
          transmission={0.78}
          roughness={0.04}
        />
      </mesh>

      <mesh castShadow receiveShadow position={[-0.72, 0.04, 1.1]}>
        <boxGeometry args={[1.72, 0.08, 0.16]} />
        <meshStandardMaterial color="#d4c6b5" roughness={0.94} />
      </mesh>

      <RoundedBox
        args={[0.78, 0.4, 0.9]}
        radius={0.05}
        smoothness={4}
        position={[-2.68, 0.22, -0.08]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f6f4f0" roughness={0.22} />
      </RoundedBox>

      <mesh castShadow receiveShadow position={[-2.68, 0.66, -0.11]}>
        <cylinderGeometry args={[0.22, 0.22, 0.24, 24]} />
        <meshStandardMaterial color="#faf8f5" roughness={0.16} />
      </mesh>

      <mesh castShadow receiveShadow position={[-2.2, 1.38, -3.95]}>
        <boxGeometry args={[0.72, 0.18, 0.08]} />
        <meshStandardMaterial color="#c6b5a1" roughness={0.82} />
      </mesh>
      <mesh castShadow receiveShadow position={[-2.2, 1.1, -3.95]}>
        <boxGeometry args={[0.06, 0.42, 0.06]} />
        <meshStandardMaterial color="#ccbba7" roughness={0.75} />
      </mesh>
    </>
  );
}

function KitchenSet() {
  return (
    <>
      <RoundedBox
        args={[5.8, 0.92, 0.7]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.46, 2.72]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#d7c6b1" roughness={0.96} />
      </RoundedBox>

      <RoundedBox
        args={[6.02, 0.08, 0.84]}
        radius={0.03}
        smoothness={4}
        position={[0, 0.96, 2.72]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f5efe6" roughness={0.2} />
      </RoundedBox>

      <mesh castShadow receiveShadow position={[1.45, 1.0, 2.72]}>
        <boxGeometry args={[0.62, 0.06, 0.42]} />
        <meshStandardMaterial color="#c0b1a0" roughness={0.18} metalness={0.15} />
      </mesh>

      <mesh castShadow receiveShadow position={[1.45, 1.04, 2.72]}>
        <boxGeometry args={[0.42, 0.03, 0.26]} />
        <meshStandardMaterial color="#2a2c2e" roughness={0.38} />
      </mesh>

      <mesh castShadow receiveShadow position={[0.0, 1.01, 2.72]}>
        <boxGeometry args={[0.72, 0.02, 0.38]} />
        <meshStandardMaterial color="#d7dbde" roughness={0.2} metalness={0.7} />
      </mesh>

      <RoundedBox
        args={[5.92, 1.16, 0.42]}
        radius={0.04}
        smoothness={4}
        position={[0, 2.36, -3.94]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f6f1e8" roughness={0.92} />
      </RoundedBox>

      <mesh position={[0, 1.55, -4.02]} receiveShadow>
        <planeGeometry args={[5.8, 1.06]} />
        <meshStandardMaterial color="#ece3d6" roughness={0.82} />
      </mesh>

      <RoundedBox
        args={[2.66, 0.94, 1.14]}
        radius={0.05}
        smoothness={4}
        position={[0, 0.47, 0.18]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#d9cab8" roughness={0.95} />
      </RoundedBox>

      <RoundedBox
        args={[2.86, 0.08, 1.26]}
        radius={0.03}
        smoothness={4}
        position={[0, 0.98, 0.18]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#f4eee7" roughness={0.2} />
      </RoundedBox>

      {[
        [-0.8, 0.34, -1.02],
        [0.8, 0.34, -1.02],
      ].map((pos, idx) => (
        <group key={idx} position={pos as Vec3}>
          <mesh castShadow receiveShadow position={[0, 0.34, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.68, 20]} />
            <meshStandardMaterial color="#b39b7f" roughness={0.92} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.08, 24]} />
            <meshStandardMaterial color="#eee4d8" roughness={0.28} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function PrimaryLights({ sceneId }: { sceneId: ThreeDRoomProps["sceneId"] }) {
  return (
    <>
      <ambientLight intensity={0.46} />
      <hemisphereLight intensity={0.48} color="#ffffff" groundColor="#d2c1ac" />

      <directionalLight
        castShadow
        position={
          sceneId === "bathroom"
            ? ([4.8, 5.5, 3.6] as Vec3)
            : sceneId === "kitchen"
            ? ([5.4, 5.9, 3.2] as Vec3)
            : ([5.8, 5.8, 4.0] as Vec3)
        }
        intensity={sceneId === "bathroom" ? 0.9 : 1.1}
        color={sceneId === "bathroom" ? "#fffdf8" : "#fff7ef"}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={18}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      <directionalLight position={[-4.2, 3.2, -2.4]} intensity={0.22} color="#dfe7ef" />
      <spotLight
        castShadow
        position={sceneId === "living" ? ([1.8, 3.0, -2.8] as Vec3) : ([0.6, 3.0, -2.2] as Vec3)}
        intensity={sceneId === "bathroom" ? 0.38 : 0.52}
        angle={0.42}
        penumbra={0.9}
        distance={12}
        color="#fff5ea"
      />
    </>
  );
}

function RoomScene({ sceneId, tileUrl, surfaceType }: ThreeDRoomProps) {
  const camera = useMemo(() => {
    switch (sceneId) {
      case "bathroom":
        return {
          position: [6.2, 2.5, 6.4] as Vec3,
          target: [0.0, 1.15, 0.45] as Vec3,
        };
      case "kitchen":
        return {
          position: [7.4, 2.95, 6.95] as Vec3,
          target: [0.0, 1.2, 0.8] as Vec3,
        };
      case "living":
      default:
        return {
          position: [7.5, 3.15, 7.2] as Vec3,
          target: [0.2, 1.15, 0.95] as Vec3,
        };
    }
  }, [sceneId]);

  return (
    <>
      <PerspectiveCamera makeDefault position={camera.position} fov={35} />
      <color attach="background" args={["#f3eadf"]} />

      <RendererSetup />
      <PrimaryLights sceneId={sceneId} />

      <Shell tileUrl={tileUrl} surfaceType={surfaceType} sceneId={sceneId} />
      <Baseboards />
      <CrownMolding />
      <CeilingDownlights sceneId={sceneId} />

      {sceneId === "living" ? <LivingWindow /> : null}
      {sceneId === "living" ? <LivingSet /> : null}
      {sceneId === "bathroom" ? <BathroomSet /> : null}
      {sceneId === "kitchen" ? <KitchenSet /> : null}

      <AccumulativeShadows
        temporal
        frames={48}
        alphaTest={0.92}
        scale={14}
        position={[0, 0.001, 0]}
        opacity={0.82}
        color="#000000"
      >
        <RandomizedLight
          amount={8}
          radius={5.2}
          ambient={0.34}
          intensity={0.9}
          position={[5.2, 5.2, -2.2]}
          bias={0.001}
        />
      </AccumulativeShadows>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={4.8}
        maxDistance={12}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.02}
        target={camera.target}
      />
    </>
  );
}

export default function ThreeDRoom({
  sceneId,
  tileUrl,
  surfaceType,
}: ThreeDRoomProps) {
  return (
    <div className="h-[460px] w-full overflow-hidden rounded-[1.7rem] border border-[var(--border-soft)] bg-[#f3eadf] shadow-[0_22px_60px_rgba(20,16,10,0.12)] sm:h-[620px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <RoomScene
            sceneId={sceneId}
            tileUrl={tileUrl}
            surfaceType={surfaceType}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}