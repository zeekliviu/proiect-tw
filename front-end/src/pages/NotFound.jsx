import "../styles/NotFound.css";
import Button from "../components/Button";
import Imagine from "../assets/images/john-travolta-confused.gif";
import { useEffect } from "react";
import { DOMAIN } from "../assets/constants/constants";

export default function NotFound(props) {
  useEffect(() => {
    document.title = props.title + " | " + document.title;
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);
  return (
    <>
      <img
        src={Imagine}
        alt="Not found GIF"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          marginTop: "10vh",
        }}
      />
      <div id="container-not-found">
        <h1 id="header-not-found">404 Negăsit</h1>
        <p id="paragraph-not-found">
          Se pare că pagina pe care ai încercat s-o accesezi nu există. Ești
          sigur că asta căutai?
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: "10%",
            width: "45%",
            height: "10vh",
            fontSize: "25px",
          }}
        >
          Spre Acasă
        </Button>
      </div>
    </>
  );
}
