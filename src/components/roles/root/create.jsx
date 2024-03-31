import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

import HeaderPrincipal from "../../../template/header";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const Create = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let url = `${gatewayURL}/auth/create`;
    //console.log(data);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        switch (response.status) {
          case 201:
            return response.json();
          case 400:
            throw new Error(
              "La contraseña no cumple con el requisito minimo (8 caracteres, una mayúscula, un número y un caracter especial)."
            );
          case 409:
            throw new Error(
              "Nombre de usuario o Email ya se encuentran en uso."
            );
          case 500:
            throw new Error("Error interno del servidor.");
          default:
            throw new Error("Algo salió mal.");
        }
      })
      .then((data) => {
        //console.log(data);
        setErrorMessage("Usuario creado exitosamente.");
        audioOk.play();
        setTimeout(() => {
          navigate("/root/dashboard");
        }, 2500);
      })
      .catch((error) => {
        audioError.play();
        //console.error(error);
        setErrorMessage(error.message); // Establecer el mensaje de error
      });
  };  

  const clearField = (field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: "",
        },
      }));
    } else {
      setData({ ...data, [field]: "" });
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <React.Fragment>
        <HeaderPrincipal />
        <br />
        {errorMessage && (
          <div
            className={`alert text-center ${
              errorMessage.includes("exitosamente")
                ? "alert-success"
                : "alert-danger"
            }`}
            role="alert"
            style={{ width: "350px", margin: "0 auto" }}
          >
            {errorMessage}
          </div>
        )}
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ width: "50%", marginLeft: "25%" }}
          >
            <div className="row">
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Nombre*
                </label>
                <input
                  type="text"
                  name="name"
                  value={data?.name || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nombre"
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => clearField("name")}
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  x
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                    width: "auto",
                  }}
                >
                  Correo Electrónico*
                </label>
                <input
                  type="text"
                  name="email"
                  value={data?.email || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="EMAIL"
                  style={{
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => clearField("password")}
                >
                  x
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                    width: "auto",
                  }}
                >
                  Contraseña*
                </label>
                <input
                  type="text"
                  name="password"
                  value={data?.password || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Contraseña"
                  style={{                    
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => clearField("password")}
                >
                  x
                </button>
              </div>
            </div>
            <br />
          </form>
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginRight: "25%",
            }}
          >
            <button
              type="submit"
              className="btn btn-success"
              style={{
                margin: "5px",
                width: "130px",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                fontWeight: "bold",
              }}
              onClick={(event) => {
                handleSubmit(event);
                setErrorMessage("");
              }}
            >
              Crear
              <img
                src={require("../../../assetss/img/add-user.png")}
                alt="Reload"
                width="25"
                height="25"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              />
            </button>
            <a
              type="submit"
              className="btn btn-dark"
              href="/root/dashboard"
              style={{
                margin: "5px",
                width: "130px",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                fontWeight: "bold",
              }}
            >
              Regresar
              <img
                src={require("../../../assetss/img/turn-back.png")}
                alt="Reload"
                width="25"
                height="25"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              />
            </a>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Create;
