import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

import HeaderPrincipal from "../../../template/header";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const UpdateObject = () => {
  const location = useLocation();
  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);
  const objectData = location.state.objectData;
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    idMaterialDeportivo: objectData.idMaterialDeportivo,
    nombre: objectData.nombre,
    descripcion: objectData.descripcion,
    disponible: objectData.disponible,
  });

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value.toUpperCase(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedData = {
      nombre: data.nombre,
      descripcion: data.description,
      disponible: data.disponible,
    };

    try {
      const response = await fetch(
        `${gatewayURL}/materialdeportivo/update/${data.idMaterialDeportivo}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el material deportivo");
      }

      const responseData = await response.json();
      setErrorMessage(
        `Material deportivo ${responseData.nombre} actualizado exitosamente.`
      );
      audioOk.play();
      setTimeout(() => {
        navigate("/prestamos/materialDeportivo/dashboard");
      }, 2500);
    } catch (error) {
      audioError.play();
      setErrorMessage(error.message);
    }
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
        <p
          className="text"
          style={{
            fontSize: "35px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
          }}
        >
          ACTUALIZAR MATERIAL DEPORTIVO
        </p>
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
                  Nombre*
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={data?.nombre || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Nombre Objeto"
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
                  onClick={() => clearField("nombre")}
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
                  Descripción
                </label>
                <input
                  type="text"
                  name="description"
                  value={data?.description || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Descripción del objeto"
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
                  onClick={() => clearField("description")}
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
                  Disponibles*
                </label>
                <input
                  type="number"
                  name="disponible"
                  value={data?.disponible || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Unidades Disponibles"
                  min="1"
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                    width: "330px",
                    height: "60px",
                    marginLeft: "4px",
                    textAlign: "center",
                  }}
                />
              </div>
              <div className="col">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "33px",
                    marginRight: "53px",
                  }}
                >
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
                    Actualizar
                  </button>
                  <a
                    type="submit"
                    className="btn btn-dark"
                    href="/prestamos/materialDeportivo/dashboard"
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
              </div>
            </div>
            <br />
          </form>
        </div>
      </React.Fragment>
    </div>
  );
};

export default UpdateObject;
