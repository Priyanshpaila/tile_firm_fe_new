"use client";

import { ChangeEvent, useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/layout/auth-guard";
import { api } from "@/lib/api";
import { useVisualizerStore } from "@/store/visualizer-store";
import type { UploadRecord } from "@/types";

export default function UploadRoomPage() {
  const setUploadedRoom = useVisualizerStore((s) => s.setUploadedRoom);
  const uploadedRoom = useVisualizerStore((s) => s.uploadedRoom);
  const [upload, setUpload] = useState<UploadRecord | null>(uploadedRoom);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "room_photo");
    setBusy(true);
    setError(null);
    try {
      const response = await api.uploads.single(formData);
      setUpload(response.data.upload);
      setUploadedRoom(response.data.upload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthGuard roles={["user", "staff", "admin"]}>
      <PageShell title="Upload Room" description="Authenticated image upload wired to /api/uploads/single with backend-expected field names.">
        <div className="card-surface grid gap-4 p-6">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} />
          {busy ? <p className="text-sm text-[var(--text-secondary)]">Uploading...</p> : null}
          {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
          {upload ? (
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <img src={upload.url} alt={upload.originalName} className="w-full rounded-2xl object-cover" />
              <div className="rounded-2xl border border-[var(--border-soft)] bg-white/60 p-4">
                <p className="font-semibold">{upload.originalName}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Type: {upload.uploadType}</p>
                <p className="text-sm text-[var(--text-secondary)]">Mime: {upload.mimetype}</p>
                <p className="text-sm text-[var(--text-secondary)]">Size: {(upload.size / 1024 / 1024).toFixed(2)} MB</p>
                <div className="mt-4"><Button variant="secondary" onClick={() => window.location.assign("/visualizer")}>Use in visualizer</Button></div>
              </div>
            </div>
          ) : null}
        </div>
      </PageShell>
    </AuthGuard>
  );
}
