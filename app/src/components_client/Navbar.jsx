import style from "@/components_client/client_component_css/nav.module.css";
import Menu from "./Menu";
import Search from "./Search";

export default function NavBar() {
  return (
    <div className={style.nav}>
      <img src="/images/CoPlayLogo.png" alt="CoPlay Logo" width="100" />
      <Search />
      <Menu />
    </div>
  );
}
