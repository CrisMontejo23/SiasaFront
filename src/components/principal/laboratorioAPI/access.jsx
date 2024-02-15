import React, { useEffect, useState } from "react";

import { principalURL } from "../../../services/principal";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

import logoImage from "../../../assetss/img/logo1.png";
import carnetImage from "../../../assetss/img/carnet.png";
import BackgroundImage from "../../../assetss/img/background4.jpg";

const IngresoLaboratorio = () => {
  const [idRfid, setIdRfid] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");

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
      // Intentar registrar una salida
      let response = await fetch(
        `${principalURL}/laboratorio/out/${event.target.value}`,
        { method: "POST" }
      );

      if (response.status === 201) {
        audioOk.play();
        const data = await response.json();
        setName(
          data.codigoUDto.primerNombre +
            " " +
            data.codigoUDto.segundoNombre +
            " " +
            data.codigoUDto.primerApellido +
            " " +
            data.codigoUDto.segundoApellido
        );
        setIdRfid("");
        setStatus("Registro de salida creado exitosamente.");
        setTimeout(() => {
          setName("");
          setStatus("");
        }, 10000);
      } else if (response.status === 404) {
        setName(null);
        setStatus("El carnet no se encuentra registrado.");
        audioError.play();
        setIdRfid("");
        setTimeout(() => {
          setName("");
          setStatus("");
        }, 10000);
      } else if (response.status === 409 || response.status === 400) {
        // Si no ha ingresado, registrar un ingreso
        response = await fetch(
          `${principalURL}/laboratorio/${event.target.value}`,
          { method: "POST" }
        );
        if (response.status === 201) {
          audioOk.play();
          const data = await response.json();
          setName(
            data.codigoUDto.primerNombre +
              " " +
              data.codigoUDto.segundoNombre +
              " " +
              data.codigoUDto.primerApellido +
              " " +
              data.codigoUDto.segundoApellido
          );
          setIdRfid("");
          setStatus("Registro de ingreso creado exitosamente.");
          setTimeout(() => {
            setName("");
            setStatus("");
          }, 10000);
        } else if (response.status === 404) {
          setName(null);
          setStatus("El carnet no se encuentra registrado.");
          audioError.play();
          setIdRfid("");
          setTimeout(() => {
            setName("");
            setStatus("");
          }, 10000);
        } else if (response.status === 500) {
          setName("");
          setStatus("Error interno del servidor.");
          audioError.play();
          setIdRfid("");
          setTimeout(() => {
            setName("");
            setStatus("");
          }, 10000);
        }
      } else if (response.status === 500) {
        setName("");
        setStatus("Error interno del servidor.");
        audioError.play();
        setIdRfid("");
        setTimeout(() => {
          setName("");
          setStatus("");
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      setName(null);
      setStatus("Error en la solicitud.");
    }

    if (event.target.value === "") {
      setName(null);
      setStatus(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Si no es "ctrl + v", ignora el evento
      if (event.ctrlKey && event.key === "v") {
        const input = document.getElementById("idRfid");
        if (input.value === "") {
          input.focus();
        } else {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

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
                className="text"
                style={{
                  fontSize: "35px",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "5px 5px 10px black",
                }}
              >
                REGISTRO LABORATORIOS
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
                textShadow: "5px 5px 5px black",
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
                  onKeyPress={(event) => event.preventDefault()}
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
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
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
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
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

export default IngresoLaboratorio;
