import type { RoomConfig } from "../types";

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  cozy_living: {
    modelUrl: "/models/cozy_living_room_baked.glb",

    floorMeshes: [
      "cube.019",
      "birch wood flooring english",
    ],

    wallMeshes: [
      "plane material 021",
      "plane.001 material.011",
      "plane.001 material.013",
    ],

    ceilingMeshes: [
      "cube.007 material.023",
      "cube.014 material.023",
      "cube.038 material.023",
      "cube.008",
    ],

    modelScale: 1,
    modelOffset: [0, 0, 0],
    target: [0, 1.1, 0],

    twoDCamera: {
      position: [5.8, 2.35, 6.8],
      fov: 42,
    },

    threeDCamera: {
      position: [6.4, 3.25, 7.8],
      fov: 48,
    },

    controls: {
      minDistance: 3.5,
      maxDistance: 12,
      minPolarAngle: 0.55,
      maxPolarAngle: 1.42,
    },

    textureRepeat: {
      floor: 2.6,
      wall: 1.8,
      ceiling: 2.1,
    },
  },
};