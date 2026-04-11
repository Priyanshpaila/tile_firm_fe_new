"use client";

import type {
  SurfaceMaterialSetting,
  SurfaceType,
} from "../types";

type Props = {
  selectedSurface: SurfaceType;
  settings: SurfaceMaterialSetting;
  onChange: (patch: Partial<SurfaceMaterialSetting>) => void;
  onReset: () => void;
  compact?: boolean;
};

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  suffix?: string;
  onChange: (value: number) => void;
};

function ControlSlider({
  label,
  min,
  max,
  step,
  value,
  suffix = "",
  onChange,
}: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700">
          {value.toFixed(2)}
          {suffix}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-black"
      />
    </div>
  );
}

export function VisualizerMaterialControls({
  selectedSurface,
  settings,
  onChange,
  onReset,
  compact = false,
}: Props) {
  return (
    <div className={compact ? "" : "rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5"}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">
            {compact ? "Editing controls" : "Material controls"}
          </h3>
          <p className="mt-1 text-xs text-neutral-500">
            Editing: <span className="font-semibold capitalize">{selectedSurface}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200"
        >
          Reset
        </button>
      </div>

      <div className={compact ? "grid grid-cols-1 gap-4" : "space-y-5"}>
        <ControlSlider
          label="Tile scale"
          min={0.4}
          max={3}
          step={0.05}
          value={settings.scale}
          suffix="x"
          onChange={(value) => onChange({ scale: value })}
        />

        <ControlSlider
          label="Rotation"
          min={-180}
          max={180}
          step={1}
          value={settings.rotation}
          suffix="°"
          onChange={(value) => onChange({ rotation: value })}
        />

        <ControlSlider
          label="Offset X"
          min={-2}
          max={2}
          step={0.01}
          value={settings.offsetX}
          onChange={(value) => onChange({ offsetX: value })}
        />

        <ControlSlider
          label="Offset Y"
          min={-2}
          max={2}
          step={0.01}
          value={settings.offsetY}
          onChange={(value) => onChange({ offsetY: value })}
        />

        <ControlSlider
          label="Roughness"
          min={0}
          max={1}
          step={0.01}
          value={settings.roughness}
          onChange={(value) => onChange({ roughness: value })}
        />

        <ControlSlider
          label="Metalness"
          min={0}
          max={1}
          step={0.01}
          value={settings.metalness}
          onChange={(value) => onChange({ metalness: value })}
        />
      </div>

      {!compact ? (
        <p className="mt-5 text-sm leading-6 text-neutral-500">
          These controls affect only the currently selected surface.
        </p>
      ) : null}
    </div>
  );
}