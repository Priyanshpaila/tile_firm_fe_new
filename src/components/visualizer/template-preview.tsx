import { Product, RoomTemplate, UploadRecord } from "@/types";
import { getProductImage } from "@/lib/utils";

export function TemplatePreview({ template, tile, upload }: { template: RoomTemplate | null; tile: Product | null; upload?: UploadRecord | null; }) {
  const background = upload?.url || template?.backgroundImageUrl || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80";
  return (
    <div className="card-surface relative min-h-[420px] overflow-hidden p-3">
      <div className="absolute inset-0">
        <img src={background} alt={template?.name || "Room preview"} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      {tile ? <div className="absolute bottom-[10%] left-[10%] right-[10%] top-[58%] rounded-[18px] border border-white/30" style={{ backgroundImage: `url(${getProductImage(tile)})`, backgroundSize: "220px", backgroundPosition: "center" }} /> : null}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="self-start rounded-full bg-white/75 px-4 py-2 text-sm">{template ? `${template.name} · ${template.roomCategory}` : "Select a template"}</div>
        <div className="self-end rounded-2xl bg-[rgba(31,24,17,0.68)] px-4 py-3 text-sm text-white">{tile ? `Applied tile: ${tile.name}` : "Choose a tile to preview the surface"}</div>
      </div>
    </div>
  );
}
