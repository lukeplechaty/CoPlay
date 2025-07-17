import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// not using for upload
export async function addVideo(name, file) {
  try {
    const { data, error } = await supabase.storage
      .from("Videos")
      .upload(name, file);
    if (error === null) return data.path;
    else return error;
  } catch (error) {
    throw new Error(`add to bucket error: ${error}`);
  }
}

export function getVideoUrl(video) {
  const { data, error } = supabase.storage.from("Videos").getPublicUrl(video);
  if (error || !data?.publicUrl) {
    throw new Error(
      `get from bucket error: ${error?.message || "No public URL"}`
    );
  }
  return data.publicUrl;
}

export async function deleteVideo(videoPath) {
  console.log(await videoPath);
  try {
    const { data, error } = await supabase.storage
      .from("Videos")
      .remove([videoPath]);
    if (error) throw error;
    return data;
  } catch (error) {
    //throw new Error(`delete from bucket error: ${error.message}`);
  }
}
