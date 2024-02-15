import React, { useState, useEffect } from "react";
import { principalURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assetss/css/App.css";

const options = [
  { value: "codigo", label: "Codigo" },
  { value: "fechaIngreso", label: "Fecha de Ingreso" },
  { value: "codigoFechaIngreso", label: "Codigo y Fecha de Ingreso" },
];

const Search = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedOption && selectedOption.value === "codigo") {
      fetch(`${principalURL}/biblioteca/codigou/${codigo}`)
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "fechaIngreso") {
      const formattedStartDate = startDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/(\d{2})\/(\d{2})\/(\d{4}),\s/, "$3-$2-$1T");
      const formattedEndDate = endDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/(\d{2})\/(\d{2})\/(\d{4}),\s/, "$3-$2-$1T");
      fetch(
        `${principalURL}/biblioteca/fechaingreso?fechaInicial=${formattedStartDate}&fechaFinal=${formattedEndDate}`
      )
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (
      selectedOption &&
      selectedOption.value === "codigoFechaIngreso"
    ) {
      const formattedStartDate = startDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/(\d{2})\/(\d{2})\/(\d{4}),\s/, "$3-$2-$1T");
      const formattedEndDate = endDate
        .toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/(\d{2})\/(\d{2})\/(\d{4}),\s/, "$3-$2-$1T");
      fetch(
        `${principalURL}/biblioteca/idcodigouandfechaingreso?idCodigoU=${codigo}&fechaInicial=${formattedStartDate}&fechaFinal=${formattedEndDate}`
      )
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    }
  }, [selectedOption, codigo, startDate, endDate]);

  return (
    <React.Fragment>
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
          REGISTROS BIBLIOTECA
        </p>
      </div>
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "auto",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <a
            type="button"
            class="btn btn-danger"
            style={{
              position: "absolute",
              left: 30,
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              fontWeight: "bold",
            }}
            href="/biblioteca/dashboard"
          >
            Regresar
          </a>
          <p
            className="text"
            style={{
              fontWeight: "bold",
              fontSize: "18px",              
            }}
          >
            Seleccione el tipo de busqueda:
          </p>
        </div>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
          placeholder="Seleccionar..."
          styles={{ menu: (base) => ({ ...base, width: 220 }) }}
        />
        {selectedOption &&
          (selectedOption.value === "codigo" ||
            selectedOption.value === "codigoFechaIngreso") && (
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              style={{
                width: "150px",
                height: "45px",
                border: "1px solid black",
                margin: "10px",
              }}
            />
          )}
        {selectedOption &&
          (selectedOption.value === "fechaIngreso" ||
            selectedOption.value === "codigoFechaIngreso") && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="datePicker"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="datePicker"
              />
            </div>
          )}
        <br />
        {error && <div>Error: {error}</div>}
        {data && (
          <div
            className="container"
            style={{ maxWidth: "1000px", overflowY: "auto", height: "auto" }}
          >
            <table
              className="table table-striped"
              style={{
                boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid black" }}>ID</th>
                  <th style={{ border: "1px solid black" }}>Fecha Ingreso</th>
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
                {data && Array.isArray(data) && data.length > 0 ? (
                  data.map((item) => {
                    const fechaIngreso = new Date(
                      item.fechaIngreso
                    ).toLocaleString();
                    return (
                      <tr key={item.idBiblioteca}>
                        <td style={{ border: "1px solid black" }}>
                          {item.idBiblioteca}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {fechaIngreso}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto ? item.codigoUDto.idCodigoU : "N/A"}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto
                            ? item.codigoUDto.primerNombre
                            : "N/A"}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto
                            ? item.codigoUDto.segundoNombre
                            : "N/A"}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto
                            ? item.codigoUDto.primerApellido
                            : "N/A"}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.codigoUDto
                            ? item.codigoUDto.segundoApellido
                            : "N/A"}
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
        )}
      </div>
    </React.Fragment>
  );
};

export default Search;
