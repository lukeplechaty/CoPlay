import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="w-full flex items-center justify-center">
      <SignUp />
    </main>
  );
}
