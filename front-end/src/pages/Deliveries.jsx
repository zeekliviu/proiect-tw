import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DOMAIN } from "../assets/constants/constants";
import Imagine from "../assets/images/deliveries.gif";
import Video_Placeholder from "../assets/images/video_placeholder.png";
import Link_Placeholder from "../assets/images/link_placeholder.png";
import "../styles/Deliveries.css";
import Button from "../components/Button";
import ScaleLoader from "react-spinners/ScaleLoader";

export default function Deliveries(props) {
  const navigate = useNavigate();
  const [userHasTeam, setUserHasTeam] = useState(false);
  const [userDeliveries, setUserDeliveries] = useState([]);
  const [userHasProject, setUserHasProject] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("logged_in")) {
      navigate("/login");
    } else {
      document.title = `${props.title} | ${DOMAIN}`;
      (async () => {
        await fetch("http://localhost:3000/api/profile-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        })
          .then((res) => res.json())
          .then(async (res) => {
            if (res.hasOwnProperty("project")) setUserHasProject(true);
            if (res.hasOwnProperty("team")) setUserHasTeam(true);
            await fetch("http://localhost:3000/api/get-deliveries", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            })
              .then((res) => res.json())
              .then((res) => {
                setUserDeliveries(res);
              })
              .finally(() => setLoading(false));
          });
      })();
    }
  }, [props.title]);

  const handlerLivrabil = async () => {
    navigate("/deliveries/new");
  };

  return (
    <>
      <img
        src={Imagine}
        alt="deliveries-bg"
        id="deliveries-bg"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "-1",
        }}
      />
      <div id="deliveries-container">
        <h1 id="deliveries-header">Livrabilele echipei tale</h1>
        {loading ? (
          <ScaleLoader color="#af49fe" height="45px" />
        ) : userHasTeam ? (
          userHasProject ? (
            userDeliveries.length === 0 ? (
              <>
                <p id="deliveries-not-present">
                  Echipa ta nu are livrabile definite.
                </p>
                <Button
                  className="deliveries-add-button"
                  onClick={handlerLivrabil}
                >
                  Adaugă un livrabil nou
                </Button>
              </>
            ) : (
              <>
                <table id="deliveries-table">
                  <thead>
                    <tr>
                      <th>Proprietar</th>
                      <th>Dată evaluare</th>
                      <th>Link</th>
                      <th>Video</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDeliveries.map((livrabil) => (
                      <tr key={livrabil.id}>
                        <td>{livrabil.autor}</td>
                        <td>{new Date(livrabil.date).toLocaleDateString()}</td>
                        <td>
                          {livrabil.link ? (
                            <a href={livrabil.link} target="_blank">
                              <img
                                className="deliveries-icon"
                                src={Link_Placeholder}
                              />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>
                          {livrabil.video ? (
                            <a
                              href={livrabil.video}
                              download={`video_demonstrativ_livrabil_${livrabil.id}`}
                            >
                              <img
                                className="deliveries-icon"
                                src={Video_Placeholder}
                              />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Button
                  className="deliveries-add-button"
                  onClick={handlerLivrabil}
                >
                  Adaugă un livrabil nou
                </Button>
              </>
            )
          ) : (
            <p id="deliveries-no-project">
              Echipa ta nu are un proiect. Mergi la{" "}
              <a id="deliveries-goto-profile" href="/profile">
                Profil
              </a>{" "}
              și adaugă unul!
            </p>
          )
        ) : (
          <p id="deliveries-no-team">
            Nu faci parte dintr-o echipă. Mergi la{" "}
            <a id="deliveries-goto-profile" href="/profile">
              Profil
            </a>{" "}
            și creează sau alătură-te uneia!
          </p>
        )}
      </div>
    </>
  );
}
