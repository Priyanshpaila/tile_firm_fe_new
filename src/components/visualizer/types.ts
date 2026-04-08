export type SurfaceType = "floor" | "wall" | "ceiling";

export type AppliedTiles = {
  floor?: string;
  wall?: string;
  ceiling?: string;
};

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