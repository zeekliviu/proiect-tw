import { useEffect } from "react";
import { DOMAIN } from "../assets/constants/constants";
import Button from "../components/Button";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  useEffect(() => {
    if (localStorage.getItem("logged_in")) navigate("/profile");
    else document.title = `${props.title} | ${DOMAIN}`;
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);

  const navigate = useNavigate();

  const handleLogon = async (e) => {
    e.preventDefault();
    const error = document.getElementById("login-error");
    error.innerHTML = "";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    switch (data.message) {
      case "not_verified":
        localStorage.setItem("jwt", data.jwt);
        navigate("/verify", { state: { email: email } });
        break;
      case "wrong_credentials":
        error.innerHTML = "Email sau parolă greșită!";
        break;
      case "logged_in":
        localStorage.setItem("calitate", data.calitate);
        navigate("/profile-middleware", { state: { jwt: data.jwt } });
        break;
    }
  };
  return (
    <>
      <div className="login-container">
        <h1 className="login-header">Autentificare</h1>
        <span id="login-error"></span>
        <form className="login-form" onSubmit={handleLogon}>
          <input
            type="text"
            name="email"
            id="email"
            className="login-input"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            id="password"
            className="login-input"
            placeholder="Parolă"
            required
          />
          <Button type="submit" className="login-send">
            Autentifică-mă!
          </Button>
        </form>
      </div>
    </>
  );
}
