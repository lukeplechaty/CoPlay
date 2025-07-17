import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="w-full h-[80dvh] flex items-center justify-center">
      <SignUp />
    </main>
  );
}
