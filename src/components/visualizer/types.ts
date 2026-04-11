export type SurfaceType = "floor" | "wall" | "ceiling";

export type AppliedTiles = {
  floor?: string;
  wall?: string;
  ceiling?: string;
};

export type SurfaceMaterialSetting = {
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
  roughness: number;
  metalness: number;
};

export type SurfaceMaterialSettings = Record<SurfaceType, SurfaceMaterialSetting>;

export function createDefaultSurfaceMaterialSetting(): SurfaceMaterialSetting {
  return {
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    roughness: 0.9,
    metalness: 0.04,
  };
}

export function createDefaultSurfaceMaterialSettings(): SurfaceMaterialSettings {
  return {
    floor: createDefaultSurfaceMaterialSetting(),
    wall: createDefaultSurfaceMaterialSetting(),
    ceiling: createDefaultSurfaceMaterialSetting(),
  };
}


export type RoomConfig = {
  modelUrl: string;

  floorMeshes: string[];
  wallMeshes: string[];
  ceilingMeshes: string[];

  modelScale?: number;
  modelOffset?: [number, number, number];
  target: [number, number, number];

  twoDCamera: {
    position: [number, number, number];
    fov: number;
  };

  threeDCamera: {
    position: [number, number, number];
    fov: number;
  };

  controls: {
    minDistance: number;
    maxDistance: number;
    minPolarAngle?: number;
    maxPolarAngle?: number;
  };

  textureRepeat?: {
    floor?: number;
    wall?: number;
    ceiling?: number;
  };
};