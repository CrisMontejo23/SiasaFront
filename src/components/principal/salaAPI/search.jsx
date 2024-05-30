import React, { useState, useEffect } from "react";
import { gatewayURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assetss/css/App.css";

const options = [
  { value: "codigo", label: "Código Universitario" },
  { value: "idRfid", label: "ID Carnet Rfid" },
  { value: "fechaIngreso", label: "Fecha de Ingreso" },
  { value: "fechaSalida", label: "Fecha de Salida" },
  { value: "codigoFechaIngreso", label: "Codigo y Fecha de Ingreso" },
  { value: "codigoFechaSalida", label: "Codigo y Fecha de Salida" },
];

const Search = () => {
  let token = localStorage.getItem("token");

  const [selectedOption, setSelectedOption] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [idRfid, setIdRfid] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWithDates = (endpoint) => {
      const formattedStartDate = formatDates(startDate);
      const formattedEndDate = formatDates(endDate);
      fetch(
        `${gatewayURL}/salacomputo/${endpoint}?fechaInicial=${formattedStartDate}&fechaFinal=${formattedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    };

    const fetchWithDatesAndCode = (endpoint) => {
      const formattedStartDate = formatDates(startDate);
      const formattedEndDate = formatDates(endDate);
      fetch(
        `${gatewayURL}/salacomputo/${endpoint}?idCodigoU=${codigo}&fechaInicial=${formattedStartDate}&fechaFinal=${formattedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    };

    if (selectedOption && selectedOption.value === "codigo") {
      fetch(`${gatewayURL}/salacomputo/codigou/${codigo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "idRfid") {
      fetch(`${gatewayURL}/salacomputo/codigou/idrfid/${idRfid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "fechaIngreso") {
      fetchWithDates("fechaingreso");
    } else if (selectedOption && selectedOption.value === "fechaSalida") {
      fetchWithDates("fechasalida");
    } else if (
      selectedOption &&
      selectedOption.value === "codigoFechaIngreso"
    ) {
      fetchWithDatesAndCode("idcodigouandfechaingreso");
    } else if (selectedOption && selectedOption.value === "codigoFechaSalida") {
      fetchWithDatesAndCode("idcodigouandfechasalida");
    }
  }, [selectedOption, codigo, startDate, endDate, token, idRfid]);

  const formatDates = (date) => {
    return date
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/(\d{2})\/(\d{2})\/(\d{4}),\s/, "$3-$2-$1T");
  };

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
          REGISTROS SALAS DE CÓMPUTO
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
            href="/sala/dashboard"
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
            selectedOption.value === "codigoFechaIngreso" ||
            selectedOption.value === "codigoFechaSalida") && (
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="CODIGO U"
              style={{
                width: "150px",
                height: "45px",
                border: "1px solid black",
                margin: "10px",
              }}
            />
          )}
        {selectedOption && selectedOption.value === "idRfid" && (
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
                value={idRfid}
                onChange={(event) => {
                  // Solo actualiza el valor si el evento es un pegado
                  if (event.nativeEvent.inputType === "insertFromPaste") {
                    setIdRfid(event.target.value);
                  }
                }}
                onKeyPress={(event) => {
                  // Previene la entrada de texto a menos que sea un pegado
                  if (!(event.ctrlKey && event.key === "v")) {
                    event.preventDefault();
                  }
                }}
                placeholder="ACERQUE EL CARNET"
                style={{
                  width: "250px",
                  height: "45px",
                  border: "1px solid black",
                  margin: "10px",
                }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setIdRfid("");
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
        )}
        {selectedOption &&
          (selectedOption.value === "fechaIngreso" ||
            selectedOption.value === "fechaSalida" ||
            selectedOption.value === "codigoFechaSalida" ||
            selectedOption.value === "codigoFechaIngreso") && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="datePicker"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
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
            style={{ maxWidth: "1250px", overflowY: "auto", height: "auto" }}
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
                  {selectedOption &&
                  (selectedOption.value === "fechaSalida" ||
                    selectedOption.value === "codigoFechaSalida") ? (
                    <th style={{ border: "1px solid black" }}>Fecha Salida</th>
                  ) : (
                    <th style={{ border: "1px solid black" }}>Fecha Ingreso</th>
                  )}
                  {selectedOption &&
                    (selectedOption.value === "codigo" ||
                      selectedOption.value === "idRfid") && (
                      <th style={{ border: "1px solid black" }}>
                        Fecha Salida
                      </th>
                    )}
                  <th style={{ border: "1px solid black" }}>
                    Código Universitario
                  </th>
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
                    return (
                      <tr key={item.idSalaComputo}>
                        <td style={{ border: "1px solid black" }}>
                          {item.idSalaComputo}
                        </td>
                        {selectedOption &&
                        (selectedOption.value === "fechaSalida" ||
                          selectedOption.value === "codigoFechaSalida") ? (
                          <td style={{ border: "1px solid black" }}>
                            {fechaSalida}
                          </td>
                        ) : (
                          <td style={{ border: "1px solid black" }}>
                            {fechaIngreso}
                          </td>
                        )}
                        {selectedOption &&
                          (selectedOption.value === "codigo" ||
                            selectedOption.value === "idRfid") && (
                            <td style={{ border: "1px solid black" }}>
                              {fechaSalida}
                            </td>
                          )}
                        <td style={{ border: "1px solid black" }}>
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
                    <td
                      colSpan={
                        selectedOption &&
                        (selectedOption.value === "codigo" ||
                          selectedOption.value === "idRfid")
                          ? "8"
                          : "7"
                      }
                      className="text-center align-middle"
                    >
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