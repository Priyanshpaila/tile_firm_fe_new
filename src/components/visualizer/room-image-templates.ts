export type RoomSurfaceId = "floor" | "wall" | "ceiling";

export type RoomSurface = {
  id: RoomSurfaceId;
  label: string;
  polygon: { x: number; y: number }[];
  labelPosition: { x: number; y: number };
};

export type RoomImageTemplate = {
  id: string;
  name: string;
  description: string;
  kind: "floor" | "wall" | "ceiling";
  image: string;
  width: number;
  height: number;
  surfaces: RoomSurface[];
};

export const ROOM_IMAGE_TEMPLATES: RoomImageTemplate[] = [
{
  id: "living-room-floor-1",
  name: "Living Room Floor",
  description: "Living room with floor, wall and ceiling hotspots.",
  kind: "floor",
  image: "/visualizer/templates/living-room-1.jpg",

  // keep these equal to the REAL pixel size of living-room-1.jpg
  width: 900,
  height: 1200,

  surfaces: [
{
  id: "floor",
  label: "Floor",
  labelPosition: { x: 507, y: 1004 },
  polygon: [
    { x: 0, y: 1200 },
    { x: 0, y: 1160 },
    { x: 0, y: 1115 },
    { x: 0, y: 1067 },
    { x: 0, y: 1025 },
    { x: 0, y: 985 },
    { x: 0, y: 950 },
    { x: 0, y: 920 },

    { x: 36, y: 909 },
    { x: 74, y: 906 },
    { x: 114, y: 899 },
    { x: 154, y: 899 },
    { x: 174, y: 894 },
    { x: 172, y: 687 },
    { x: 248, y: 683 },
    { x: 242, y: 715 },
    { x: 325, y: 777 },

    { x: 325, y: 768 },
    { x: 348, y: 761 },
    { x: 348, y: 710 },
    { x: 464, y: 700 },
    { x: 497, y: 697 },
    { x: 528, y: 696 },
    { x: 552, y: 694 },

    { x: 554, y: 690 },
    { x: 589, y: 695 },
    { x: 597, y: 697 },
    { x: 597, y: 730 },
    { x: 597, y: 755 },
    { x: 597, y: 785 },

    { x: 642, y: 789 },
    { x: 692, y: 782 },
    { x: 744, y: 773 },
    { x: 796, y: 769},
    { x: 848, y: 762 },
    { x: 899, y: 770 },

    { x: 899, y: 1194 },
  ],
},

{
  id: "wall",
  label: "Wall",
  labelPosition: { x: 730, y: 505 },
  polygon: [
    { x: 394, y: 186 },
    { x: 448, y: 194 },
    { x: 505, y: 203 },
    { x: 562, y: 212 },
    { x: 620, y: 221 },
    { x: 678, y: 231 },
    { x: 735, y: 240 },
    { x: 790, y: 251 },
    { x: 845, y: 268 },

    { x: 845, y: 772 },
    { x: 805, y: 771 },
    { x: 760, y: 771 },
    { x: 715, y: 772 },
    { x: 670, y: 774 },
    { x: 630, y: 775 },
    { x: 596, y: 775 },

    { x: 596, y: 708 },
    { x: 596, y: 640 },
    { x: 596, y: 570 },
    { x: 596, y: 500 },
    { x: 596, y: 430 },
    { x: 596, y: 363 },

    { x: 560, y: 362 },
    { x: 528, y: 362 },
    { x: 495, y: 362 },
    { x: 463, y: 361 },
    { x: 433, y: 361 },

    { x: 420, y: 415 },
    { x: 407, y: 468 },
    { x: 394, y: 523 },
    { x: 381, y: 578 },
    { x: 369, y: 633 },
    { x: 360, y: 688 },

    { x: 334, y: 704 },
    { x: 334, y: 650 },
    { x: 334, y: 592 },
    { x: 334, y: 532 },
    { x: 334, y: 472 },
    { x: 334, y: 410 },
    { x: 334, y: 311 },
  ],
},

    {
      id: "ceiling",
      label: "Ceiling",
      labelPosition: { x: 455, y: 110 },
      polygon: [
        { x: 109, y: 219 }, // left lower ceiling edge
        { x: 200, y: 18 },  // top-left
        { x: 662, y: 18 },  // top-right
        { x: 756, y: 219 }, // right lower edge
        { x: 727, y: 243 }, // right edge near bulkhead
        { x: 395, y: 188 }, // ceiling edge above front wall mass
      ],
    },
  ],
},

  {
    id: "kitchen-wall-1",
    name: "Kitchen Wall",
    description: "Kitchen backsplash and floor friendly preview.",
    kind: "wall",
    image: "/visualizer/templates/kitchen-wall-1.jpg",
    width: 1200,
    height: 900,
    surfaces: [
      {
        id: "wall",
        label: "Wall",
        labelPosition: { x: 615, y: 325 },
        polygon: [
          { x: 130, y: 150 },
          { x: 1080, y: 150 },
          { x: 1080, y: 520 },
          { x: 130, y: 520 },
        ],
      },
      {
        id: "floor",
        label: "Floor",
        labelPosition: { x: 575, y: 770 },
        polygon: [
          { x: 120, y: 620 },
          { x: 1080, y: 620 },
          { x: 1160, y: 900 },
          { x: 40, y: 900 },
        ],
      },
    ],
  },

  {
    id: "bathroom-wall-1",
    name: "Bathroom Wall",
    description: "Bathroom wall and floor tile preview.",
    kind: "wall",
    image: "/visualizer/templates/bathroom-wall-1.jpg",
    width: 1000,
    height: 1300,
    surfaces: [
      {
        id: "wall",
        label: "Wall",
        labelPosition: { x: 500, y: 365 },
        polygon: [
          { x: 110, y: 110 },
          { x: 890, y: 110 },
          { x: 890, y: 790 },
          { x: 110, y: 790 },
        ],
      },
      {
        id: "floor",
        label: "Floor",
        labelPosition: { x: 500, y: 1110 },
        polygon: [
          { x: 160, y: 925 },
          { x: 840, y: 925 },
          { x: 940, y: 1298 },
          { x: 70, y: 1298 },
        ],
      },
    ],
  },

  {
    id: "ceiling-room-1",
    name: "Ceiling Preview",
    description: "Ceiling-focused room visualizer.",
    kind: "ceiling",
    image: "/visualizer/templates/ceiling-room-1.jpg",
    width: 1100,
    height: 800,
    surfaces: [
      {
        id: "ceiling",
        label: "Ceiling",
        labelPosition: { x: 558, y: 132 },
        polygon: [
          { x: 215, y: 40 },
          { x: 888, y: 40 },
          { x: 1030, y: 235 },
          { x: 72, y: 235 },
        ],
      },
      {
        id: "wall",
        label: "Wall",
        labelPosition: { x: 864, y: 430 },
        polygon: [
          { x: 740, y: 236 },
          { x: 1098, y: 236 },
          { x: 1098, y: 760 },
          { x: 740, y: 760 },
        ],
      },
    ],
  },
];

export function getTemplatesForSurfaceKind(kind: "floor" | "wall" | "ceiling") {
  return ROOM_IMAGE_TEMPLATES.filter((item) => item.kind === kind);
}