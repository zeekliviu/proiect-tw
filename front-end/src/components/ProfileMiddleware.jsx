import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProfileMiddleware() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem("logged_in", true);
    localStorage.setItem("jwt", location.state.jwt);
    window.location.reload();
    navigate("/profile");
  }, []);
}
