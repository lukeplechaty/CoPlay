import { addVideo, getTagTypes, getUser } from "@/db";
import { getVideoUrl } from "@/utils/fileupload";
import { auth } from "@clerk/nextjs/dist/types/server";
import TagComboBox from "£/TagComboBox";

export default async function VideoDbUploadPage({ params }) {
  const { fileName } = await params;
  const { userId } = await auth();
  const tags = await getTagTypes();

  const submit = async (formData) => {
    const data = {
      url: formData.get("file"),
      title: formData.get("title"),
      tags: formData.get("tags"),
      user: Number(formData.get("user")),
    };
    const upload = addVideo(data.url, data.title, data.tags, data.user);
  };

  return (
    <main>
      <h1 className="font-title text-2xl font-bold">Important Info</h1>
      <form action={submit}>
        <input
          type="text"
          name="file"
          value={getVideoUrl(fileName)}
          readOnly
          hidden
        />
        <label htmlFor="title">
          <input type="text" name="title" />
        </label>
        <TagComboBox frameworks={tags} />
        <input
          type="number"
          name="user"
          value={getUser(userId)}
          readOnly
          hidden
        />
      </form>
    </main>
  );
}
