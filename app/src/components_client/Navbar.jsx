"use client";

import style from "£$/nav.module.css";
import Menu from "./Menu";
import Search from "./Search";
import Image from "next/image";
import MenuBox from "./MenuBox";
import "animate.css";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function NavBar() {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  const toggleMenu = () => {
    setMenu((prev) => {
      const newValue = !prev;
      if (newValue) {
        menuClick();
      }
      return newValue;
    });
  };

  function menuClick() {
    const element = menuRef.current;
    if (element) {
      element.classList.remove("animate__fadeInDown");
      void element.offsetWidth;
      element.classList.add("animate__fadeInDown");
    }
  }

  useEffect(() => {
    // function for outside clicks
    function clickOutside(event) {
      if (
        menuRef.current && //check if menu box exists
        !menuRef.current.contains(event.target) && // if the click is not in the menu box
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setMenu(false); //closes menu
      }
    }

    if (menu) {
      document.addEventListener("click", clickOutside);
    } else {
      document.removeEventListener("click", clickOutside);
    }

    return () => {
      document.removeEventListener("click", clickOutside);
    };
  }, [menu]);

  return (
    <>
      <div className={`${style.nav} pt-4 pb-4`}>
        <Link href={"/"}>
          <picture>
            <source
              srcSet="/images/CoPlayLight.png"
              media="(prefers-color-scheme: light)"
              alt="CoPlay Logo"
              width={120}
              height={120}
            />
            <Image
              src="/images/CoPlayLogo.png"
              alt="CoPlay Logo"
              media="(prefers-color-scheme: dark)"
              width={120}
              height={120}
            />
          </picture>
        </Link>
        <Search />
        <Menu onClick={menuClick} toggleMenu={toggleMenu} ref={toggleRef} />
      </div>
      <div className={style.navBackLayer}>
        <MenuBox menu={menu} ref={menuRef} />
      </div>
    </>
  );
}
