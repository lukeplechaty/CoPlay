import { addVideo, getTagTypes } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { decodePeriod } from "@/utils/escaping";
import { getVideoUrl } from "@/utils/fileupload";
import { getUser } from "@/db";
import UploadForm from "£/UploadForm";
import { redirect } from "next/navigation";

export default async function VideoDbUploadPage({ params }) {
  const { fileName } = await params;
  const { userId } = await auth();
  const tags = await getTagTypes();
  const user = await getUser(userId);

  const submit = async (url, title, tags, id) => {
    "use server";

    await addVideo(url, title, tags, id);

    // redirect to show uploads
    redirect(`/?user=${id}`);
  };

  return (
    <main className="w-full h-full flex flex-col justify-start items-center gap-8 mt-12">
      <h1 className="font-title text-4xl font-bold tracking-wide">
        Important Info
      </h1>
      <UploadForm
        submit={submit}
        fileName={getVideoUrl(decodePeriod(fileName))}
        tags={tags}
        user={user.id}
      />
    </main>
  );
}
