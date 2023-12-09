import { useEffect } from "react";
import "../styles/About.css";
import { DOMAIN } from "../assets/constants/constants";

export default function About(props) {
  useEffect(() => {
    document.title = props.title + " | " + document.title;
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);
  return (
    <div className="about-container">
      <div className="project-purpose">
        <h3 className="about-h3">Menirea proiectului</h3>
        <p className="about-p">
          Acest site are ca unic scop notarea, de către comisii anonime formate
          din studenți, proiectelor la tehnologii web.
        </p>
      </div>
      <div className="author-info">
        <h3 className="about-h3">Despre autor</h3>
        <div id="profile-pic"></div>
        <p id="about-p-long" className="about-p">
          Eu sunt autorul acestui site,{" "}
          <a
            className="about-me-links"
            href="https://linkedin.com/in/zeekliviu"
            target="_blank"
          >
            Zeek Liviu
          </a>
          . Experiența mea în tehnologii web este minimală. Nu am mai lucrat
          până acum cu așa ceva, însă am făcut multe aplicații interesate pe
          care te invit să le descoperi pe contul meu de{" "}
          <a
            className="about-me-links"
            href="https://github.com/zeekliviu"
            target="_blank"
          >
            GitHub
          </a>
          .
        </p>
      </div>
      <div className="technologies-used">
        <h3 className="about-h3">Tehnologii utilizate</h3>
        <ul className="about-ul">
          <li className="about-li">React</li>
          <li className="about-li">HTML</li>
          <li className="about-li">CSS</li>
          <li className="about-li">JavaScript</li>
          <li className="about-li">Node.js</li>
          <li className="about-li">Express.js</li>
          <li className="about-li">SQLite</li>
        </ul>
      </div>
      <h3 className="about-h3">Mulțumiri</h3>
      <div className="credits-container">
        <a href="https://github.com/joyzyy" target="_blank">
          <div id="gabi">
            <span className="credits-tooltip">Gabriel Zăvoianu</span>
          </div>
        </a>
        <a href="https://www.linkedin.com/in/andrei-toma-4b1694a/">
          <div id="prof">
            <span
              className="credits-tooltip"
              style={{ fontSize: "14px", marginLeft: "15px" }}
            >
              Andrei Toma
            </span>
          </div>
        </a>
        <a href="https://github.com/snaake20" target="_blank">
          <div id="plesky">
            <span className="credits-tooltip">Alexandru Pleșcan</span>
          </div>
        </a>
      </div>
      <p className="about-p">
        Mulțumesc celor trei pentru că m-au ajutat să înțeleg mai bine
        tehnologiile web și să realizez acest proiect!
      </p>
    </div>
  );
}
