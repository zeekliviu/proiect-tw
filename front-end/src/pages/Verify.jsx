import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Verify.css";
import { DOMAIN } from "../assets/constants/constants";
import Button from "../components/Button";

export default function Verify(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/register");
    }
  }, []);

  useEffect(() => {
    document.title = `${props.title} | ${DOMAIN}`;
  }, [props.title]);

  const RESEND_CODE_TIME = 10;
  const location = useLocation();

  const [time, setTime] = useState(RESEND_CODE_TIME);

  let email = location.state?.email;

  const jwt = localStorage.getItem("jwt");

  const composeCode = () => {
    const inputs = document.getElementById("code-inputs").children;
    let code = "";
    for (let i = 0; i < inputs.length; i++) {
      code += inputs[i].value;
    }
    return code;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const resendCode = async () => {
    const response = await fetch(
      "http://localhost:3000/api/verify/resend-code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ email: email }),
      }
    );
    const data = await response.json();
    if (data.message === "sent") {
      setTime(RESEND_CODE_TIME);
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  const verifyCode = async () => {
    const code = composeCode();
    const response = await fetch("http://localhost:3000/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({ sent_code: code }),
    });
    const data = await response.json();
    switch (data.message) {
      case "no_match":
        alert("Codul introdus nu este corect.");
        break;
      case "no_token":
        alert("Token-ul nu este valid.");
        break;
      case "invalid":
        alert("Token-ul a expirat.");
        break;
      case "verified":
        localStorage.setItem("calitate", data.calitate);
        navigate("/profile-middleware", { state: { jwt: data.jwt } });
        break;
    }
  };

  const changeMail = async () => {
    const calitate = email.endsWith("@stud.ase.ro") ? "student" : "profesor";
    const oldEmail = email;
    email = prompt("Introdu noul email:");
    if (calitate === "student") {
      if (!email) {
        email = oldEmail;
      } else {
        while (!email.match(/^[a-zA-Z0-9._%+-]+@stud\.ase\.ro$/)) {
          email = prompt("Introdu un email valid:");
          if (!email) {
            email = oldEmail;
            break;
          }
        }
      }
    } else {
      if (!email) {
        email = oldEmail;
      } else {
        while (!newEmail.match(/^[a-zA-Z0-9._%+-]+@(ase\.ro|csie\.ase\.ro)$/)) {
          email = prompt("Introdu un email valid:");
          if (!email) {
            email = oldEmail;
            break;
          }
        }
      }
    }
    if (email === oldEmail) {
      return;
    } else {
      document.getElementById("verify-email-text").innerText = email;
    }
    const response = await fetch(
      "http://localhost:3000/api/verify/change-email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ email: email }),
      }
    );
    const data = await response.json();
    if (data.message === "changed") {
      alert("Codul a fost trimis la noul mail!");
    }
  };

  return (
    <>
      <div id="verify-page-container">
        <div className="verify-container">
          <div id="mail-info">
            <span id="verify-email-text">{email} </span>
            <span
              id="verify-edit-mail"
              onClick={changeMail}
              style={{ cursor: "pointer" }}
            >
              📝
            </span>
          </div>
          <h1 className="verify-header">Introdu codul</h1>
          <div id="code-inputs">
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
            <input
              type="text"
              name=""
              id=""
              className="code-input"
              maxLength={1}
            />
          </div>
          <div
            id="timer"
            onClick={() => {
              if (time < 0) resendCode();
            }}
            style={{
              textDecoration: time < 0 ? "underline" : "none",
              textDecorationColor: time < 0 ? "white" : "none",
              cursor: time < 0 ? "pointer" : "default",
            }}
          >
            {time < 0 ? "Trimite codul din nou" : `${time}s`}
          </div>
          <Button className="verify-button" onClick={verifyCode}>
            Verifică!
          </Button>
        </div>
      </div>
    </>
  );
}
