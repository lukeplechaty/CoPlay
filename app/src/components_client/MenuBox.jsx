import Style from "@/components_client/client_component_css/nav.module.css";

export default function MenuBox({ menu }) {
  if (!menu) return null;

  return (
    <div className={Style.menuBox}>
      {/* Update these with links */}
      <h1>Login</h1>
      <h1>Logout</h1>
      <h1>Upload</h1>
    </div>
  );
}
