import * as THREE from "three";
import type { Group, Material, Mesh } from "three";
import type { AppliedTiles, RoomConfig, SurfaceType } from "../types";

type Args = {
  scene: Group;
  config: RoomConfig;
  tileScale: number;
  appliedTiles: AppliedTiles;
};

const loader = new THREE.TextureLoader();
const textureCache = new Map<string, THREE.Texture>();

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function materialNames(material: Material | Material[]) {
  if (Array.isArray(material)) {
    return material.map((m) => m.name || "").join(" ");
  }
  return material.name || "";
}

function meshText(mesh: Mesh) {
  return normalize(
    [
      mesh.name || "",
      mesh.parent?.name || "",
      mesh.geometry?.name || "",
      materialNames(mesh.material),
    ].join(" "),
  );
}

function matchesTarget(mesh: Mesh, targets: string[]) {
  const text = meshText(mesh);

  return targets.some((target) => {
    const t = normalize(target);
    return text === t || text.includes(t);
  });
}

function getSurface(mesh: Mesh, config: RoomConfig): SurfaceType | null {
  if (matchesTarget(mesh, config.floorMeshes)) return "floor";
  if (matchesTarget(mesh, config.wallMeshes)) return "wall";
  if (matchesTarget(mesh, config.ceilingMeshes)) return "ceiling";
  return null;
}

function getRepeat(surface: SurfaceType, config: RoomConfig, tileScale: number) {
  const base = config.textureRepeat?.[surface] ?? 2;
  return Math.max(0.25, base * tileScale);
}

function getTexture(url: string, repeat: number) {
  const key = `${url}__${repeat}`;
  let texture = textureCache.get(key);

  if (!texture) {
    texture = loader.load(url);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.anisotropy = 16;
    texture.repeat.set(repeat, repeat);
    texture.needsUpdate = true;
    textureCache.set(key, texture);
  }

  return texture;
}

function cloneBaseMaterial(material: Material) {
  const cloned = material.clone() as THREE.Material & {
    map?: THREE.Texture | null;
    color?: THREE.Color;
    roughness?: number;
    metalness?: number;
    side?: THREE.Side;
    needsUpdate?: boolean;
  };

  if (cloned.color) {
    cloned.color = new THREE.Color("#ffffff");
  }

  if (typeof cloned.roughness === "number") {
    cloned.roughness = 0.9;
  }

  if (typeof cloned.metalness === "number") {
    cloned.metalness = 0.04;
  }

  cloned.side = THREE.DoubleSide;
  return cloned;
}

function getStoredBaseMaterial(mesh: Mesh) {
  if (!mesh.userData.__baseMaterial) {
    mesh.userData.__baseMaterial = Array.isArray(mesh.material)
      ? mesh.material.map((m: Material) => m.clone())
      : mesh.material.clone();
  }

  return mesh.userData.__baseMaterial as Material | Material[];
}

function restoreBaseMaterial(mesh: Mesh) {
  const base = getStoredBaseMaterial(mesh);

  mesh.material = Array.isArray(base)
    ? base.map((m) => m.clone())
    : base.clone();
}

function applyTextureToMesh(
  mesh: Mesh,
  texture: THREE.Texture,
) {
  const base = getStoredBaseMaterial(mesh);

  if (Array.isArray(base)) {
    mesh.material = base.map((m) => {
      const next = cloneBaseMaterial(m) as THREE.Material & {
        map?: THREE.Texture | null;
        needsUpdate?: boolean;
      };

      next.map = texture;
      next.needsUpdate = true;
      return next;
    });
    return;
  }

  const next = cloneBaseMaterial(base) as THREE.Material & {
    map?: THREE.Texture | null;
    needsUpdate?: boolean;
  };

  next.map = texture;
  next.needsUpdate = true;
  mesh.material = next;
}

export function applyMaterialToMeshes({
  scene,
  config,
  tileScale,
  appliedTiles,
}: Args) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const mesh = child as Mesh;
    const surface = getSurface(mesh, config);

    if (!surface) return;

    const textureUrl = appliedTiles[surface];

    if (!textureUrl) {
      restoreBaseMaterial(mesh);
      return;
    }

    const repeat = getRepeat(surface, config, tileScale);
    const texture = getTexture(textureUrl, repeat);
    applyTextureToMesh(mesh, texture);
  });
}