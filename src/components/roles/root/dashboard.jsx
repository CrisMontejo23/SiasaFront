import React, { useState, useEffect } from "react";
import { gatewayURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";
import { useNavigate } from "react-router-dom";

import updateLogo from "../../../assetss/img/system-update.png";

const RootDashboard = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const navigate = useNavigate();

  const clickObject = (objectData) => {
    console.log(objectData);
    navigate(
      `/root/update/${objectData.id}`,
      { state: { objectData } }
    );
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
        setData(jsonData || []);
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
                marginRight: "50px",
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
          </div>
          <br />
          <div
            className="container"
            style={{ maxWidth: "auto", overflowY: "auto", height: "auto" }}
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
                    Contraseña Encriptada
                  </th>
                  <th
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    Roles
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
                          {item.password}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {item.roles.join(", ")}
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
