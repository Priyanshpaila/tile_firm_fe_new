"use client";

type Props = {
  tileScale: number;
  onTileScaleChange: (value: number) => void;
};

export function VisualizerMaterialControls({
  tileScale,
  onTileScaleChange,
}: Props) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Tile scale</h3>
        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
          {tileScale.toFixed(2)}x
        </span>
      </div>

      <input
        type="range"
        min={0.6}
        max={2.2}
        step={0.05}
        value={tileScale}
        onChange={(e) => onTileScaleChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer accent-black"
      />

      <p className="mt-3 text-sm leading-6 text-neutral-500">
        Move right for a denser tile pattern. Move left for a larger tile look.
      </p>
    </div>
  );
}