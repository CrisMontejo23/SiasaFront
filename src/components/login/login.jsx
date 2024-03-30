import React, { useState } from "react";
import "../../assetss/css/login/login.css";
import logo from "../../assetss/img/logo.png";
import { gatewayURL } from "../../services/principal";
import bgImage from "../../assetss/img/background4.jpg";
import { useNavigate } from "react-router-dom";

import soundOk from "../../assetss/sounds/ok.mp3";
import soundError from "../../assetss/sounds/error.mp3";

function Login() {
  const [form, setForm] = useState({ user: "", password: "" });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  const manejadorChange = async (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const manejadorSubmit = (e) => {
    e.preventDefault();
    let url = `${gatewayURL}/auth/login`;
    let data = {
      name: form.user,
      password: form.password,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          return fetch(`${gatewayURL}/auth/getroles?token=${data.token}`);
        } else {
          setError(true);
          setErrorMsg("Error en la autenticación");
          setTimeout(() => {
            setError(false);
            setForm({ user: "", password: "" });
          }, 2500);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          const role = data[0];
          console.log(role);
          audioOk.play();
          switch (role) {
            case "ROOT":
              navigate("/root/dashboard");
              break;
            case "ADMIN":
              navigate("/rfid");
              break;
            case "COMPUTO":
              navigate("/sala/access");
              break;
            case "BIBLIOTECA":
              navigate("/biblioteca/access");
              break;
            case "CAMPUS":
              navigate("/campus/access");
              break;
            case "LAB":
              navigate("/laboratorio/access");
              break;
            case "BIENESTAR":
              navigate("/prestamos/materialDeportivo/dashboard");
              break;
            default:
              setError(true);
              setErrorMsg("Error al iniciar sesión.");
          }
        } else {
          setError(true);
          setErrorMsg("No se encontraron roles para el usuario");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        audioError.play();
        setErrorMsg("Error al iniciar sesión.");
        setTimeout(() => {
          setError(false);
          setForm({ user: "", password: "" });
        }, 2500);
      });
  };

  return (
    <React.Fragment>
      <div
        style={{
          backgroundImage: `url(${bgImage}), linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7))`,
          backgroundBlendMode: "overlay",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100vh",
        }}
      >
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <div className="fadeIn first">
              <img src={logo} id="icon" alt="User Icon" />
            </div>

            <form onSubmit={manejadorSubmit}>
              <input
                type="text"
                className="fadeIn second"
                name="user"
                placeholder="Usuario"
                onChange={manejadorChange}
                value={form.user}
              />
              <input
                type="password"
                className="fadeIn third"
                name="password"
                placeholder="Contraseña"
                onChange={manejadorChange}
                value={form.password}
              />
              <input
                type="submit"
                className="fadeIn fourth"
                value="Ingresar"
                style={{ backgroundColor: "#28a745", color: "white" }}
              />
            </form>

            {error === true && (
              <div className="alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
