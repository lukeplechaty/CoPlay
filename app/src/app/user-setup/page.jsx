"use server";

import { currentUser } from "@clerk/nextjs/server";
import { addUser } from "@/db";
import { redirect } from "next/navigation";

export default async function SetupUserPage() {
  const { id, username } = await currentUser();
  console.log(id);
  if (!id) {
    redirect("/sign-up");
  }

  await addUser(id, username);
  redirect("/");
}
