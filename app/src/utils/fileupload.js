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
  try {
    const { data } = supabase.storage.from("Videos").getPublicUrl(video);
    return data.publicUrl;
  } catch (error) {
    throw new Error(`get from bucket error: ${error}`);
  }
}

export function deleteVideo(video) {
  try {
    const { data } = supabase.storage.from("Videos").remove(video);
    return data.publicUrl;
  } catch (error) {
    throw new Error(`delete from bucket error: ${error}`);
  }
}
