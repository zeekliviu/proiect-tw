import "../styles/Grades.css";
import { DOMAIN } from "../assets/constants/constants";
import { useEffect, useState } from "react";
import SyncLoader from "react-spinners/SyncLoader";
import liveImg from "../assets/images/now.gif";
import Video_Placeholder from "../assets/images/video_placeholder.png";
import Link_Placeholder from "../assets/images/link_placeholder.png";

const RenderComponent = () => {
  const [proiecteRender, setProiecteRender] = useState(<></>);
  const [loading, setLoading] = useState(false);
  const handleFetch = async () => {
    let start = document.getElementById("grades-start").value;
    let stop = document.getElementById("grades-stop").value;
    if (start === "" || stop === "") {
      alert("Selectează intervalul!");
      return;
    }
    if (start > stop) {
      let aux = start;
      start = stop;
      stop = aux;
    }
    setLoading(true);
    const response = await fetch("http://localhost:3000/api/proiecte", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ start, stop }),
    });
    const data = await response.json();
    if (Object.keys(data).length !== 0) {
      setProiecteRender(
        <>
          {Object.keys(data).map((echipa, index) => {
            return (
              <div key={index}>
                <h1 className="team-results-name">
                  Echipa {echipa}, Proiectul {data[echipa].projectName}
                </h1>
                <table className="team-results-table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Link</th>
                      <th>Video</th>
                      <th>Notă livrabil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data[echipa].parts.map((part) => {
                      return (
                        <tr key={part.id}>
                          <td>{part.date}</td>
                          <td>
                            {part.link ? (
                              <a
                                href={part.link}
                                target="_blank"
                                rel="noreferrer"
                              >
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
                            {part.video ? (
                              <a
                                href={part.video}
                                target="_blank"
                                rel="noreferrer"
                                download={`video_demonstrativ_livrabil_${part.id}`}
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
                          <td>{part.grade ? part.grade : "N/A"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <h2 className="average-team-results">
                  Medie proiect:{" "}
                  {data[echipa].average ? data[echipa].average : "N/A"}
                </h2>
              </div>
            );
          })}
        </>
      );
    } else {
      setProiecteRender(
        <div id="grades-no-grades">
          <h1>Nu există note în intervalul selectat.</h1>
        </div>
      );
    }
    setLoading(false);
  };
  return (
    <>
      <div id="grades-projects-container">
        <div id="grades-interval-container">
          <label>
            <span id="grades-interval-label">Interval:</span>
            <input
              type="date"
              name=""
              id="grades-start"
              className="grades-input-date"
              min={new Date().toISOString().split("T")[0]}
            />
            <input
              type="date"
              name=""
              id="grades-stop"
              className="grades-input-date"
              min={new Date().toISOString().split("T")[0]}
            />
          </label>
          <button onClick={handleFetch} id="grades-search-button">
            Caută!
          </button>
        </div>
      </div>
      <SyncLoader size={40} color="#af49fe" loading={loading} />
      {proiecteRender}
    </>
  );
};

export default function Grades(props) {
  useEffect(() => {
    document.title = props.title + " | " + document.title;
    return () => {
      document.title = DOMAIN;
    };
  }, [props.title]);

  return (
    <>
      <img
        src={liveImg}
        alt=""
        id="grades-bg"
        style={{
          position: "fixed",
          zIndex: "-1",
          width: "100%",
          height: "100%",
        }}
      />
      <div id="grades-container">
        <h1 id="grades-main-heading">Notele proiectelor</h1>
        <RenderComponent />
      </div>
    </>
  );
}
