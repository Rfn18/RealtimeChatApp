"use client";

import { uploadProfilePhoto } from "@/lib/actions/profile";
import { useState } from "react";

export default function PhotoUpload({
  onPhotoUpload,
}: {
  onPhotoUpload: (url: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadProfilePhoto(file);
      if (result?.success && result.url) {
        onPhotoUpload(result.url);
        setError(null);
      } else {
        setError(error ?? "Failed to upload photos.");
      }
    } catch (error) {
      console.error("Failed to change photo");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="absolue bootm-0 right-0">
      <input type="file" accept="image/*" className="hidden" />
    </div>
  );
}
