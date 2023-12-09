import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DOMAIN } from "../assets/constants/constants";
import "../styles/Profile.css";
import Button from "../components/Button";

export default function Profile(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    team: "",
    project: "",
    avatar: "",
  });
  const [afisareButon, setAfisareButon] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("logged_in")) {
      navigate("/login");
    } else {
      document.title = props.title + " | " + document.title;
      (async () => {
        await fetch("http://localhost:3000/api/profile-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
          .then((res) => res.json())
          .then((res) => {
            if (localStorage.getItem("calitate") === "student") {
              console.log(res.avatar);
              if (!res.hasOwnProperty("team")) setAfisareButon(true);
              setUserData({
                team: res.hasOwnProperty("team") ? res.team : "Nu ai echipă",
                project: res.hasOwnProperty("project")
                  ? res.project
                  : "Nu ai proiect",
                username: res.username,
                email: res.email,
                name: res.name,
                avatar: res.hasOwnProperty("avatar")
                  ? res.avatar
                  : "src/assets/images/avatar.png",
              });
            }
          });
      })();
    }
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);

  const uploadPhoto = () => {
    const image = document.createElement("input");
    image.type = "file";
    image.accept = "image/*";
    image.click();
    image.onchange = async () => {
      const reader = new FileReader();
      reader.readAsDataURL(image.files[0]);
      reader.onloadend = async () => {
        await fetch("http://localhost:3000/api/upload-avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: reader.result,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.message === "uploaded") {
              setUserData({ ...userData, avatar: reader.result });
            } else alert("A apărut o eroare");
          });
      };
    };
  };

  if (localStorage.getItem("calitate") === "student")
    return (
      <>
        <div id="profile-elements">
          <div
            id="profile-picture"
            onClick={uploadPhoto}
            style={{
              borderRadius: "10px",
              backgroundImage: `url("${userData.avatar}")`,
            }}
          ></div>
          <div id="profile-info-container">
            <div id="profile-username-div">
              Username: <span id="profile-username">{userData.username}</span>
            </div>
            <div id="profile-email-div">
              Email: <span id="profile-email">{userData.email}</span>
            </div>
            <div id="profile-name-div">
              Nume: <span id="profile-name">{userData.name}</span>
              <span
                id="profile-change-name"
                onClick={async () => {
                  const numeNou = prompt(
                    "Introduceti noul nume",
                    userData.name
                  );
                  if (numeNou === null || numeNou?.length === 0)
                    alert("Numele nu poate fi gol");
                  else {
                    await fetch("http://localhost:3000/api/change-name", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                      },
                      body: JSON.stringify({
                        name: numeNou,
                        calitate: "student",
                        username: username,
                      }),
                    })
                      .then((res) => res.json())
                      .then(async (res) => {
                        if (res.message === "updated") {
                          //TODO
                        } else alert("A apărut o eroare");
                      });
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                📝
              </span>
            </div>
            <div id="profile-team-div">
              Echipă: <span id="profile-team">{userData.team}</span>
              {"  "}
              {afisareButon && <Button>Creează</Button>}
            </div>
            <div id="profile-project-name">
              Proiect: <span id="project-name">{userData.project}</span>
            </div>
          </div>
        </div>
      </>
    );
}
