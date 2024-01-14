import { useEffect, useState } from "react";
import { DOMAIN } from "../assets/constants/constants";
import "../styles/Projects.css";
import forbidImg from "../assets/images/403.gif";
import noDataImg from "../assets/images/no_data.gif";
import fetchingImg from "../assets/images/fetching.gif";
import gradesImg from "../assets/images/grades.gif";
import ClockLoader from "react-spinners/ClockLoader";
import { useNavigate } from "react-router-dom";
import Video_Placeholder from "../assets/images/video_placeholder.png";
import Link_Placeholder from "../assets/images/link_placeholder.png";
import { esteTrecut, estePrezent, esteViitor } from "../utils/utils";

const JuryComponent = ({ juryDeliveries }) => {
  const [hiddenError, setHiddenError] = useState(false);

  const handleSubmit = async (e) => {
    if (e.key === "Enter") {
      if (e.target.value === "") {
        alert("Nu ai completat nota!");
        return;
      } else if (e.target.value < 1 || e.target.value > 10) {
        alert("Nota trebuie sa fie intre 1 si 10!");
        return;
      }
      await fetch("http://localhost:3000/api/grade-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          partID:
            juryDeliveries[e.target.parentNode.parentNode.rowIndex - 1].id,
          grade: parseFloat(e.target.value),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.hasOwnProperty("error")) {
            setHiddenError(true);
          } else {
            document
              .querySelector("tbody")
              .removeChild(e.target.parentNode.parentNode);
            alert("Livrabilul a fost notat cu succes!");
          }
        });
    }
  };

  return (
    <>
      <div id="jury-container">
        <div id="jury-heading">Livrabilele pe care le ai de evaluat</div>
        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Link</th>
              <th>Video</th>
              <th>Notă acordată</th>
            </tr>
          </thead>
          <tbody>
            {juryDeliveries.map((juryDelivery) => {
              return (
                <tr key={juryDelivery.id}>
                  <td>{new Date(juryDelivery.date).toLocaleDateString()}</td>
                  <td>
                    {juryDelivery.link ? (
                      <a
                        href={juryDelivery.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={Link_Placeholder}
                          className="deliveries-icon"
                          alt=""
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {juryDelivery.video ? (
                      <a
                        href={juryDelivery.video}
                        download={`video_demonstrativ_livrabil_${juryDelivery.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={Video_Placeholder}
                          alt=""
                          className="deliveries-icon"
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      name="grade-given"
                      className="grade-given"
                      min="1"
                      max="10"
                      step="0.01"
                      placeholder="10"
                      onChange={() => setHiddenError(false)}
                      onKeyDown={handleSubmit}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {hiddenError && (
          <p id="error-grading">Nu mai poți nota acest livrabil!</p>
        )}
      </div>
    </>
  );
};

const TabelLivrabile = ({ livrabile }) => {
  return (
    <table className="deliveries-table">
      <thead>
        <tr>
          <th>Autor</th>
          <th>Data</th>
          <th>Link</th>
          <th>Video</th>
          <th>Notă</th>
        </tr>
      </thead>
      <tbody>
        {livrabile.map((livrabil, index) => {
          return (
            <tr key={index}>
              <td>{livrabil.autor}</td>
              <td>{new Date(livrabil.date).toLocaleDateString()}</td>
              <td>
                {livrabil.link ? (
                  <a href={livrabil.link} target="_blank" rel="noreferrer">
                    <img
                      src={Link_Placeholder}
                      className="deliveries-icon"
                      alt=""
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
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={Video_Placeholder}
                      alt=""
                      className="deliveries-icon"
                    />
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td>{livrabil.nota !== 0 ? livrabil.nota : "N/A"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const Helper = ({ userData, juryDeliveries }) => {
  const { hasTeam, hasProject, livrabile } = userData;

  let juryTable = <></>;
  let teamNoProject = <></>;
  let projectNoDeliveries = <></>;
  if (juryDeliveries.length !== 0) {
    juryTable = <JuryComponent juryDeliveries={juryDeliveries} />;
  }

  if (!hasProject && hasTeam)
    teamNoProject = (
      <div className="projects-fetcher-heading">
        Nu ai un proiect! Atunci când vei avea un proiect, vei putea adăuga
        livrabile.
      </div>
    );
  if (hasProject && livrabile.length === 0)
    projectNoDeliveries = (
      <div className="projects-fetcher-heading">
        Nu ai livrabile! Mergi la{" "}
        <a href="/deliveries" id="deliveries-goto-link">
          Livrabile
        </a>{" "}
        pentru a adăuga un livrabil.
      </div>
    );
  else if (livrabile.length !== 0)
    projectNoDeliveries = (
      <div className="deliveries-container">
        <div id="livrabileTrecute">
          <h1 id="past-deliveries-heading">Livrabilele evaluate</h1>
          {livrabile.filter(esteTrecut).length !== 0 ? (
            <TabelLivrabile livrabile={livrabile.filter(esteTrecut)} />
          ) : (
            <div className="missing-heading">Nu ai livrabile evaluate!</div>
          )}
        </div>
        <div id="livrabilePrezente">
          <h1 id="present-deliveries-heading">Livrabilele scadente</h1>
          {livrabile.filter(estePrezent).length !== 0 ? (
            <TabelLivrabile livrabile={livrabile.filter(estePrezent)} />
          ) : (
            <div className="missing-heading">
              Nu ai livrabile scadente astăzi!
            </div>
          )}
        </div>
        <div id="livrabileViitoare">
          <h1 id="future-deliveries-heading">Livrabilele viitoare</h1>
          {livrabile.filter(esteViitor).length !== 0 ? (
            <TabelLivrabile livrabile={livrabile.filter(esteViitor)} />
          ) : (
            <div className="missing-heading">
              Nu ai livrabile scadente astăzi!
            </div>
          )}
        </div>
      </div>
    );
  return (
    <>
      {juryTable}
      {teamNoProject}
      {projectNoDeliveries}
    </>
  );
};

export default function Projects(props) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    hasTeam: undefined,
    hasProject: undefined,
    livrabile: [],
  });
  const [srcImg, setSrcImg] = useState(fetchingImg);
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState("Se aduc datele de pe server...");
  const [juryDeliveries, setJuryDeliveries] = useState([]);

  useEffect(() => {
    document.title = `${props.title} | ${DOMAIN}`;
  }, [props.title]);

  useEffect(() => {
    const fetchUserData = async () => {
      const profileRes = await fetch("http://localhost:3000/api/profile-info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });
      const profileData = await profileRes.json();
      if (profileData.hasOwnProperty("error")) {
        setSrcImg(forbidImg);
        setHeading("Accesul interzis!");
        setLoading(false);
      } else {
        if (profileData.team && profileData.project) {
          const deliveriesRes = await fetch(
            "http://localhost:3000/api/get-deliveries",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          );
          const deliveriesData = await deliveriesRes.json();
          if (deliveriesData.hasOwnProperty("error")) {
            setSrcImg(noDataImg);
            setHeading("Nu ai livrabile!");
          } else {
            setSrcImg(gradesImg);
            setUserData({
              hasTeam: true,
              hasProject: true,
              livrabile: deliveriesData,
            });
          }
        } else {
          setUserData({
            hasTeam: profileData.team,
            hasProject: profileData.project,
            livrabile: [],
          });
        }
        const juryRes = await fetch(
          "http://localhost:3000/api/get-jury-deliveries",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        const juryData = await juryRes.json();
        if (juryData.hasOwnProperty("error")) {
          setJuryDeliveries([]);
          setSrcImg(noDataImg);
        } else {
          setJuryDeliveries(juryData);
          setSrcImg(gradesImg);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <img
        src={srcImg}
        alt=""
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
        }}
      />
      <div id="projects-container">
        {loading ? (
          <>
            <ClockLoader size={180} color="#af49fe" id="clock-loader" />
            <div id="projects-fetcher-heading">{heading}</div>
          </>
        ) : (
          <Helper userData={userData} juryDeliveries={juryDeliveries} />
        )}
      </div>
    </>
  );
}
