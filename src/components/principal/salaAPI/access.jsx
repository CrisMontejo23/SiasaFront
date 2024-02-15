import React, { useEffect, useState } from "react";

import { principalURL } from "../../../services/principal";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

import logoImage from "../../../assetss/img/logo1.png";
import carnetImage from "../../../assetss/img/carnet.png";
import BackgroundImage from "../../../assetss/img/background3.jpg";

const IngresoSala = () => {
  const [idRfid, setIdRfid] = useState("");
  const [status, setStatus] = useState(null);
  const [name, setName] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
        `${principalURL}/salacomputo/out/${event.target.value}`,
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
        setSelectedRoom(null);
        setStatus("Registro de salida creado exitosamente.");
        setTimeout(() => {
          setName("");
          setStatus("");
        }, 10000);
      } else if (response.status === 400) {
        // Si no ha ingresado, registrar un ingreso
        if (selectedRoom) {
          response = await fetch(
            `${principalURL}/salacomputo/${event.target.value}?salaDestino=${selectedRoom}`,
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
            setSelectedRoom(null);
            setStatus("Registro de ingreso creado exitosamente.");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          } else if (response.status === 404) {
            setName(null);
            setSelectedRoom(null);
            setStatus("El carnet no se encuentra registrado.");
            audioError.play();
            setIdRfid("");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          } else if (response.status === 500) {
            setName("");
            setSelectedRoom(null);
            setStatus("Error interno del servidor.");
            audioError.play();
            setIdRfid("");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          }
        } else {
          setName(null);
          setSelectedRoom(null);
          setStatus("Por favor, seleccione la sala.");
          audioError.play();
          setIdRfid("");
          setTimeout(() => {
            setName("");
            setStatus("");
          }, 10000);
        }
      } else if (response.status === 404) {
        setName(null);
        setSelectedRoom(null);
        setStatus("El carnet no se encuentra registrado.");
        audioError.play();
        setIdRfid("");
        setTimeout(() => {
          setName("");
          setStatus("");
        }, 10000);
      } else if (response.status === 409) {
        // Si no ha ingresado, registrar un ingreso
        if (selectedRoom) {
          response = await fetch(
            `${principalURL}/salacomputo/${event.target.value}?salaDestino=${selectedRoom}`,
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
            setSelectedRoom(null);
            setStatus("Registro de ingreso creado exitosamente.");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          } else if (response.status === 404) {
            setName(null);
            setSelectedRoom(null);
            setStatus("El carnet no se encuentra registrado.");
            audioError.play();
            setIdRfid("");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          } else if (response.status === 500) {
            setName("");
            setSelectedRoom(null);
            setStatus("Error interno del servidor.");
            audioError.play();
            setIdRfid("");
            setTimeout(() => {
              setName("");
              setStatus("");
            }, 10000);
          }
        } else {
          setName(null);
          setSelectedRoom(null);
          setStatus("Por favor, seleccione la sala.");
          audioError.play();
          setIdRfid("");
          setTimeout(() => {
            setName("");
            setStatus("");
          }, 10000);
        }
      } else if (response.status === 500) {
        setName("");
        setSelectedRoom(null);
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
                className="text"
                style={{
                  fontSize: "35px",
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: "white",
                  textShadow: "5px 5px 10px black",
                }}
              >
                REGISTRO SALAS DE CÓMPUTO
              </p>
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
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
                marginRight: status || name ? "50px" : "0",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                fontSize: "20px",
                textShadow: "5px 5px 5px black",
                position: "fixed",
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
              <img src={carnetImage} alt="Carnet" height={400} />
              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "B207" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    marginRight: "7px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("B207")}
                >
                  B207
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "B208" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    marginRight: "7px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("B208")}
                >
                  B208
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "B209" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    marginRight: "7px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("B209")}
                >
                  B209
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "B210" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    marginRight: "7px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("B210")}
                >
                  B210
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "B211" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    marginRight: "7px",
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("B211")}
                >
                  B211
                </button>
                <button
                  type="button"
                  className={`btn ${
                    selectedRoom === "GISTFA" ? "btn-danger" : "btn-success"
                  }`}
                  style={{
                    fontFamily: "sans-serif",
                    fontWeight: "bold",
                    boxShadow: "10px 10px 20px rgba(0, 0, 0, 1)",
                    fontSize: "23px",
                  }}
                  onClick={() => setSelectedRoom("GISTFA")}
                >
                  GISTFA
                </button>
              </div>
            </div>
            <div
              style={{
                display: "flex-start",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "5px",
                position: "", // Añadido
                right: "10px", // Añadido
                top: "50px", // Añadido
              }}
            >
              {name && (
                <div
                  className="alert alert-success"
                  role="alert"
                  style={{
                    width: "160px",
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
                    width: "160px",
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

export default IngresoSala;
