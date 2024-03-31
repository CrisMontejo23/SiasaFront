import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

import HeaderPrincipal from "../../../template/header";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const Update = () => {
  let token = localStorage.getItem("token");

  const [errorMessage, setErrorMessage] = useState("");
  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);
  let { codigou } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    let url = `${gatewayURL}/codigou/${codigou}`;
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, [codigou, token]);

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
    let url = `${gatewayURL}/codigou/update/${codigou}`;
    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error("Revisar campos obligatorios.");
        }
      })
      .then((data) => {
        //console.log(data);
        setErrorMessage("Usuario actualizado exitosamente.");
        audioOk.play();
        setTimeout(() => {
          navigate("/codigou");
        }, 2500);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage(error.message); // Establecer el mensaje de error
        audioError.play();
        setTimeout(() => {
          setErrorMessage("");
        }, 2500);
      });
  };

  const handleDelete = () => {
    let url = `${gatewayURL}/codigou/${codigou}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        //console.log("Eliminado con éxito");
        setErrorMessage("Eliminación completa de registro exitosamente.");
        setTimeout(() => {
          navigate("/codigou");
        }, 2500);
      })
      .catch((error) => {
        console.error(error);
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
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  IdCodigoU
                </label>
                <input
                  type="text"
                  name="idCodigoU"
                  value={data?.idCodigoU || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="ID Codigo U"
                  readOnly
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
              </div>
              <div className="col">
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  IdRfid
                </label>
                <input
                  type="text"
                  name="rfidDto.idRfid"
                  value={data?.rfidDto.idRfid || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="ACERQUE EL CARNET"
                  readOnly
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                />
              </div>
            </div>
            <div class="row">
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
                  onClick={() => clearField("primerNombre")}
                  style={{
                    marginRight: "10px",
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
                  onClick={() => clearField("segundoNombre")}
                  style={{
                    marginRight: "10px",
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  x
                </button>
              </div>
            </div>
            <div class="row">
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
                  onClick={() => clearField("primerApellido")}
                  style={{
                    marginRight: "10px",
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
                  onClick={() => clearField("segundoApellido")}
                  style={{
                    marginRight: "10px",
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  x
                </button>
              </div>
            </div>
            <br />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  margin: "5px",
                  width: "100px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",
                }}
              >
                Actualizar
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                style={{
                  margin: "5px",
                  width: "100px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",
                }}
                onClick={handleDelete}
              >
                Eliminar
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

export default Update;
