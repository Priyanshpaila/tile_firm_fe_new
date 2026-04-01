import type { VisualizerCategoryKind } from "./utils";

export type TemplateSurface = {
  id: string;
  label: string;
  surfaceType: VisualizerCategoryKind;
  points: string;
};

export type VisualizerTemplate = {
  id: string;
  name: string;
  description: string;
  kind: VisualizerCategoryKind;
  scene: "living-floor" | "hall-floor" | "kitchen-wall" | "bathroom-wall" | "tray-ceiling" | "office-ceiling";
  surfaces: TemplateSurface[];
};

export const VISUALIZER_TEMPLATES: VisualizerTemplate[] = [
  {
    id: "living-floor-1",
    name: "Living Room Floor",
    description: "Wide room with foreground flooring focus.",
    kind: "floor",
    scene: "living-floor",
    surfaces: [
      {
        id: "floor-main",
        label: "Main Floor",
        surfaceType: "floor",
        points: "80,560 930,560 770,690 220,690",
      },
    ],
  },
  {
    id: "hall-floor-1",
    name: "Hallway Floor",
    description: "Long perspective floor for plank or stone tile preview.",
    kind: "floor",
    scene: "hall-floor",
    surfaces: [
      {
        id: "floor-hall",
        label: "Hall Floor",
        surfaceType: "floor",
        points: "330,390 670,390 840,690 160,690",
      },
    ],
  },
  {
    id: "kitchen-wall-1",
    name: "Kitchen Wall",
    description: "Back wall / backsplash visualizer template.",
    kind: "wall",
    scene: "kitchen-wall",
    surfaces: [
      {
        id: "wall-kitchen-main",
        label: "Kitchen Wall",
        surfaceType: "wall",
        points: "120,150 880,150 880,430 120,430",
      },
    ],
  },
  {
    id: "bathroom-wall-1",
    name: "Bathroom Wall",
    description: "Clean bathroom wall for ceramic and glossy tiles.",
    kind: "wall",
    scene: "bathroom-wall",
    surfaces: [
      {
        id: "wall-bathroom-main",
        label: "Bathroom Wall",
        surfaceType: "wall",
        points: "110,110 890,110 890,470 110,470",
      },
    ],
  },
  {
    id: "tray-ceiling-1",
    name: "Tray Ceiling",
    description: "Ceiling-focused modern room preview.",
    kind: "ceiling",
    scene: "tray-ceiling",
    surfaces: [
      {
        id: "ceiling-main",
        label: "Main Ceiling",
        surfaceType: "ceiling",
        points: "240,100 760,100 880,250 120,250",
      },
    ],
  },
  {
    id: "office-ceiling-1",
    name: "Office Ceiling",
    description: "Simple office ceiling concept for panel or patterned tiles.",
    kind: "ceiling",
    scene: "office-ceiling",
    surfaces: [
      {
        id: "ceiling-office",
        label: "Office Ceiling",
        surfaceType: "ceiling",
        points: "210,90 790,90 920,250 80,250",
      },
    ],
  },
];

export function getTemplatesForKind(kind: VisualizerCategoryKind) {
  return VISUALIZER_TEMPLATES.filter((template) => template.kind === kind);
}