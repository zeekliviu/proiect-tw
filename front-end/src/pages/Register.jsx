import { useEffect } from "react";
import "../styles/Register.css";
import { DOMAIN } from "../assets/constants/constants";
import Imagine from "../assets/images/registration.gif";
import RegistrationForm from "../components/RegistrationForm";

export default function Register(props) {
  useEffect(() => {
    document.title = `${props.title} | ${DOMAIN}`;
  }, [props.title]);
  return (
    <>
      <img
        src={Imagine}
        alt="Register GIF"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "-1",
        }}
      ></img>
      <div className="register-container">
        <h1 className="register-header">Înregistrare</h1>
        <RegistrationForm />
      </div>
    </>
  );
}
