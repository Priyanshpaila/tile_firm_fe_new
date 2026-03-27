"use client";

import { create } from "zustand";
import type { Product, RoomTemplate, UploadRecord } from "@/types";

interface VisualizerState {
  selectedTile: Product | null;
  selectedTemplate: RoomTemplate | null;
  uploadedRoom: UploadRecord | null;
  previewMode: "2d" | "3d";
  setSelectedTile: (tile: Product | null) => void;
  setSelectedTemplate: (template: RoomTemplate | null) => void;
  setUploadedRoom: (upload: UploadRecord | null) => void;
  setPreviewMode: (mode: "2d" | "3d") => void;
  reset: () => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  selectedTile: null,
  selectedTemplate: null,
  uploadedRoom: null,
  previewMode: "2d",
  setSelectedTile: (selectedTile) => set({ selectedTile }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
  setUploadedRoom: (uploadedRoom) => set({ uploadedRoom }),
  setPreviewMode: (previewMode) => set({ previewMode }),
  reset: () => set({ selectedTile: null, selectedTemplate: null, uploadedRoom: null, previewMode: "2d" }),
}));
