import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function addVideo(name, file) {
  try {
    const { data, error } = await supabase.storage
      .from("videos")
      .upload(name, file);
    if (error === null) return data.path;
    else return error;
  } catch (error) {
    throw new Error(`add to bucket error: ${error}`);
  }
}

export async function getVideoUrl(video) {
  try {
    const { data } = supabase.storage.from("videos").getPublicUrl(video);
    return data.publicUrl;
  } catch (error) {
    throw new Error(`get from bucket error: ${error}`);
  }
}
