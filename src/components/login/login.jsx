import React, { useState } from "react";
import "../../assetss/css/login/login.css";
import logo from "../../assetss/img/logo.png";
import { gatewayURL } from "../../services/principal";
import { useNavigate } from "react-router-dom";

import soundOk from "../../assetss/sounds/ok.mp3";
import soundError from "../../assetss/sounds/error.mp3";

import bgImage from "../../assetss/img/background4.jpg";
import showIcon from "../../assetss/img/show.png";
import hideIcon from "../../assetss/img/hide.png";

function Login() {
  const [form, setForm] = useState({ user: "", password: "" });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        if (response.status === 401) {
          setError(true);
          setErrorMsg("Usuario o contraseña incorrectos.");
          setTimeout(() => {
            setError(false);
          }, 2500);
        } else if (response.status === 500) {
          setError(true);
          setErrorMsg("Error en el servidor.");
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        //console.log(data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          return fetch(`${gatewayURL}/auth/getroles?token=${data.token}`);
        } else {
          setError(true);
          setErrorMsg("Error en la autenticación");
          setTimeout(() => {
            setError(false);
          }, 2500);
        }
      })
      .then((response) => response.json())
      .then((data) => {
        audioOk.play();
        if (data.includes("ROOT")) {
          navigate("/root/dashboard");
        } else if (data.includes("ADMIN")) {
          navigate("/rfid");
        } else if (data.includes("COMPUTO")) {
          navigate("/sala/access");
        } else if (data.includes("BIBLIOTECA")) {
          navigate("/biblioteca/access");
        } else if (data.includes("CAMPUS")) {
          navigate("/campus/access");
        } else if (data.includes("LAB")) {
          navigate("/laboratorio/access");
        } else if (data.includes("BIENESTAR")) {
          navigate("/prestamos/materialDeportivo/dashboard");
        } else {
          setError(true);
          setErrorMsg("Error al iniciar sesión.");
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        audioError.play();
        setTimeout(() => {
          setError(false);
        }, 2500);
      });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="fadeIn third"
                  name="password"
                  placeholder="Contraseña"
                  onChange={manejadorChange}
                  value={form.password}
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={showPassword ? hideIcon : showIcon}
                    alt={showPassword ? "Ocultar" : "Mostrar"}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "30px",
                    }} // Ajusta el tamaño de la imagen
                  />
                </button>
              </div>
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
