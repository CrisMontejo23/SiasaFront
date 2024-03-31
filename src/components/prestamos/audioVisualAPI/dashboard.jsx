import React, { useEffect, useState } from "react";
import Header from "../../../template/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { gatewayURL } from "../../../services/principal";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";
import alertSound from "../../../assetss/sounds/alert.mp3";

import arrowRight from "../../../assetss/img/arrow-right.png";
import reload from "../../../assetss/img/reload.png";
import updateLogo from "../../../assetss/img/system-update.png";

const Inventario = () => {
  let token = localStorage.getItem("token");

  const [update, setUpdate] = useState(false);
  const [objects, setObjects] = useState([]);
  const [allObjects, setAllObjects] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("idAudioVisual");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const navigate = useNavigate();

  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);
  const alertAudio = new Audio(alertSound);

  const [rfid, setRfid] = useState("");
  const [lastPrestamo, setLastPrestamo] = useState([]);
  const [idPrestamo, setIdPrestamo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [idAudioVisual, setIdAudioVisual] = useState(null);
  const [objetoSeleccionado, setObjetoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [nombreObjetoUltimoPrestamo, setNombreObjetoUltimoPrestamo] =
    useState("");
  const [nombreObjetoPrestamo, setNombreObjetoPrestamo] = useState("");
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [shouldRegisterNewLoan, setShouldRegisterNewLoan] = useState(false);

  const clickObject = (objectData) => {
    console.log(objectData);
    navigate(
      `/prestamos/audioVisual/inventario/update/${objectData.idAudioVisual}`,
      { state: { objectData } }
    );
  };

  const handleObjetoSeleccionado = (record) => {
    setObjetoSeleccionado(record);
  };  

  useEffect(() => {
    fetch(
      `${gatewayURL}/audiovisual/page?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.content && data.content.length > 0) {
          setObjects(data.content);
          setAllObjects(data.content);
        } else {
          setObjects([]);
          setAllObjects([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageNumber, pageSize, sortBy, sortOrder, update]);

  useEffect(() => {
    if (searchName === "") {
      setObjects(allObjects);
    } else {
      //console.log("searchName", searchName);
      const filteredName = allObjects.filter((name) =>
        name.nombre.includes(searchName)
      );
      setObjects(filteredName);
    }
  }, [searchName]);

  useEffect(() => {
    if (rfid) {
      axios
        .get(`${gatewayURL}/codigou/rfid/${rfid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            console.log("estudiante encontrado");
            let data = response.data;
            let nombreEstudiante =
              data.primerNombre + " " + data.primerApellido;
            setNombreEstudiante(nombreEstudiante);
            console.log(nombreEstudiante);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 400) {
            setRegisterMessage("El ID de RFID no existe.");
            audioError.play();
            setRfid("");
            setSearchName("");
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          } else if (error.response && error.response.status === 404) {
            setRegisterMessage("El carnet se encuentra sin vincular.");
            audioError.play();
            setRfid("");
            setSearchName("");
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          } else if (error.response && error.response.status === 500) {
            setRegisterMessage("Error interno del servidor.");
            audioError.play();
            setRfid("");
            setSearchName("");
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          }
        });
    }
  }, [rfid, nombreEstudiante]);

  useEffect(() => {
    if (rfid && nombreEstudiante !== "") {
      axios
        .get(`${gatewayURL}/prestamoaudiovisual/rfid/${rfid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response);
          let lastPrestamo = response.data[response.data.length - 1];
          setLastPrestamo(lastPrestamo);
          //console.log("lastPrestamo", lastPrestamo);
          if (lastPrestamo.fechaDevolucion === null) {
            setShouldRegisterNewLoan(false);
            console.log("debe salir");
            let idPrestamo = lastPrestamo.idAudioVisual;
            let nombreObjetoUltimoPrestamo =
              lastPrestamo.inventarioAudioVisualDTO.nombre;
            setNombreObjetoUltimoPrestamo(nombreObjetoUltimoPrestamo);
            setIdPrestamo(idPrestamo);
          } else {
            console.log("debe entrar");
            setShouldRegisterNewLoan(true);
            if (objetoSeleccionado) {
              let idInventarioAudioVisual = objetoSeleccionado.idAudioVisual;
              let nombreObjetoPrestamo = objetoSeleccionado.nombre;
              setNombreObjetoPrestamo(nombreObjetoPrestamo);
              setIdAudioVisual(idInventarioAudioVisual);
            } else {
              setRegisterMessage("Seleccione el objeto que desea.");
              alertAudio.play();
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response &&
            error.response.status === 404 &&
            nombreEstudiante !== ""
          ) {
            setShouldRegisterNewLoan(true);
            console.log(
              "No se registran prestamos al usuario, debe ingresar uno nuevo"
            );
            if (objetoSeleccionado) {
              let idInventarioAudioVisual = objetoSeleccionado.idAudioVisual;
              let nombreObjetoPrestamo = objetoSeleccionado.nombre;
              setNombreObjetoPrestamo(nombreObjetoPrestamo);
              setIdAudioVisual(idInventarioAudioVisual);
              console.log("nombre", nombreObjetoPrestamo);
              console.log("id", idInventarioAudioVisual);
              console.log(rfid);
              console.log(cantidad);
              console.log(observaciones);
            } else {
              alertAudio.play();
              setRegisterMessage("Seleccione el objeto que desea.");
            }
          } else {
            console.error("Error fetching loans:", error);
          }
        });
    }
  }, [rfid, objetoSeleccionado, observaciones, cantidad, nombreEstudiante]);

  const handleRegisterClick = () => {
    if (lastPrestamo.fechaDevolucion == null && nombreEstudiante !== "") {
      let urlOut = `${gatewayURL}/prestamoaudiovisual/out?idPrestamoAudioVisual=${idPrestamo}&observaciones=${encodeURIComponent(
        observaciones
      )}`;
      fetch(urlOut, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 201) {
            setRegisterMessage(
              `Devolución de ${nombreObjetoUltimoPrestamo} registrado exitosamente.`
            );
            audioOk.play();
            setCantidad(1);
            handleObjetoSeleccionado(null);
            setRfid("");
            setSearchName("");
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          } else if (response.status === 400) {
            if (objetoSeleccionado) {
              let urlIn = `${gatewayURL}/prestamoaudiovisual/in?idInventarioAudioVisual=${idAudioVisual}&idRfid=${encodeURIComponent(
                rfid
              )}&nota=${encodeURIComponent(
                observaciones
              )}&cantidad=${cantidad}`;
              fetch(urlIn, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              })
                .then((response) => {
                  console.log(response);
                  if (response.status === 201) {
                    setRegisterMessage(
                      `Prestamo de ${nombreObjetoPrestamo} creado exitosamente.`
                    );
                    audioOk.play();
                    handleObjetoSeleccionado(null);
                    setCantidad(1);
                    setRfid("");
                    setSearchName("");
                    setTimeout(() => {
                      setRegisterMessage("");
                    }, 2500);
                  } else if (response.status === 400) {
                    setRegisterMessage("Campos obligatorios requeridos.");
                    audioError.play();
                    setTimeout(() => {
                      setRegisterMessage("");
                    }, 2500);
                  } else if (response.status === 404) {
                    setRegisterMessage(
                      " El objeto o la persona no se encuentra en registros."
                    );
                    audioError.play();
                    setRfid("");
                    handleObjetoSeleccionado(null);
                    setCantidad(1);
                    setSearchName("");
                    setTimeout(() => {
                      setObjetoSeleccionado(null);
                      setRegisterMessage("");
                    }, 2500);
                  } else if (response.status === 409) {
                    setRegisterMessage(
                      "El objeto no cuenta con suficiente stock para realizar el prestamo."
                    );
                    audioError.play();
                    setRfid("");
                    handleObjetoSeleccionado(null);
                    setCantidad(1);
                    setSearchName("");
                    setTimeout(() => {
                      setRegisterMessage("");
                    }, 2500);
                  } else if (response.status === 500) {
                    setRegisterMessage("Error interno del servidor.");
                    handleObjetoSeleccionado(null);
                    setCantidad(1);
                    setRfid("");
                    setSearchName("");
                    audioError.play();
                    setTimeout(() => {
                      setRegisterMessage("");
                    }, 2500);
                  }
                  setSearchName("");
                  setObservaciones("");
                })
                .catch((error) => console.error("Error:", error));
            } else {
              console.log("No hay objeto seleccionado");
            }
          } else if (response.status === 404) {
            setRegisterMessage(
              " Prestamo con ID no registra o el objeto no registra con ID en el inventario."
            );
            setCantidad(1);
            setRfid("");
            handleObjetoSeleccionado(null);
            setSearchName("");
            audioError.play();
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          } else if (response.status === 500) {
            setRegisterMessage("Error interno del servidor.");
            audioError.play();
            setRfid("");
            setSearchName("");
            handleObjetoSeleccionado(null);
            setCantidad(1);
            setTimeout(() => {
              setRegisterMessage("");
            }, 2500);
          }
          setSearchName("");
          setObservaciones("");
        })
        .catch((error) => console.error("Error:", error));
    } else {
      if (objetoSeleccionado) {
        let urlIn = `${gatewayURL}/prestamoaudiovisual/in?idInventarioAudioVisual=${idAudioVisual}&idRfid=${encodeURIComponent(
          rfid
        )}&nota=${encodeURIComponent(observaciones)}&cantidad=${cantidad}`;
        fetch(urlIn, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => {
            console.log(response);
            if (response.status === 201) {
              setRegisterMessage(
                `Prestamo de ${nombreObjetoPrestamo} creado exitosamente.`
              );
              audioOk.play();
              handleObjetoSeleccionado(null);
              setCantidad(1);
              setRfid("");
              setSearchName("");
              setTimeout(() => {
                setRegisterMessage("");
              }, 2500);
            } else if (response.status === 400) {
              setRegisterMessage("Campos obligatorios requeridos.");
              audioError.play();
              setTimeout(() => {
                setRegisterMessage("");
              }, 2500);
            } else if (response.status === 404) {
              setRegisterMessage(
                " El objeto o la persona no se encuentra en registros."
              );
              audioError.play();
              setRfid("");
              handleObjetoSeleccionado(null);
              setCantidad(1);
              setSearchName("");
              setTimeout(() => {
                setObjetoSeleccionado(null);
                setRegisterMessage("");
              }, 2500);
            } else if (response.status === 409) {
              setRegisterMessage(
                "El objeto no cuenta con suficiente stock para realizar el prestamo."
              );
              audioError.play();
              setRfid("");
              handleObjetoSeleccionado(null);
              setCantidad(1);
              setSearchName("");
              setTimeout(() => {
                setRegisterMessage("");
              }, 2500);
            } else if (response.status === 500) {
              setRegisterMessage("Error interno del servidor.");
              handleObjetoSeleccionado(null);
              setCantidad(1);
              setRfid("");
              setSearchName("");
              audioError.play();
              setTimeout(() => {
                setRegisterMessage("");
              }, 2500);
            }
            setSearchName("");
            setObservaciones("");
          })
          .catch((error) => console.error("Error:", error));
      } else {
        console.log("No hay objeto seleccionado");
      }
    }
  };  

  return (
    <div>
      <Header />
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
        PRÉSTAMOS DE MATERIAL AUDIOVISUAL
      </p>
      <div style={{ backgroundColor: "white", display: "flex" }}>
        <div
          style={{ marginRight: "auto", maxWidth: "800px", marginLeft: "5px" }}
        >
          <React.Fragment>
            <p
              className="text"
              style={{
                fontSize: "20px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              INVENTARIO
            </p>
            <div
              className="container"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <form className="form-inline justify-content-center">
                <div className="form-group">
                  <label
                    className="mr-2"
                    htmlFor="exampleInputPassword1"
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
                    placeholder="nombre"
                    style={{
                      textTransform: "uppercase",
                      width: "170px",
                      boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                    }}
                    value={searchName}
                    onChange={(e) =>
                      setSearchName(e.target.value.toUpperCase())
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{
                      border: "none",
                      fontWeight: "bold",
                      marginRight: "30px",
                    }}
                    onClick={() => {
                      setSearchName("");
                      setRegisterMessage("");
                    }}
                  >
                    x
                  </button>
                  <a
                    type="button"
                    className="btn btn-success"
                    href="/prestamos/audioVisual/inventario/register"
                    style={{
                      boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                      fontWeight: "bold",
                      maxWidth: "110px",
                      marginRight: "30px",
                    }}
                  >
                    Registrar Objeto
                  </a>
                  <a
                    type="button"
                    className="btn btn-dark"
                    href="/prestamos/audioVisual/search"
                    style={{
                      boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                      fontWeight: "bold",
                      maxWidth: "110px",
                      marginRight: "70px",
                    }}
                  >
                    Busqueda Avanzada
                  </a>
                  <button
                    type="button"
                    className="btn btn-danger align-middle"
                    onClick={() => setUpdate(!update)}
                    style={{
                      height: "25px",
                      justifyContent: "center",
                      width: "25px",
                      alignItems: "center",
                      textAlign: "center",
                      border: "none",
                      background: "none",
                      padding: "0",
                      marginRight: "0px",
                    }}
                  >
                    <img
                      src={reload}
                      alt="Delete"
                      width="25"
                      height="25"
                      style={{ cursor: "pointer" }}
                    />
                  </button>
                </div>
              </form>
            </div>
            <br />
            <div
              className="ml-3 d-flex align-items-center"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
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
                  fontSize: "15px",
                }}
              />
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Tamaño Página:
              </label>
              <input
                type="number"
                className="form-control mr-2"
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                style={{
                  width: "65px",
                  height: "40px",
                  marginRight: "15px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontSize: "15px",
                }}
              />
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Ordenar por:
              </label>
              <select
                className="form-control mr-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: "155px",
                  height: "40px",
                  marginRight: "15px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontSize: "15px",
                }}
              >
                <option value="idAudioVisual">ID</option>
                <option value="nombre">Nombre</option>
                <option value="descripcion">Descripción</option>
                <option value="disponible">Disponibles</option>
              </select>
              <label
                className="mr-2"
                style={{
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                Orden:
              </label>
              <select
                className="form-control mr-2"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{
                  width: "120px",
                  height: "40px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontSize: "15px",
                }}
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
            <br />
            <div
              className="container"
              style={{ maxWidth: "1050px", overflowY: "auto", height: "auto" }}
            >
              <table
                className="table table-striped"
                style={{
                  border: "1px solid black",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
              >
                <thead>
                  <tr className="text-center">
                    <th scope="col" style={{ border: "1px solid black" }}>
                      ID
                    </th>
                    <th scope="col" style={{ border: "1px solid black" }}>
                      Nombre
                    </th>
                    <th scope="col" style={{ border: "1px solid black" }}>
                      Descripción
                    </th>
                    <th scope="col" style={{ border: "1px solid black" }}>
                      Disponibles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {objects.length > 0 ? (
                    objects.map((value, index) => (
                      <tr className="text-center" key={index}>
                        <th scope="row" style={{ border: "1px solid black" }}>
                          {value.idAudioVisual}
                        </th>
                        <td style={{ border: "1px solid black" }}>
                          {value.nombre}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {value.descripcion}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {value.disponible}
                        </td>
                        <td
                          style={{ width: "42px", border: "1px solid black" }}
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
                            onClick={() => clickObject(value)}
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
                        <td
                          style={{ width: "42px", border: "1px solid black" }}
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
                            onClick={() => {
                              handleObjetoSeleccionado(value);
                              setRegisterMessage("");
                            }}
                          >
                            <img
                              src={arrowRight}
                              alt="Delete"
                              width="25"
                              height="25"
                              style={{ cursor: "pointer" }}
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No hay datos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </React.Fragment>
        </div>
        <div style={{ marginRight: "auto" }}>
          <React.Fragment>
            <p
              className="text"
              style={{
                fontSize: "20px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
              }}
            >
              REGISTRO
            </p>
            <form className="form-inline justify-content-center">
              <div
                className="form-group"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: "15px",
                }}
              >
                <input
                  type="password"
                  className="form-control mr-2"
                  id="exampleInputPassword1"
                  placeholder="ACERQUE EL CARNET"
                  style={{
                    textTransform: "uppercase",
                    width: "240px",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  }}
                  value={rfid}
                  onChange={(event) => {
                    // Solo actualiza el valor si el evento es un pegado
                    if (event.nativeEvent.inputType === "insertFromPaste") {
                      setRfid(event.target.value);
                    }
                  }}
                  onKeyPress={(event) => {
                    // Previene la entrada de texto a menos que sea un pegado
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
                    setRegisterMessage("");
                    handleObjetoSeleccionado(null);
                  }}
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                >
                  x
                </button>
              </div>
            </form>
            {registerMessage && (
              <div
                className={`alert text-center ${
                  registerMessage.includes("exitosamente")
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
                {registerMessage}
              </div>
            )}
            <br />
            <div
              style={{
                width: "400px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {lastPrestamo.fechaDevolucion == null &&
                rfid !== "" &&
                shouldRegisterNewLoan === false &&
                idPrestamo !== "" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      className="alert alert-primary"
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        textAlign: "center",
                      }}
                    >
                      {nombreEstudiante}.
                      <br />
                      Prestamo de {nombreObjetoUltimoPrestamo} encontrado.
                      <br />
                      Unidades prestadas al estudiante: {lastPrestamo.cantidad}
                      <br />
                      Nota de prestamo: {lastPrestamo.nota}
                    </p>
                    <label
                      htmlFor="note"
                      style={{
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >
                      Observaciones de devolución:
                    </label>
                    <div
                      style={{
                        display: "flex",
                        width: "auto",
                        justifyContent: "center",
                      }}
                    >
                      <textarea
                        className="form-control mr-2"
                        id="exampleInputPassword1"
                        style={{
                          textTransform: "uppercase",
                          width: "240px",
                          height: "auto",
                          boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                          fontSize: "15px",
                          overflow: "auto",
                          resize: "none",
                          marginLeft: "15px",
                        }}
                        value={observaciones}
                        onChange={(e) =>
                          setObservaciones(e.target.value.toUpperCase())
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setObservaciones("");
                        }}
                        style={{
                          border: "none",
                          fontWeight: "bold",
                        }}
                      >
                        x
                      </button>
                    </div>
                    <br />
                    <a
                      type="button"
                      className="btn btn-danger"
                      style={{
                        boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                        fontWeight: "bold",
                        maxWidth: "120px",
                      }}
                      onClick={handleRegisterClick}
                    >
                      Registrar Devolución
                    </a>
                  </div>
                )}
              {objetoSeleccionado && shouldRegisterNewLoan === true && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <p
                    className="alert alert-primary"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {nombreEstudiante}.
                    <br />
                    Objeto elegido: {objetoSeleccionado.nombre}.
                    <br />
                    Unidades disponibles: {objetoSeleccionado.disponible}
                  </p>
                  <label
                    htmlFor="note"
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    Observaciones sobre el objeto:
                  </label>
                  <div
                    style={{
                      display: "flex",
                      width: "auto",
                      justifyContent: "center",
                    }}
                  >
                    <textarea
                      className="form-control mr-2"
                      id="exampleInputPassword1"
                      style={{
                        textTransform: "uppercase",
                        width: "240px",
                        height: "auto",
                        boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                        fontSize: "15px",
                        overflow: "auto",
                        resize: "none",
                        marginLeft: "15px",
                      }}
                      value={observaciones}
                      onChange={(e) =>
                        setObservaciones(e.target.value.toUpperCase())
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setObservaciones("");
                      }}
                      style={{
                        border: "none",
                        fontWeight: "bold",
                      }}
                    >
                      x
                    </button>
                  </div>
                  <div
                    style={{
                      width: "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ marginRight: "15px" }}>
                        <label
                          htmlFor="quantity"
                          style={{
                            fontWeight: "bold",
                            fontSize: "15px",
                            marginTop: "20px",
                            marginRight: "5px",
                          }}
                        >
                          Cantidad:
                        </label>
                        <input
                          type="number"
                          className="form-control mr-2"
                          value={cantidad}
                          onChange={(e) => setCantidad(e.target.value)}
                          min="1"
                          max={objetoSeleccionado.disponible}
                          style={{
                            width: "80px",
                            height: "40px",
                            boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                            fontSize: "15px",
                          }}
                        />
                      </div>
                      <a
                        type="button"
                        className="btn btn-success"
                        style={{
                          boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                          fontWeight: "bold",
                          maxWidth: "100px",
                          marginTop: "30px",
                        }}
                        onClick={handleRegisterClick}
                      >
                        Registrar Prestamo
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <br />
            <br />
          </React.Fragment>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
