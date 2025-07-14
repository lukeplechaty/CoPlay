import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "@/db";

export default async function Profile() {
  //   const { userId } = await auth();
  const { id } = await currentUser();
  const user = await getUser(id);

  if (!user) {
    return <p>No user</p>;
  }

  return <p>Username: {user.username}</p>;
}
