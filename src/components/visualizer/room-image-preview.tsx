"use client";

import { useMemo } from "react";
import { resolveAssetUrl } from "./utils";
import type { RoomImageTemplate, RoomSurfaceId } from "./room-image-templates";

type Props = {
  template: RoomImageTemplate;
  activeSurface: RoomSurfaceId;
  tileUrl?: string;
  onSurfaceSelect: (surface: RoomSurfaceId) => void;
};

function pointsToString(points: { x: number; y: number }[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function RoomImagePreview({
  template,
  activeSurface,
  tileUrl,
  onSurfaceSelect,
}: Props) {
  const resolvedTile = resolveAssetUrl(tileUrl);
  const patternId = useMemo(() => `tile-pattern-${template.id}`, [template.id]);

  return (
    <div className="overflow-hidden rounded-[1.7rem] border border-[var(--border-soft)] bg-white shadow-[0_18px_50px_rgba(20,16,10,0.08)]">
      <svg
        viewBox={`0 0 ${template.width} ${template.height}`}
        className="h-auto min-h-[620px] w-full bg-[#f7f2ea] object-cover xl:min-h-[760px] 2xl:min-h-[860px]"
      >
        <defs>
          {resolvedTile ? (
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="96"
              height="96"
            >
              <image
                href={resolvedTile}
                x="0"
                y="0"
                width="96"
                height="96"
                preserveAspectRatio="none"
              />
            </pattern>
          ) : null}
        </defs>

        <image
          href={template.image}
          x="0"
          y="0"
          width={template.width}
          height={template.height}
          preserveAspectRatio="xMidYMid slice"
        />

        {template.surfaces.map((surface) => {
          const isActive = surface.id === activeSurface;

          return (
            <g key={surface.id}>
              <polygon
                points={pointsToString(surface.polygon)}
                fill={
                  resolvedTile && isActive
                    ? `url(#${patternId})`
                    : isActive
                      ? "rgba(215,163,107,0.22)"
                      : "rgba(255,255,255,0.02)"
                }
                stroke={isActive ? "#d7a36b" : "rgba(255,255,255,0.16)"}
                strokeWidth={isActive ? 4 : 2}
                className="cursor-pointer transition-all"
                opacity={resolvedTile && isActive ? 0.82 : isActive ? 1 : 0.55}
                onClick={() => onSurfaceSelect(surface.id)}
              />

              <g
                className="cursor-pointer"
                onClick={() => onSurfaceSelect(surface.id)}
              >
                <rect
                  x={surface.labelPosition.x - 44}
                  y={surface.labelPosition.y - 19}
                  width="88"
                  height="38"
                  rx="19"
                  fill={isActive ? "#2a241d" : "rgba(255,255,255,0.92)"}
                  stroke={isActive ? "#d7a36b" : "rgba(0,0,0,0.08)"}
                />
                <text
                  x={surface.labelPosition.x}
                  y={surface.labelPosition.y + 5}
                  fill={isActive ? "#ffffff" : "#1b1713"}
                  fontSize="15"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {surface.label}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}