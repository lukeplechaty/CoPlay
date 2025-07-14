import Style from "@/components_client/client_component_css/nav.module.css";
import Logins from "./Logins";
import Link from "next/link";

export default function MenuBox({ menu }) {
  if (!menu) return null;

  return (
    <div className={Style.menuBox}>
      {/* Update these with links */}
      <Logins />
      <Link href="/sign-up"> Sign Up </Link>
      <h1>Upload</h1>
    </div>
  );
}
