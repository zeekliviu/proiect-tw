import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("logged_in");
    localStorage.removeItem("calitate");
    localStorage.removeItem("jwt");
    navigate("/");
  }, []);
  return <></>;
}
