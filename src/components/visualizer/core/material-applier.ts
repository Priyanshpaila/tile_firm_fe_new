import * as THREE from "three";
import type { Group, Material, Mesh } from "three";
import type {
  AppliedTiles,
  RoomConfig,
  SurfaceMaterialSetting,
  SurfaceMaterialSettings,
  SurfaceType,
} from "../types";

type Args = {
  scene: Group;
  config: RoomConfig;
  materialSettings: SurfaceMaterialSettings;
  appliedTiles: AppliedTiles;
};

const loader = new THREE.TextureLoader();
const baseTextureCache = new Map<string, THREE.Texture>();

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

function getBaseTexture(url: string) {
  let texture = baseTextureCache.get(url);

  if (!texture) {
    texture = loader.load(url);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;
    texture.anisotropy = 16;
    texture.needsUpdate = true;
    baseTextureCache.set(url, texture);
  }

  return texture;
}

function buildConfiguredTexture(
  url: string,
  surface: SurfaceType,
  config: RoomConfig,
  settings: SurfaceMaterialSetting,
) {
  const base = getBaseTexture(url);
  const texture = base.clone();

  const baseRepeat = config.textureRepeat?.[surface] ?? 2;
  const finalRepeat = Math.max(0.15, baseRepeat * settings.scale);

  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.anisotropy = 16;

  texture.repeat.set(finalRepeat, finalRepeat);
  texture.offset.set(settings.offsetX, settings.offsetY);
  texture.center.set(0.5, 0.5);
  texture.rotation = THREE.MathUtils.degToRad(settings.rotation);
  texture.needsUpdate = true;

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
  settings: SurfaceMaterialSetting,
) {
  const base = getStoredBaseMaterial(mesh);

  if (Array.isArray(base)) {
    mesh.material = base.map((m) => {
      const next = cloneBaseMaterial(m) as THREE.Material & {
        map?: THREE.Texture | null;
        roughness?: number;
        metalness?: number;
        needsUpdate?: boolean;
      };

      next.map = texture;
      if (typeof next.roughness === "number") next.roughness = settings.roughness;
      if (typeof next.metalness === "number") next.metalness = settings.metalness;
      next.needsUpdate = true;
      return next;
    });
    return;
  }

  const next = cloneBaseMaterial(base) as THREE.Material & {
    map?: THREE.Texture | null;
    roughness?: number;
    metalness?: number;
    needsUpdate?: boolean;
  };

  next.map = texture;
  if (typeof next.roughness === "number") next.roughness = settings.roughness;
  if (typeof next.metalness === "number") next.metalness = settings.metalness;
  next.needsUpdate = true;
  mesh.material = next;
}

export function applyMaterialToMeshes({
  scene,
  config,
  materialSettings,
  appliedTiles,
}: Args) {
  const configuredTextures: Partial<Record<SurfaceType, THREE.Texture>> = {};

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

    const settings = materialSettings[surface];

    if (!configuredTextures[surface]) {
      configuredTextures[surface] = buildConfiguredTexture(
        textureUrl,
        surface,
        config,
        settings,
      );
    }

    applyTextureToMesh(mesh, configuredTextures[surface]!, settings);
  });
}