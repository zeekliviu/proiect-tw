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

  const [afisareButonCreareEchipa, setAfisareButonCreareEchipa] =
    useState(false);
  const [afisareButonAlaturareEchipa, setAfisareButonAlaturareEchipa] =
    useState(false);
  const [afisareButonCreareProiect, setAfisareButonCreareProiect] =
    useState(false);
  const [student, setStudent] = useState(false);

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
              setStudent(true);
              if (!res.hasOwnProperty("team")) {
                setAfisareButonCreareEchipa(true);
                setAfisareButonAlaturareEchipa(true);
              }
              if (res.hasOwnProperty("team"))
                setAfisareButonCreareProiect(true);
              if (res.hasOwnProperty("project"))
                setAfisareButonCreareProiect(false);
              setUserData({
                team: res.hasOwnProperty("team") ? res.team : "Nu ai echipă",
                project: res.hasOwnProperty("project")
                  ? res.project
                  : "Nu ai proiect",
                username: res.username,
                email: res.email,
                name: res.name,
                avatar:
                  res.avatar !== null
                    ? res.avatar
                    : "src/assets/images/avatar.png",
              });
            } else
              setUserData({
                username: res.username,
                email: res.email,
                name: res.name,
                avatar:
                  res.avatar !== null
                    ? res.avatar
                    : "src/assets/images/avatar.png",
              });
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

  const handleCreateTeam = async () => {
    const teamName = prompt("Introduceti numele echipei");
    if (teamName === null || teamName?.length === 0)
      alert("Numele echipei nu poate fi gol");
    else {
      await fetch("http://localhost:3000/api/create-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ name: teamName }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "created") {
            setUserData({ ...userData, team: teamName });
            setAfisareButonCreareEchipa(false);
            setAfisareButonAlaturareEchipa(false);
            setAfisareButonCreareProiect(true);
          } else if (res.message === "exists")
            alert("Echipa există deja! Alege alt nume");
          else alert("A apărut o eroare");
        });
    }
  };

  const handleJoinTeam = async () => {
    const teamName = prompt("Introduceti numele echipei");
    if (teamName === null || teamName?.length === 0)
      alert("Numele echipei nu poate fi gol");
    else {
      await fetch("http://localhost:3000/api/join-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ name: teamName }),
      })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.message === "joined") {
            setAfisareButonCreareEchipa(false);
            setAfisareButonAlaturareEchipa(false);
            await fetch("http://localhost:3000/api/profile-info", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.hasOwnProperty("project")) {
                  setAfisareButonCreareProiect(false);
                  setUserData({
                    ...userData,
                    project: res.project,
                    team: res.team,
                  });
                } else {
                  setUserData({ ...userData, team: res.team });
                  setAfisareButonCreareProiect(true);
                }
              });
          } else if (res.message === "not found") alert("Echipa nu există");
          else alert("A apărut o eroare");
        });
    }
  };

  const handleCreateProject = async () => {
    const projectName = prompt("Introduceti numele proiectului");
    if (projectName === null || projectName?.length === 0)
      alert("Numele proiectului nu poate fi gol");
    else {
      await fetch("http://localhost:3000/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ name: projectName }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.message === "created") {
            setUserData({ ...userData, project: projectName });
            setAfisareButonCreareProiect(false);
          } else alert("A apărut o eroare");
        });
    }
  };

  return (
    <>
      <div id="profile-elements">
        <div
          id="profile-picture"
          onClick={uploadPhoto}
          style={{
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
                const numeNou = prompt("Introduceti noul nume", userData.name);
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
                      calitate: localStorage.getItem("calitate"),
                      username: userData.username,
                    }),
                  })
                    .then((res) => res.json())
                    .then(async (res) => {
                      if (res.message === "updated") {
                        setUserData({ ...userData, name: numeNou });
                      } else alert("A apărut o eroare");
                    });
                }
              }}
              style={{ cursor: "pointer" }}
            >
              📝
            </span>
          </div>
          {student && (
            <>
              <div id="profile-team-div">
                Echipă: <span id="profile-team">{userData.team}</span>
                {"  "}
                {afisareButonCreareEchipa && (
                  <Button onClick={handleCreateTeam}>Creează</Button>
                )}{" "}
                {afisareButonAlaturareEchipa && (
                  <Button onClick={handleJoinTeam}>Alătură-te</Button>
                )}
              </div>
              <div id="profile-project-name">
                Proiect: <span id="project-name">{userData.project}</span>{" "}
                {afisareButonCreareProiect && (
                  <Button onClick={handleCreateProject}>Creează</Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
