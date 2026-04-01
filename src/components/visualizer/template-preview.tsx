"use client";

import { useMemo } from "react";
import type { VisualizerTemplate } from "./templates";
import type { VisualizerCategoryKind } from "./utils";
import { resolveAssetUrl } from "./utils";

type TemplatePreviewProps = {
  template: VisualizerTemplate;
  tileUrl?: string;
  activeKind: VisualizerCategoryKind;
  className?: string;
};

function SceneBase({ scene }: { scene: VisualizerTemplate["scene"] }) {
  switch (scene) {
    case "living-floor":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#efe7da" />
          <rect x="0" y="0" width="1000" height="560" fill="#f5efe6" />
          <rect x="0" y="0" width="1000" height="130" fill="#ebe2d3" />
          <rect x="110" y="170" width="210" height="210" rx="18" fill="#fcfbf8" stroke="#ddd1bf" />
          <rect x="690" y="170" width="170" height="110" rx="14" fill="#e8dccb" />
          <rect x="610" y="300" width="200" height="105" rx="20" fill="#d7c6b0" />
          <rect x="650" y="262" width="120" height="40" rx="14" fill="#cab398" />
          <rect x="340" y="270" width="240" height="100" rx="18" fill="#c6b39b" />
          <rect x="310" y="245" width="300" height="36" rx="18" fill="#c0aa90" />
          <rect x="725" y="130" width="35" height="35" rx="8" fill="#131313" opacity="0.55" />
        </>
      );

    case "hall-floor":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#f2ecdf" />
          <polygon points="0,0 330,390 670,390 1000,0" fill="#f8f3eb" />
          <polygon points="0,0 330,390 160,690 0,690" fill="#ece2d2" />
          <polygon points="1000,0 670,390 840,690 1000,690" fill="#e7dac7" />
          <rect x="430" y="145" width="140" height="160" rx="18" fill="#fffdf9" stroke="#d8ccb9" />
          <rect x="448" y="160" width="104" height="130" rx="12" fill="#d8cab6" />
        </>
      );

    case "kitchen-wall":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#efe5d6" />
          <rect x="0" y="0" width="1000" height="500" fill="#f7f2ea" />
          <rect x="0" y="500" width="1000" height="200" fill="#d6c4af" />
          <rect x="110" y="430" width="780" height="110" rx="16" fill="#ddd1bf" />
          <rect x="130" y="448" width="170" height="76" rx="8" fill="#f8f5ef" />
          <rect x="330" y="448" width="210" height="76" rx="8" fill="#f8f5ef" />
          <rect x="575" y="448" width="285" height="76" rx="8" fill="#f8f5ef" />
          <rect x="170" y="180" width="140" height="140" rx="18" fill="#fffdf9" stroke="#d8ccb9" />
          <rect x="690" y="200" width="120" height="100" rx="12" fill="#eadfce" />
        </>
      );

    case "bathroom-wall":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#ece5da" />
          <rect x="0" y="0" width="1000" height="520" fill="#f8f4ee" />
          <rect x="0" y="520" width="1000" height="180" fill="#d5c4b0" />
          <rect x="210" y="170" width="230" height="180" rx="22" fill="#ffffff" stroke="#ddd2c2" />
          <rect x="235" y="195" width="180" height="130" rx="16" fill="#dce8ed" />
          <rect x="560" y="420" width="180" height="120" rx="18" fill="#e7dbca" />
          <ellipse cx="650" cy="540" rx="120" ry="18" fill="#cdb8a0" />
        </>
      );

    case "tray-ceiling":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#eee6d7" />
          <polygon points="0,250 1000,250 1000,700 0,700" fill="#e1d2bd" />
          <polygon points="120,250 880,250 1000,700 0,700" fill="#d8c8b1" />
          <rect x="420" y="330" width="160" height="90" rx="22" fill="#b89f84" />
          <rect x="120" y="270" width="130" height="300" rx="16" fill="#faf7f2" opacity="0.85" />
          <rect x="750" y="290" width="110" height="260" rx="16" fill="#fcfbf8" opacity="0.85" />
        </>
      );

    case "office-ceiling":
      return (
        <>
          <rect x="0" y="0" width="1000" height="700" fill="#ede4d7" />
          <polygon points="0,250 1000,250 1000,700 0,700" fill="#d8c8b4" />
          <polygon points="80,250 920,250 1000,700 0,700" fill="#cfbda7" />
          <rect x="170" y="300" width="170" height="130" rx="16" fill="#f8f4ee" />
          <rect x="650" y="300" width="180" height="130" rx="16" fill="#f8f4ee" />
          <rect x="420" y="355" width="160" height="55" rx="16" fill="#9a856e" />
        </>
      );

    default:
      return null;
  }
}

export default function TemplatePreview({
  template,
  tileUrl,
  activeKind,
  className = "",
}: TemplatePreviewProps) {
  const patternId = useMemo(() => `tile-pattern-${template.id}`, [template.id]);
  const resolvedTile = resolveAssetUrl(tileUrl);

  const fillForSurface = (surfaceType: VisualizerCategoryKind) => {
    if (surfaceType !== activeKind || !resolvedTile) {
      return surfaceType === "floor"
        ? "#d9c8b3"
        : surfaceType === "wall"
          ? "#e8dece"
          : "#e2d6c6";
    }
    return `url(#${patternId})`;
  };

  return (
    <div
      className={`overflow-hidden rounded-[1.4rem] border border-[var(--border-soft)] bg-white shadow-[0_12px_30px_rgba(20,16,10,0.05)] ${className}`}
    >
      <svg viewBox="0 0 1000 700" className="h-full w-full">
        <defs>
          {resolvedTile ? (
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width="84"
              height="84"
            >
              <image
                href={resolvedTile}
                x="0"
                y="0"
                width="84"
                height="84"
                preserveAspectRatio="none"
              />
            </pattern>
          ) : null}
        </defs>

        <SceneBase scene={template.scene} />

        {template.surfaces.map((surface) => (
          <polygon
            key={surface.id}
            points={surface.points}
            fill={fillForSurface(surface.surfaceType)}
            stroke="#b79c7b"
            strokeWidth="3"
            opacity="0.96"
          />
        ))}

        <rect
          x="18"
          y="18"
          width="220"
          height="48"
          rx="24"
          fill="rgba(23,20,17,0.78)"
        />
        <text
          x="40"
          y="48"
          fill="#ffffff"
          fontSize="20"
          fontWeight="600"
          letterSpacing="0.06em"
        >
          {template.name}
        </text>
      </svg>
    </div>
  );
}