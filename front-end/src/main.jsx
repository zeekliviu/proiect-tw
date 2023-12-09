import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import NavigationMenu from "./components/NavigationMenu";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavigationMenu />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
