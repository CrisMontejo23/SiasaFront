import React, { useEffect, useState } from "react";
import Header from "../../../template/header";
import { useNavigate } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

const Codigou = () => {
  let token = localStorage.getItem("token");
  console.log(token);

  const [codigou, setCodigou] = useState([]);
  const [allCodigou, setAllCodigou] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("idCodigoU");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchId, setSearchId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const clickCodigou = (codigou) => {
    //console.log(codigou);
    navigate(`/codigou/update/${codigou}`);
  };

  useEffect(() => {
    fetch(
      `${gatewayURL}/codigou/page?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.content && data.content.length > 0) {
          setCodigou(data.content);
          setAllCodigou(data.content); // Guarda todos los datos
        } else {
          setCodigou([]);
          setAllCodigou([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageNumber, pageSize, sortBy, sortOrder, token]); // Este efecto se ejecutará cada vez que cambien estos valores

  useEffect(() => {
    if (searchId === "") {
      // Si el campo de búsqueda está vacío, mostrar todos los usuarios
      setCodigou(allCodigou);
    } else {
      // Si el campo de búsqueda no está vacío, buscar el usuario con el ID ingresado
      const filteredCodigou = allCodigou.filter((codigou) =>
        codigou.idCodigoU.includes(searchId)
      );
      setCodigou(filteredCodigou);
    }
  }, [searchId]); // Este efecto se ejecutará cada vez que el valor de searchId cambie

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
                placeholder="Codigo U"
                style={{
                  textTransform: "uppercase",
                  width: "170px",
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                }}
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                style={{
                  marginRight: "150px",
                  border: "none",
                  fontWeight: "bold",
                }}
                onClick={() => {
                  setSearchId("");
                  setErrorMessage("");
                }}
              >
                x
              </button>
              <a
                type="button"
                className="btn btn-success"
                href="/codigou/create"
                style={{
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",
                }}
              >
                Registrar
              </a>
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
            }}
          >
            Página:
          </label>
          <input
            type="number"
            className="form-control mr-2"
            value={pageNumber + 1} // incrementamos en 1 para la visualización
            onChange={
              (e) => setPageNumber(e.target.value > 1 ? e.target.value - 1 : 0) // decrementamos en 1 al establecer el valor
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
            }}
          >
            <option value="idCodigoU">ID Codigo U</option>
            <option value="rfid.idRfid">ID Rfid</option>
            <option value="primerNombre">Primer Nombre</option>
            <option value="segundoNombre">Segundo Nombre</option>
            <option value="primerApellido">Primer Apellido</option>
            <option value="segundoApellido">Segundo Apellido</option>
          </select>
          <label
            className="mr-2"
            style={{
              fontWeight: "bold",
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
            }}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
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
                  ID Codigo U
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  ID Rfid
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  Primer Nombre
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  Segundo Nombre
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  Primer Apellido
                </th>
                <th scope="col" style={{ border: "1px solid black" }}>
                  Segundo Apellido
                </th>
              </tr>
            </thead>
            <tbody>
              {codigou.length > 0 ? (
                codigou.map((value, index) => (
                  <tr className="text-center" key={index}>
                    <th scope="row" style={{ border: "1px solid black" }}>
                      {value.idCodigoU}
                    </th>
                    <td style={{ border: "1px solid black" }}>
                      {value.rfidDto.idRfid}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {value.primerNombre}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {value.segundoNombre}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {value.primerApellido}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      {value.segundoApellido}
                    </td>
                    <td style={{ width: "42px", border: "1px solid black" }}>
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
                        onClick={() => clickCodigou(value.idCodigoU)}
                      >
                        <img
                          src={require("../../../assetss/img/system-update.png")}
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
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No hay datos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    </div>
  );
};

export default Codigou;
