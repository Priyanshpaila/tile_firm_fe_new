import * as THREE from "three";
import type { Group, Material, Mesh } from "three";
import type { AppliedTiles, RoomConfig, SurfaceType } from "../types";

type Args = {
  scene: Group;
  config: RoomConfig;
  tileScale: number;
  appliedTiles: AppliedTiles;
};

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");

const textureCache = new Map<string, THREE.Texture>();

function normalizeValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getMaterialNames(material: Material | Material[]) {
  if (Array.isArray(material)) {
    return material.map((item) => item.name || "").filter(Boolean);
  }

  return [material.name || ""].filter(Boolean);
}

function meshMatchesTarget(mesh: Mesh, targets: string[]) {
  const haystack = normalizeValue(
    [mesh.name, ...getMaterialNames(mesh.material)].join(" "),
  );

  return targets.some((target) => haystack.includes(normalizeValue(target)));
}

function getRepeat(surface: SurfaceType, config: RoomConfig, tileScale: number) {
  const base = config.textureRepeat?.[surface] ?? 2;
  return Math.max(0.25, base * tileScale);
}

function getTexture(url: string, repeat: number) {
  const key = `${url}__${repeat}`;
  let texture = textureCache.get(key);

  if (!texture) {
    texture = textureLoader.load(url);
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
  const cloned = material.clone();

  if ("color" in cloned && cloned.color) {
    cloned.color = new THREE.Color("#ffffff");
  }

  if ("vertexColors" in cloned) {
    cloned.vertexColors = false;
  }

  if ("roughness" in cloned && typeof cloned.roughness === "number") {
    cloned.roughness = Math.min(cloned.roughness, 0.95);
  }

  if ("metalness" in cloned && typeof cloned.metalness === "number") {
    cloned.metalness = 0.04;
  }

  return cloned;
}

function buildMaterialFromBase(
  base: Material | Material[],
  texture: THREE.Texture,
): Material | Material[] {
  if (Array.isArray(base)) {
    return base.map((item) => {
      const material = cloneBaseMaterial(item) as THREE.Material & {
        map?: THREE.Texture | null;
        needsUpdate?: boolean;
      };

      material.map = texture;
      material.needsUpdate = true;
      return material;
    });
  }

  const material = cloneBaseMaterial(base) as THREE.Material & {
    map?: THREE.Texture | null;
    needsUpdate?: boolean;
  };

  material.map = texture;
  material.needsUpdate = true;
  return material;
}

function getStoredBaseMaterial(mesh: Mesh) {
  if (!mesh.userData.__visualizerBaseMaterial) {
    mesh.userData.__visualizerBaseMaterial = Array.isArray(mesh.material)
      ? mesh.material.map((item: Material) => item.clone())
      : mesh.material.clone();
  }

  return mesh.userData.__visualizerBaseMaterial as Material | Material[];
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
    const baseMaterial = getStoredBaseMaterial(mesh);

    const applySurface = (surface: SurfaceType, targets: string[]) => {
      const textureUrl = appliedTiles[surface];
      if (!textureUrl) return false;
      if (!meshMatchesTarget(mesh, targets)) return false;

      const repeat = getRepeat(surface, config, tileScale);
      const texture = getTexture(textureUrl, repeat);
      mesh.material = buildMaterialFromBase(baseMaterial, texture);
      return true;
    };

    const applied =
      applySurface("floor", config.floorMeshes) ||
      applySurface("wall", config.wallMeshes) ||
      applySurface("ceiling", config.ceilingMeshes);

    if (!applied && mesh.userData.__visualizerRestored !== true) {
      mesh.material = Array.isArray(baseMaterial)
        ? baseMaterial.map((item) => item.clone())
        : baseMaterial.clone();

      mesh.userData.__visualizerRestored = true;
    }

    if (applied) {
      mesh.userData.__visualizerRestored = false;
    }
  });
}