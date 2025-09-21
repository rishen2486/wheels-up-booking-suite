import { supabase } from "@/lib/supabaseClient";

export async function uploadFiles(
  bucket: string,
  files: File[],
  folder: string
): Promise<string[]> {
  const uploadedUrls: string[] = [];

  for (const file of files.slice(0, 5)) {
    const filePath = `${folder}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      continue;
    }

    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path).data.publicUrl;

    uploadedUrls.push(publicUrl);
  }

  return uploadedUrls;
}