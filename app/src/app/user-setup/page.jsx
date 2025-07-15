"use server";

import { currentUser } from "@clerk/nextjs/server";
import { addUser } from "@/db";
import { redirect } from "next/navigation";

export default async function SetupUserPage() {
  const user = await currentUser();

  if (!user || !user.id || !user.username) {
    console.log("no user found");
    return redirect("/sign-up");
  }

  const { id, username } = user;

  await addUser(id, username);

  return redirect("/");
}
