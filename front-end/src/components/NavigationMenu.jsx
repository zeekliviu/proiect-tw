import "../styles/NavigationMenu.css";
import { useEffect, useState } from "react";

export default function NavigationMenu() {
  const [calitate, setCalitate] = useState(localStorage.getItem("calitate"));
  const [navClass, setNavClass] = useState(
    calitate === null
      ? "logged-out"
      : calitate === "student"
      ? "student"
      : "profesor"
  );

  useEffect(() => {
    setCalitate(localStorage.getItem("calitate"));
    setNavClass(
      calitate === null
        ? "logged-out"
        : calitate === "student"
        ? "student"
        : "profesor"
    );
  }, [calitate]);

  if (calitate === null)
    return (
      <>
        <nav id="main-nav">
          <div id="nav-content" className={navClass}>
            <a href="/">
              <div>Acasă</div>
            </a>
            <a href="/login">
              <div>Autentificare</div>
            </a>
            <a href="/register">
              <div>Înregistrare</div>
            </a>
            <a href="/about">
              <div>Despre</div>
            </a>
          </div>
        </nav>
      </>
    );
  else if (calitate === "student")
    return (
      <>
        <nav id="main-nav">
          <div id="nav-content" className={navClass}>
            <a href="/">
              <div>Acasă</div>
            </a>
            <a href="/profile">
              <div>Profil</div>
            </a>
            <a href="/deliveries">
              <div>Livrabile</div>
            </a>
            <a href="/projects">
              <div>Proiecte</div>
            </a>
            <a href="/about">
              <div>Despre</div>
            </a>
            <a href="/logout">
              <div>Deconectare</div>
            </a>
          </div>
        </nav>
      </>
    );
  else if (calitate === "profesor") {
    return (
      <>
        <nav id="main-nav">
          <div id="nav-content" className={navClass}>
            <a href="/">
              <div>Acasă</div>
            </a>
            <a href="/profile">
              <div>Profil</div>
            </a>
            <a href="/grades">
              <div>Note</div>
            </a>
            <a href="/about">
              <div>Despre</div>
            </a>
            <a href="/logout">
              <div>Deconectare</div>
            </a>
          </div>
        </nav>
      </>
    );
  }
}
