import { getUser, getVideo } from "@/db";
import VideoRoomClient from "@/components_client/VideoRoomClient";
import { auth } from "@clerk/nextjs/server";

export default async function VideoPage({ params }) {
  const resolvedParams = await params;
  const { video, room } = resolvedParams;
  if (!/^[0-9]+$/.test(String(video))) {
    return null;
  }
  const data = await getVideo(video);
  const { userId } = await auth();
  const { username } = await getUser(userId);

  return (
    <>
      <main className="w-full h-full flex flex-col items-center justify-center mt-4">
        <VideoRoomClient
          video_id={video}
          room_id={room}
          data={data}
          username={username}
        />
      </main>
    </>
  );
}
