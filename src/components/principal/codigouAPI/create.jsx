import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

import HeaderPrincipal from "../../../template/header";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const Create = () => {
  let token = localStorage.getItem("token");

  const [data, setData] = useState({
    idCodigoU: "",
    rfidDto: {
      idRfid: "",
    },
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  useEffect(() => {
    fetch(`${gatewayURL}/rfid/without`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData((prevData) => ({
          ...prevData,
          rfidDto: {},
        }));
      })
      .catch((error) => console.error(error));
  }, [token]);

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
    let url = `${gatewayURL}/codigou`;
    //console.log(data);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        switch (response.status) {
          case 201:
            return response.json();
          case 400:
            throw new Error("Revisar campos obligatorios.");
          case 404:
            throw new Error("El ID de RFID no se encuentra registrado.");
          case 409:
            throw new Error(
              "Un dato que se intenta registrar ya se encuentra vinculado a otra persona."
            );
          case 500:
            throw new Error("Error interno del servidor.");
          default:
            throw new Error("Algo salió mal.");
        }
      })
      .then((data) => {
        //console.log(data);
        setErrorMessage("Usuario registrado exitosamente.");
        audioOk.play();
        setTimeout(() => {
          navigate("/codigou");
        }, 2500);
      })
      .catch((error) => {
        audioError.play();
        console.error(error);
        setErrorMessage(error.message); // Establecer el mensaje de error
      });
  };

  const handlePaste = (event) => {
    const pastedData = event.target.value;
    setData((prevData) => ({
      ...prevData,
      rfidDto: {
        ...prevData.rfidDto,
        idRfid: pastedData,
      },
    }));
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
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  IdCodigoU*
                </label>
                <input
                  type="text"
                  name="idCodigoU"
                  value={data?.idCodigoU || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="ID Codigo U"
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => clearField("idCodigoU")}
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  x
                </button>
              </div>
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  IdRfid*
                </label>
                <input
                  type="text"
                  name="rfidDto.idRfid"
                  value={data?.rfidDto?.idRfid || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="ACERQUE EL CARNET"
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                  onKeyDown={(event) => {
                    if (!(event.ctrlKey && event.key === "v")) {
                      event.preventDefault();
                    }
                  }}
                  onInput={handlePaste}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={() => clearField("rfidDto.idRfid")}
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
                  }}
                >
                  Primer Nombre*
                </label>
                <input
                  type="text"
                  name="primerNombre"
                  value={data?.primerNombre || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Primer Nombre"
                  style={{
                    textTransform: "uppercase",
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
                  onClick={() => clearField("primerNombre")}
                >
                  x
                </button>
              </div>
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  name="segundoNombre"
                  value={data?.segundoNombre || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Segundo Nombre"
                  style={{
                    textTransform: "uppercase",
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
                  onClick={() => clearField("segundoNombre")}
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
                  }}
                >
                  Primer Apellido*
                </label>
                <input
                  type="text"
                  name="primerApellido"
                  value={data?.primerApellido || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Primer Apellido"
                  style={{
                    textTransform: "uppercase",
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
                  onClick={() => clearField("primerApellido")}
                >
                  x
                </button>
              </div>
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  name="segundoApellido"
                  value={data?.segundoApellido || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Segundo Apellido"
                  style={{
                    textTransform: "uppercase",
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
                  onClick={() => clearField("segundoApellido")}
                >
                  x
                </button>
              </div>
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                className="btn btn-success"
                style={{
                  margin: "5px",
                  width: "100px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setErrorMessage("");
                }}
              >
                Registrar
              </button>
              <a
                type="submit"
                className="btn btn-dark"
                href="/codigou"
                style={{
                  margin: "5px",
                  width: "100px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",
                }}
              >
                Salir
              </a>
            </div>
          </form>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Create;
