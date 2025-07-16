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

    console.log([url, title, tags, id]);
    const upload = await addVideo(url, title, tags, id);
    console.log("res:", upload);

    // redirect to show uploads
    redirect(`/?user=${id}`);
  };

  return (
    <main>
      <h1 className="font-title text-2xl font-bold">Important Info</h1>
      <UploadForm
        submit={submit}
        fileName={getVideoUrl(decodePeriod(fileName))}
        tags={tags}
        user={user.id}
      />
    </main>
  );
}
