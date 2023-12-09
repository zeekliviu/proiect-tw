import Button from "../components/Button";
import "../styles/Home.css";
import Imagine from "../assets/images/grading.gif";
import { useEffect, useState } from "react";
import { DOMAIN } from "../assets/constants/constants";

export default function Home(props) {
  const [afisareButon, setAfisareButon] = useState(false);
  useEffect(() => {
    document.title = props.title + " | " + document.title;
    if (!localStorage.getItem("logged_in")) setAfisareButon(true);
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);
  return (
    <>
      <img
        src={Imagine}
        alt="Home GIF"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          marginTop: "10vh",
        }}
      ></img>
      <div id="home-container">
        <h1 id="home-header">Bine ai venit pe Zeth Anonymous Grading&trade;</h1>
        {afisareButon && (
          <div id="home-buttons-container">
            <Button
              className="home-button"
              onClick={() => {
                window.location.href = "/register";
              }}
            >
              Înregistrare
            </Button>
            <Button
              className="home-button"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Autentificare
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
