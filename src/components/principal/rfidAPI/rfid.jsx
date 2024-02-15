import React, { useState, useEffect } from "react";
import Header from "../../../template/header";

import { principalURL } from "../../../services/principal";
import axios from "axios";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const Rfid = () => {
  const [rfid, setRfid] = useState("");
  const [rfidList, setRfidList] = useState([]);
  const [vinculados, setVinculados] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);

  const handleInputChange = (event) => {
    const newRfid = event.target.value.toUpperCase();
    setRfid(newRfid);
    if (newRfid === "") {
      fetchRfidList();
    } else {
      searchRfid(newRfid);
    }
  };

  const fetchRfidWithout = () => {
    let url = principalURL + "/rfid/without";
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        setRfidList(response.data);
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 404) {
            setErrorMessage("No hay Rfid sin asignar.");
            audioError.play();
          } else if (error.response.status === 500) {
            setErrorMessage("Error interno del servidor.");
            audioError.play();
          }
        } else {
          setErrorMessage("Error desconocido.");
          audioError.play();
        }
        setTimeout(() => {
          setErrorMessage("");
        }, 2500);
      });
  };

  const handleVinculadosChange = (event) => {
    setVinculados(event.target.value === "vinculados");
    if (event.target.value === "vinculados") {
      fetchRfidList();
    } else {
      fetchRfidWithout();
    }
  };

  const registerRfid = (rfid) => {
    let url = `${principalURL}/rfid`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idRfid: rfid }),
    })
      .then((response) => {
        if (response.status === 400) {
          setErrorMessage("El ID del RFID es obligatorio.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (response.status === 409) {
          setErrorMessage("El ID del RFID ya se encuentra registrado.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (response.status === 500) {
          setErrorMessage("Error interno del servidor.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      })
      .then((rfid) => {
        console.log(rfid);
        setErrorMessage("El carnet se registró exitosamente.");
        audioOk.play();
        setTimeout(() => {
          setErrorMessage("");
        }, 2500);
        fetchRfidList(); // Agregar esta línea
      })
      .catch((error) => {
        console.log(error);
        if (!errorMessage) {
          setErrorMessage("Error desconocido.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
      });
  };

  const handleRegisterClick = (event) => {
    event.preventDefault();
    const regex =
      /^[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}:[0-9A-Fa-f]{2}$/;
    if (regex.test(rfid)) {
      registerRfid(rfid);
    } else {
      setErrorMessage("RFID no detectado.");
      audioError.play();
    }
  };

  const fetchRfidList = () => {
    let url = `${principalURL}/rfid/page?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        setRfidList(response.data.content);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 404) {
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (error.response && error.response.status === 500) {
          setErrorMessage("Error interno del servidor.");          
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else {
          setErrorMessage(error.message);
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
        setRfidList([]);
      });
  };

  const searchRfid = (rfid) => {
    let url = principalURL + "/rfid/" + rfid;
    axios
      .get(url)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setRfidList([response.data]); // Actualiza rfidList con la respuesta
          setErrorMessage("Datos encontrados exitosamente.");
          audioOk.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (response.status === 500) {
          setErrorMessage("Error interno del servidor.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
          setRfidList([]);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 404) {
          setErrorMessage("ID del RFID no registrado.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else {
          setErrorMessage(
            error.response ? error.response.data.message : "Error desconocido."
          );
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
        setRfidList([]);
      });
  };

  const deleteRfid = (idRfid) => {
    let url = `${principalURL}/rfid/${idRfid}`;
    axios
      .delete(url)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setErrorMessage("Registro de RFID eliminado exitosamente.");
          audioOk.play();
          handleVinculadosChange({ target: { value: "vinculados" } });
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (response.status === 404) {
          setErrorMessage("ID del RFID no registrado.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");            
          }, 2500);
        } else if (response.status === 409) {
          setErrorMessage("El ID del RFID tiene datos ligados.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        } else if (response.status === 500) {
          setErrorMessage("Error interno del servidor.");
          audioError.play();
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setErrorMessage("El ID del RFID tiene datos ligados.");
          setTimeout(() => {
            setErrorMessage("");
          }, 2500);
        }
        console.log(error);
      });
  };

  useEffect(() => {
    fetchRfidList();
  }, [pageNumber, pageSize]);

  return (
    <div style={{ backgroundColor: "white" }}>
      <React.Fragment>
        <Header />
        <br />
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <form className="form-inline justify-content-center">
            <div className="form-group">
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                }}
              >
                Buscar:
              </label>
              <input
                type="text"
                className="form-control mr-2"
                id="exampleInputPassword1"
                placeholder="ACERQUE EL CARNET"
                style={{
                  textTransform: "uppercase",
                  width: "240px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
                value={rfid}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (!(event.ctrlKey && event.key === "v")) {
                    event.preventDefault();
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setRfid("");
                  fetchRfidList();
                }}
                style={{
                  marginRight: "150px",
                  border: "none",
                  fontWeight: "bold",
                }}
              >
                x
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={(event) => {
                  handleRegisterClick(event);
                  setRfid("");
                  fetchRfidList();
                }}
                style={{
                  fontWeight: "bold",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
        <br />
        <div
          className="container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            className="btn-group btn-group-toggle"
            data-toggle="buttons"
            style={{
              marginRight: vinculados ? "150px" : "0px",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
            }}
          >
            <label
              className={
                vinculados ? "btn btn-secondary active" : "btn btn-secondary"
              }
              style={{ fontWeight: "bold" }}
            >
              <input
                type="radio"
                name="options"
                id="option1"
                autoComplete="off"
                checked={vinculados}
                value="vinculados"
                onChange={handleVinculadosChange}
              />{" "}
              Todos
            </label>
            <label
              className={
                !vinculados ? "btn btn-secondary active" : "btn btn-secondary"
              }
              style={{ fontWeight: "bold" }}
            >
              <input
                type="radio"
                name="options"
                id="option3"
                autoComplete="off"
                checked={!vinculados}
                value="sinVincular"
                onChange={handleVinculadosChange}
              />{" "}
              Sin Vincular
            </label>
          </div>
          {vinculados && (
            <div className="ml-3 d-flex align-items-center">
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                }}
              >
                Página:
              </label>
              <input
                type="number"
                className="form-control mr-2"
                value={pageNumber + 1} // incrementamos en 1 para la visualización
                onChange={
                  (e) =>
                    setPageNumber(e.target.value > 1 ? e.target.value - 1 : 0) // decrementamos en 1 al establecer el valor
                }
                style={{
                  width: "65px",
                  height: "40px",
                  marginRight: "15px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
              />
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                }}
              >
                Tamaño de Página:
              </label>
              <input
                type="number"
                className="form-control mr-2"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                style={{
                  width: "65px",
                  height: "40px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
              />
            </div>
          )}
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
          style={{ maxWidth: "400px", overflowY: "auto", height: "auto" }}
        >
          <table
            className="table table-striped"
            style={{
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr className="text-center">
                <th scope="col" style={{ border: "1px solid black" }}>
                  #
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  ID Rfid
                </th>
              </tr>
            </thead>
            <tbody>
              {rfidList.length > 0 ? (
                rfidList.map((value, index) => {
                  return (
                    <tr className="text-center" key={index}>
                      <th
                        scope="row"
                        style={{
                          border: "1px solid black",
                          fontWeight: "normal",
                        }}
                      >
                        {index + 1}
                      </th>
                      <td style={{ border: "1px solid black" }}>
                        {value.idRfid}
                      </td>
                      <td style={{ width: "42px", border: "1px solid black" }}>
                        <button
                          type="button"
                          className="btn btn-danger align-middle"
                          onClick={() => {
                            deleteRfid(value.idRfid);
                            setRfid("");
                            fetchRfidList();
                          }}
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
                        >
                          <img
                            src={require("../../../assetss/img/delete.png")}
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
                  <td colSpan="3" className="text-center">
                    No hay datos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <br />
        <br />
      </React.Fragment>
    </div>
  );
};

export default Rfid;
