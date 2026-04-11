import type { RoomConfig } from "../types";

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  cozy_living: {
    modelUrl: "/models/shapespark_example_room.glb",

    floorMeshes: [
      "Floor",
    ],

    wallMeshes: [
      "Wall",
    ],

    ceilingMeshes: [
     "Ceiling",
    ],

    modelScale: 1,
    modelOffset: [0, 0, 0],
    target: [0, 1.1, 0],


    twoDCamera: {
      position: [.08, 1.2, 1.3],
      fov: 49,
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