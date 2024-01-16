import { useState } from "react";
import Button from "./Button";
import "../styles/RegistrationForm.css";
import { useNavigate } from "react-router-dom";
import { DOMAIN_NS } from "../assets/constants/constants";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    calitate: "student",
  });

  const navigate = useNavigate();

  const [disabled, setDisabled] = useState(true);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "calitate") {
      formData.calitate = value;
    } else setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validatePass = (value) => {
    if (value.length === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    if (value.length < 8) {
      return "Parola trebuie să conțină cel puțin 8 caractere.";
    }
    if (!value.match(/[A-Z]/)) {
      return "Parola trebuie să conțină cel puțin o literă mare.";
    }
    if (!value.match(/[a-z]/)) {
      return "Parola trebuie să conțină cel puțin o literă mică.";
    }
    if (!value.match(/[0-9]/)) {
      return "Parola trebuie să conțină cel puțin o cifră.";
    }
    if (!value.match(/[^a-zA-Z\d]/)) {
      return "Parola trebuie să conțină cel puțin un caracter special.";
    }
    return "";
  };

  const checkPass = (value) => {
    if (value !== formData.password) {
      return "Parolele nu coincid.";
    } else return "";
  };

  const validateUsername = (value) => {
    if (value.match(/^[0-9]/)) {
      return "Username-ul nu poate începe cu cifre.";
    }
    if (value.match(/[A-Z]/)) {
      return "Username-ul nu trebuie să conțină litere mari.";
    }
    if (value.length < 5) {
      return "Username-ul trebuie să conțină cel puțin 5 caractere.";
    }
    return "";
  };

  const validateEmail = (value) => {
    if (value.length === 0) return "";
    if (formData.calitate === "student") {
      if (!value.match(/^[a-zA-Z0-9._%+-]+@stud\.ase\.ro$/))
        return "Email-ul trebuie să fie de forma: nume@stud.ase.ro";
    } else {
      if (
        !value.match(/^[a-zA-Z0-9._%+-]+@(ase\.ro|csie\.ase\.ro|ie\.ase\.ro)$/)
      )
        return "Email-ul trebuie să fie de forma: nume@[ase.ro|csie.ase.ro|ie.ase.ro]";
    }
    return "";
  };

  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "username":
        setErrors({
          ...errors,
          username: validateUsername(value),
        });
        break;
      case "password":
        setErrors({
          ...errors,
          password: validatePass(value),
        });
        break;
      case "confirmPassword":
        setErrors({
          ...errors,
          confirmPassword: checkPass(value),
        });
        break;
      case "email":
        setErrors({
          ...errors,
          email: validateEmail(value),
        });
        break;
      case "calitate":
        setErrors({
          ...errors,
          email: validateEmail(formData.email),
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Parolele nu coincid." });
      return;
    }
    if (!Object.values(errors).every((x) => x === "")) {
      return;
    }
    const data = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      calitate: formData.calitate,
    };

    const registerReq = await fetch(`${DOMAIN_NS}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await registerReq.json();
    switch (res) {
      case "username":
        setErrors({ ...errors, username: "Username-ul este deja folosit." });
        break;
      case "email":
        setErrors({ ...errors, email: "Email-ul este deja folosit." });
        break;
      default:
        localStorage.setItem("jwt", res.jwt);
        navigate("/verify", { state: { email: formData.email } });
        break;
    }
  };

  return (
    <form id="register-form" onSubmit={handleSubmit}>
      <label className="register-label" htmlFor="username">
        Username:
      </label>
      <input
        id="username"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        className="register-input"
        autoComplete="username"
        required
      />
      {errors.username && <span className="error-text">{errors.username}</span>}

      <label className="register-label" htmlFor="password">
        Password:
      </label>
      <input
        id="password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        className="register-input"
        autoComplete="new-password"
        required
      />
      {errors.password && <span className="error-text">{errors.password}</span>}

      <label className="register-label" htmlFor="confirmPassword">
        Confirm Password:
      </label>
      <input
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        disabled={disabled}
        onChange={handleChange}
        className="register-input"
        value={formData.confirmPassword}
        autoComplete="new-password"
        required
      />
      {errors.confirmPassword && (
        <span className="error-text">{errors.confirmPassword}</span>
      )}

      <label className="register-label" htmlFor="email">
        Email:
      </label>
      <input
        id="email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="register-input"
        autoComplete="email"
        required
      />
      <span className="error-text">
        {errors.email && <span className="error-text">{errors.email}</span>}
      </span>
      <label className="register-label" htmlFor="calitate">
        Calitate:
      </label>
      <select
        name="calitate"
        id="calitate"
        className="register-input"
        style={{ height: "4vh" }}
        onChange={handleChange}
        required
      >
        <option value="student">Student</option>
        <option value="profesor">Profesor</option>
      </select>
      <Button type="submit" style={{ fontSize: "30px", marginTop: "2vh" }}>
        Trimite
      </Button>
    </form>
  );
}
