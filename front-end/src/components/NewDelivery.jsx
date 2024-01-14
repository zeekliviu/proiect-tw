import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DOMAIN } from "../assets/constants/constants";
import Imagine from "../assets/images/new_delivery.gif";
import Button from "./Button";
import "../styles/NewDelivery.css";

export default function NewDelivery(props) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("logged_in")) {
      navigate("/login");
    } else {
      document.title = `${props.title} | ${DOMAIN}`;
    }
  }, [props.title]);
  const dateMin = new Date()
    .toLocaleDateString()
    .split(",")[0]
    .split(".")
    .reverse()
    .join("-");
  let dateMax = new Date();
  dateMax.setDate(dateMax.getDate() + 30);
  dateMax = dateMax
    .toLocaleDateString()
    .split(",")[0]
    .split(".")
    .reverse()
    .join("-");

  const handleSend = async (e) => {
    e.preventDefault();
    const link = document.getElementById("new-delivery-link").value;
    const video = document.getElementById("new-delivery-video").files[0];
    const date = document.getElementById("new-delivery-date").value;
    if (link.length === 0 && !video) {
      setError("Trebuie să adaugi cel puțin un link sau un video!");
      return;
    }
    if (date.length === 0) {
      setError("Trebuie să adaugi data!");
      return;
    }
    if (
      link.length > 0 &&
      !link.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
      )
    ) {
      setError("Introdu un link valid!");
      return;
    }
    if (video && (video.size / 1024 / 1024).toFixed(4) > 50) {
      setError("Video-ul nu poate avea mai mult de 50 MB!");
      return;
    }
    const object = {};
    object.date = date;
    if (link.length > 0) object.link = link;
    if (video) {
      const reader = new FileReader();
      reader.readAsDataURL(video);
      reader.onload = () => {
        object.video = reader.result;
      };
    } else object.hasVideo = false;
    await fetch("http://localhost:3000/api/new-delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify(object),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.message === "success") {
          if (object.hasOwnProperty("video")) {
            await fetch("http://localhost:3000/api/upload-video", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                PartID: res.partID,
              },
              body: object.video,
            })
              .then((res) => res.json())
              .then((res) => {
                if (res.message === "uploaded") navigate("/deliveries");
                else alert("A apărut o eroare");
              });
          } else navigate("/deliveries");
        } else alert(res.message);
      });
  };

  const [error, setError] = useState("");
  return (
    <>
      <img
        src={Imagine}
        alt="New Delivery GIF"
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          zIndex: "-1",
        }}
      />
      <div id="add-new-delivery-container">
        <form id="new-delivery-form">
          <label
            htmlFor="new-delivery-link"
            className="new-delivery-form-label"
          >
            Link resursă
          </label>
          <input
            type="text"
            name=""
            id="new-delivery-link"
            placeholder="https://google.ro"
            onChange={() => setError("")}
            style={{ fontFamily: "TT Interphases Pro Monospaced" }}
          />
          <label
            htmlFor="new-delivery-video"
            className="new-delivery-form-label"
          >
            Video
          </label>
          <input
            type="file"
            name=""
            id="new-delivery-video"
            accept="video/*"
            onChange={() => setError("")}
            style={{
              fontFamily: "TT Interphases Pro Monospaced",
              color: "blue",
              fontWeight: "bold",
            }}
          />
          <label
            htmlFor="new-delivery-date"
            className="new-delivery-form-label"
          >
            Data
          </label>
          <input
            type="date"
            name=""
            id="new-delivery-date"
            min={dateMin}
            max={dateMax}
            onChange={() => setError("")}
            style={{ fontFamily: "TT Interphases Pro Monospaced" }}
          />
          <span id="new-delivery-error-message">{error}</span>
          <Button
            type="submit"
            onClick={handleSend}
            style={{ fontSize: "1.5rem" }}
          >
            Trimite
          </Button>
        </form>
      </div>
    </>
  );
}
