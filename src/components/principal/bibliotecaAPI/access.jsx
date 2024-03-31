import React, { useEffect, useState } from "react";

import { gatewayURL } from "../../../services/principal";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

import logoImage from "../../../assetss/img/logo1.png";
import carnetImage from "../../../assetss/img/carnet.png";
import BackgroundImage from "../../../assetss/img/background2.jpg";

const IngresoBiblioteca = () => {
  let token = localStorage.getItem("token");

  const [idRfid, setIdRfid] = useState("");
  const [status, setStatus] = useState(null);
  const [name, setName] = useState(null);

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  const handleInputChange = async (event) => {
    setIdRfid(event.target.value);

    if (event.target.value === "") {
      setName(null);
      setStatus(null);
      return;
    }

    try {
      const response = await fetch(
        `${gatewayURL}/biblioteca/${event.target.value}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const data = await response.json();
        //console.log(data);
        setName(
          data.codigoUDto.primerNombre +
            " " +
            data.codigoUDto.segundoNombre +
            " " +
            data.codigoUDto.primerApellido +
            " " +
            data.codigoUDto.segundoApellido
        );
        setStatus(
          `Registro de ingreso creado exitosamente. Bienvenido a la Biblioteca.`
        );
        audioOk.play();
        setIdRfid("");
        setTimeout(() => {
          setName(null);
          setStatus(null);
        }, 5000);
      } else if (response.status === 404) {
        setName(null);
        setStatus("El carnet no se encuentra registrado.");
        audioError.play();
        setIdRfid("");
        setTimeout(() => {
          setName(null);
          setStatus(null);
        }, 5000);
      } else if (response.status === 500) {
        setName(null);
        setStatus("Error interno del servidor.");
        setIdRfid("");
        setTimeout(() => {
          setName(null);
          setStatus(null);
        }, 5000);
      }
    } catch (error) {
      console.error(error);
      setIdRfid("");
      setName(null);
      setStatus("Error en la solicitud.");
    }

    if (event.target.value === "") {
      setIdRfid("");
      setName(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Si no es "ctrl + v", ignora el evento
      if (event.ctrlKey && event.key === "v") {
        document.getElementById("idRfid").focus();
      }
    };

    // Agrega el controlador de eventos al objeto window
    window.addEventListener("keydown", handleKeyDown);

    // Elimina el controlador de eventos cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImage}), linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7))`,
        backgroundBlendMode: "overlay",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
      }}
    >
      <React.Fragment>
        <div
          style={{
            display: "flex",
            height: "100vh",
            margin: "0",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div>
              <img
                src={logoImage}
                alt="Logo"
                style={{ margin: "20px 0" }}
                height={450}
              />
              <p
                class="text"
                style={{
                  fontSize: "35px",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "5px 5px 10px black",
                }}
              >
                REGISTRO BIBLIOTECA
              </p>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "sans-serif",
              fontWeight: "bold",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginRight: status || name ? "20px" : "0",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                fontSize: "20px",
                textShadow: "5px 5px 10px black",
              }}
            >
              <label htmlFor="idRfid">ACERQUE EL CARNET AL LECTOR</label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  height: "50px",
                }}
              >
                <input
                  type="password"
                  id="idRfid"
                  value={idRfid}
                  onChange={handleInputChange}
                  onBlur={() => document.getElementById("idRfid").blur()}
                  onKeyPress={(event) => event.preventDefault()} // Prevenir la entrada manual de datos
                />
              </div>
              <br />
              <img src={carnetImage} alt="Carnet" height={425} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "110px",
              }}
            >
              {name && (
                <div
                  class="alert alert-success"
                  role="alert"
                  style={{
                    width: "200px",
                    height: "auto",
                    margin: "0 auto",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    fontSize: "15px",
                    boxShadow: "0 0 7px white",
                  }}
                >
                  <p className="font-weight-bold">{name}</p>
                </div>
              )}
              <br />
              {status && (
                <div
                  className={`alert text-center ${
                    status.includes("exitosamente")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                  role="alert"
                  style={{
                    width: "200px",
                    height: "auto",
                    margin: "0 auto",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontFamily: "sans-serif",
                    fontSize: "15px",
                    boxShadow: "0 0 7px white",
                  }}
                >
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default IngresoBiblioteca;
