import React, { useState, useEffect } from "react";
import { gatewayURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";

const Dashboard = () => {
  let token = localStorage.getItem("token");

  const [data, setData] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${gatewayURL}/laboratorio/page?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          console.log("Respuesta no exitosa");
          setData([]);
          return;
        }
        const text = await response.text();
        if (!text) {
          console.log("Respuesta vacía");
          setData([]);
          return;
        }
        const jsonData = JSON.parse(text);
        setData(jsonData.content || []);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [pageNumber, pageSize, sortBy, sortOrder, update, token]);

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
            }}
          >
            <p
              className="text"
              style={{
                fontSize: "35px",
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
            >
              REGISTROS LABORATORIOS
            </p>
          </div>
          <div
            className="ml-3 d-flex align-items-center"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <label className="mr-2" style={{ fontWeight: "bold" }}>
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
              <option value="">Seleccionar</option>
              <option value="fechaIngreso">Fecha de Ingreso</option>
              <option value="fechaSalida">Fecha de Salida</option>
              <option value="codigoU.primerNombre">Primer Nombre</option>
              <option value="codigoU.segundoNombre">Segundo Nombre</option>
              <option value="codigoU.primerApellido">Primer Apellido</option>
              <option value="codigoU.segundoApellido">Segundo Apellido</option>
            </select>
            <label className="mr-2" style={{ fontWeight: "bold" }}>
              Página:
            </label>
            <input
              type="number"
              className="form-control mr-2"
              value={pageNumber + 1}
              onChange={(e) =>
                setPageNumber(e.target.value > 1 ? e.target.value - 1 : 0)
              }
              style={{
                width: "65px",
                height: "40px",
                marginRight: "15px",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              }}
            />
            <label className="mr-2" style={{ fontWeight: "bold" }}>
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
            <label className="mr-2" style={{ fontWeight: "bold" }}>
              Orden:
            </label>
            <select
              className="form-control mr-2"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: "120px",
                height: "40px",
                marginRight: "15px",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              }}
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
            <button
              type="button"
              className="btn btn-danger align-middle"
              onClick={() => setUpdate(!update)}
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
                marginRight: "100px",
              }}
            >
              <img
                src={require("../../../assetss/img/reload.png")}
                alt="Delete"
                width="25"
                height="25"
                style={{ cursor: "pointer" }}
              />
            </button>
            <a
              type="button"
              className="btn btn-success"
              href="/laboratorio/dashboard/search"
              style={{
                fortweight: "bold",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                width: "97px",
                marginRight: "20px",
              }}
            >
              Busqueda Avanzada
            </a>
            <a
              type="button"
              className="btn btn-dark"
              href="/laboratorio/report"
              style={{
                fortweight: "bold",
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                width: "97px",
              }}
            >
              Generar Reporte
            </a>
          </div>
          <br />
          <div
            className="container"
            style={{ maxWidth: "1250px", overflowY: "auto", height: "auto" }}
          >
            <table
              className="table table-striped"
              style={{ boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)" }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid black" }}>ID</th>
                  <th style={{ border: "1px solid black" }}>Fecha Ingreso</th>
                  <th style={{ border: "1px solid black" }}>Fecha Salida</th>
                  <th style={{ border: "1px solid black" }}>ID CodigoU</th>
                  <th style={{ border: "1px solid black" }}>Primer Nombre</th>
                  <th style={{ border: "1px solid black" }}>Segundo Nombre</th>
                  <th style={{ border: "1px solid black" }}>Primer Apellido</th>
                  <th style={{ border: "1px solid black" }}>
                    Segundo Apellido
                  </th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => {
                    const fechaIngreso = new Date(
                      item.fechaIngreso
                    ).toLocaleString();
                    let fechaSalida = new Date(
                      item.fechaSalida
                    ).toLocaleString();
                    if (fechaSalida === "31/12/1969, 19:00:00") {
                      fechaSalida = "Aún en el laboratorio";
                    }
                    return (
                      <tr key={item.idLaboratorio}>
                        <td style={{ border: "1px solid black" }}>
                          {item.idLaboratorio}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {fechaIngreso}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {fechaSalida}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {" "}
                          {item.codigoUDto.idCodigoU}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto.primerNombre}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto.segundoNombre}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto.primerApellido}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto.segundoApellido}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center align-middle">
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

export default Dashboard;
