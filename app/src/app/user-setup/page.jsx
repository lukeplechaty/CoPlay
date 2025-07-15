"use server";

import { currentUser } from "@clerk/nextjs/server";
import { addUser, getUser } from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function SetupUserPage() {
  const user = await currentUser();
  const { id, username } = user;
  const DBUser = await getUser(id);

  if (!user || !id || !username) {
    console.log("no user found");
    redirect("/sign-up");
  } else if (DBUser) redirect("/");

  if (id === username) {
    revalidatePath("/user-setup");
    redirect("/user-setup");
  }

  await addUser(id, username);

  return redirect("/");
}
