import style from "£$/nav.module.css";
import Menu from "./Menu";
import Search from "./Search";
import Image from "next/image";

export default function NavBar() {
  return (
    <div className={style.nav}>
      <Image src="/images/CoPlayLogo.png" alt="CoPlay Logo" width="100" />
      <Search />
      <Menu />
    </div>
  );
}
