import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import About from "../pages/About";
import Register from "../pages/Register";
import Verify from "../pages/Verify";
import Profile from "../pages/Profile";
import Logout from "../components/Logout";
import Login from "../pages/Login";
import ProfileMiddleware from "../components/ProfileMiddleware";
import Projects from "../pages/Projects";
import Deliveries from "../pages/Deliveries";
import NewDelivery from "../components/NewDelivery";
import Grades from "../pages/Grades";

const routes = [
  { path: "/", element: <Home title="Acasă" /> },
  { path: "/about", element: <About title="Despre" /> },
  { path: "/register", element: <Register title="Înregistrare" /> },
  { path: "/verify", element: <Verify title="Verifică-ți mail-ul!" /> },
  { path: "/profile", element: <Profile title="Profil" /> },
  { path: "/profile-middleware", element: <ProfileMiddleware /> },
  { path: "/login", element: <Login title="Autentificare" /> },
  { path: "/projects", element: <Projects title="Proiecte" /> },
  { path: "/deliveries", element: <Deliveries title="Livrabile" /> },
  { path: "/deliveries/new", element: <NewDelivery title="Livrabil nou" /> },
  { path: "/logout", element: <Logout /> },
  { path: "/grades", element: <Grades title="Note" /> },
  { path: "*", element: <NotFound title="Inexistent" /> },
];

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
