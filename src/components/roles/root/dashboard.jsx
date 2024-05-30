import React, { useState, useEffect } from "react";
import { gatewayURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import updateLogo from "../../../assetss/img/system-update.png";
import deleteLogo from "../../../assetss/img/delete.png";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const RootDashboard = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  const clickObject = (objectData) => {
    //console.log(objectData);
    navigate(`/root/update/${objectData.id}`, { state: { objectData } });
  };

  const deleteUser = (objectData) => {
    let url = `${gatewayURL}/admin/deleteuser/${objectData.id}`;
    let token = localStorage.getItem("token");
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200 || response.status === 204) {
          setErrorMessage("Usuario eliminado exitosamente.");
          audioOk.play();
          setUpdate(!update); // Actualizar la lista de usuarios
        } else {
          setErrorMessage("Error inesperado al eliminar el usuario.");
          audioError.play();
        }
        setTimeout(() => {
          setErrorMessage("");
        }, 2500);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setErrorMessage("Usuario no encontrado.");
        } else {
          setErrorMessage("Error inesperado al eliminar el usuario.");
        }
        audioError.play();
        setTimeout(() => {
          setErrorMessage("");
        }, 2500);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("token");
        const response = await fetch(`${gatewayURL}/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.log("Respuesta no exitosa");
          setData([]);
          return;
        }
        const jsonData = await response.json();
        if (!jsonData) {
          console.log("Respuesta vacía");
          setData([]);
          return;
        }
        // Ordenar los datos por ID
        const sortedData = jsonData.sort((a, b) => a.id - b.id);
        setData(sortedData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [update]);

  return (
    <div style={{ backgroundColor: "white" }}>
      <React.Fragment>
        <div>
          <HeaderPrincipal />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              type="button"
              className="btn btn-success align-middle"
              onClick={() => setUpdate(!update)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                fontWeight: "bold",
                maxWidth: "150px",
                marginRight: "50px",
              }}
            >
              Recargar
              <img
                src={require("../../../assetss/img/reload.png")}
                alt="Reload"
                width="25"
                height="25"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              />
            </a>
            <p
              className="text"
              style={{
                fontSize: "35px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
            >
              DASHBOARD ROOT
            </p>
            <a
              type="button"
              className="btn btn-success align-middle"
              href="/root/create"
              style={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                fontWeight: "bold",
                maxWidth: "180px",
                marginLeft: "50px",
              }}
            >
              Crear Usuario
              <img
                src={require("../../../assetss/img/add-user.png")}
                alt="Reload"
                width="25"
                height="25"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              />
            </a>
          </div>
          <br />
          {errorMessage && (
            <div
              className={`alert text-center ${
                errorMessage.includes("exitosamente")
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
              style={{
                width: "350px",
                margin: "0 auto",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              }}
            >
              {errorMessage}
            </div>
          )}
          <br />
          <div
            className="container"
            style={{ maxWidth: "1000px", overflowY: "auto", height: "auto" }}
          >
            <table
              className="table table-striped"
              style={{
                border: "1px solid black",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                maxWidth: "auto",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    ID
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Nombre
                  </th>
                  <th
                    style={{ border: "1px solid black", textAlign: "center" }}
                  >
                    Correo
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    Rol Asignado
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {item.id}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {item.name}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {item.email}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {item.roles}
                        </td>
                        <td
                          style={{
                            width: "42px",
                            border: "1px solid black",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-danger align-middle"
                            style={{
                              height: "25px",
                              justifyContent: "center",
                              width: "25px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              border: "none",
                              background: "none",
                              padding: "0",
                            }}
                            onClick={() => deleteUser(item)}
                          >
                            <img
                              src={deleteLogo}
                              alt="Delete"
                              width="25"
                              height="25"
                              style={{ cursor: "pointer" }}
                            />
                          </button>
                        </td>
                        <td
                          style={{
                            width: "42px",
                            border: "1px solid black",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn-danger align-middle"
                            style={{
                              height: "25px",
                              justifyContent: "center",
                              width: "25px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              border: "none",
                              background: "none",
                              padding: "0",
                            }}
                            onClick={() => clickObject(item)}
                          >
                            <img
                              src={updateLogo}
                              alt="Delete"
                              width="25"
                              height="25"
                              style={{ cursor: "pointer" }}
                            />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center align-middle">
                      No hay datos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    </div>
  );
};

export default RootDashboard;
