"use client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/dropzone";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";

export default function UploadPage() {
  const props = useSupabaseUpload({
    bucketName: "Videos",
    path: "",
    allowedMimeTypes: [/* "image/*",  */ "video/mp4"],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 10 * 5, // 50MB,
  });

  return (
    <main className="w-full h-[75dvh] flex flex-col items-center justify-start mt-16 gap-[25%]">
      <h1 className="font-title text-4xl font-bold tracking-wide">
        Video Upload
      </h1>
      <Dropzone {...props}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
    </main>
  );
}
