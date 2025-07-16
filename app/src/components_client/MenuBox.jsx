import Style from "@/components_client/client_component_css/nav.module.css";
import Logins from "./Logins";
import Link from "next/link";
import { SignedOut } from "@clerk/nextjs";
import { forwardRef } from "react";
import "animate.css";

const MenuBox = forwardRef(function MenuBox({ menu }, ref) {
  if (!menu) return null;

  return (
    <div
      ref={ref}
      className={`${Style.menuBox} animate__animated animate__fadeInDown`}
    >
      <Logins />
      <SignedOut>
        <Link href="/sign-up"> Sign Up </Link>
      </SignedOut>
      <Link href={"/upload"}>
        <h1>Upload</h1>
      </Link>
    </div>
  );
});

export default MenuBox;
