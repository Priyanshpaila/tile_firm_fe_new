"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, Vector3 } from "three";
import type { GLTF } from "three-stdlib";
import { applyMaterialToMeshes } from "./material-applier";
import type {
  AppliedTiles,
  RoomConfig,
  SurfaceMaterialSettings,
} from "../types";

type Props = {
  modelUrl: string;
  config: RoomConfig;
  materialSettings: SurfaceMaterialSettings;
  appliedTiles: AppliedTiles;
};

type GLTFResult = GLTF & { scene: Group };

export function BaseRoomScene({
  modelUrl,
  config,
  materialSettings,
  appliedTiles,
}: Props) {
  const { scene } = useGLTF(modelUrl) as GLTFResult;

  const clonedScene = useMemo(() => {
    const next = scene.clone(true) as Group;

    next.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return next;
  }, [scene]);

  useLayoutEffect(() => {
    const scale = config.modelScale ?? 1;
    const [offsetX, offsetY, offsetZ] = config.modelOffset ?? [0, 0, 0];

    clonedScene.scale.setScalar(scale);
    clonedScene.updateMatrixWorld(true);

    const box = new Box3().setFromObject(clonedScene);
    const center = new Vector3();
    box.getCenter(center);

    clonedScene.position.set(
      -center.x + offsetX,
      -box.min.y + offsetY,
      -center.z + offsetZ,
    );

    clonedScene.updateMatrixWorld(true);
  }, [clonedScene, config.modelOffset, config.modelScale]);

  useEffect(() => {
    applyMaterialToMeshes({
      scene: clonedScene,
      config,
      materialSettings,
      appliedTiles,
    });
  }, [clonedScene, config, materialSettings, appliedTiles]);

  return <primitive object={clonedScene} />;
}

useGLTF.preload("/models/cozy_living_room_baked.glb");