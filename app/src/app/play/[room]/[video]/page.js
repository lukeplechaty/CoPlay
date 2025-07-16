import { getVideo } from "@/db";
import VideoRoomClient from "@/components_client/VideoRoomClient";

export default async function VideoPage({ params }) {
  const resolvedParams = await params;
  const { video, room } = resolvedParams;
  if (!/^[0-9]+$/.test(String(video))) {
    return null;
  }
  const data = await getVideo(video);
  return (
    <>
      <main className="w-full h-full flex flex-col items-center justify-center mt-4">
        <VideoRoomClient video_id={video} room_id={room} data={data} />
      </main>
    </>
  );
}
