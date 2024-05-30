import React, { useState, useEffect } from "react";
import { gatewayURL } from "../../../services/principal";
import HeaderPrincipal from "../../../template/header";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../assetss/css/App.css";

const options = [
  { value: "codigou", label: "Código Universitario" },
  { value: "idRfid", label: "ID Carnet Rfid" },
  { value: "nombreObjeto", label: "Nombre del Objeto" },
  { value: "devolucionempty", label: "Devolución Vacía" },
  { value: "fechaprestamo", label: "Fecha de Prestamo" },
  { value: "fechadevolucion", label: "Fecha de Devolución" },
];

const AdminSearch = () => {
  let token = localStorage.getItem("token");

  const [selectedOption, setSelectedOption] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [codigoUdec, setCodigoUdec] = useState("");
  const [idRfid, setIdRfid] = useState("");
  const [nombreObjeto, setNombreObjeto] = useState("");

  useEffect(() => {
    const fetchWithDates = (endpoint) => {
      const formattedStartDate = formatDates(startDate);
      const formattedEndDate = formatDates(endDate);
      fetch(
        `${gatewayURL}/prestamoaudiovisual/${endpoint}?fechaInicial=${formattedStartDate}&fechaFinal=${formattedEndDate}`,
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

    if (selectedOption && selectedOption.value === "codigou") {
      fetch(`${gatewayURL}/prestamoaudiovisual/codigou/${codigoUdec}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "idRfid") {
      fetch(`${gatewayURL}/prestamoaudiovisual/rfid/${idRfid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "devolucionempty") {
      fetch(`${gatewayURL}/prestamoaudiovisual/devolucionempty`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    } else if (selectedOption && selectedOption.value === "fechaprestamo") {
      fetchWithDates("fechaprestamo");
    } else if (selectedOption && selectedOption.value === "fechadevolucion") {
      fetchWithDates("fechadevolucion");
    } else if (selectedOption && selectedOption.value === "nombreObjeto") {
      fetch(`${gatewayURL}/prestamoaudiovisual/inventario/${nombreObjeto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setData(data))
        .catch((error) => setError(error.toString()));
    }
  }, [
    selectedOption,
    codigoUdec,
    idRfid,
    nombreObjeto,
    startDate,
    endDate,
    token,
  ]);

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
          REGISTROS PRÉSTAMOS MATERIAL AUDIOVISUAL
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
          placeholder="SELECCIONAR"
          styles={{ menu: (base) => ({ ...base, width: 220 }) }}
        />
        {selectedOption && selectedOption.value === "codigou" && (
          <input
            type="text"
            value={codigoUdec}
            onChange={(e) => setCodigoUdec(e.target.value)}
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
        {selectedOption && selectedOption.value === "nombreObjeto" && (
          <input
            type="text"
            value={nombreObjeto}
            onChange={(e) => setNombreObjeto(e.target.value)}
            placeholder="NOMBRE"
            style={{
              width: "150px",
              height: "45px",
              border: "1px solid black",
              margin: "10px",
            }}
          />
        )}
        {selectedOption &&
          (selectedOption.value === "fechaprestamo" ||
            selectedOption.value === "fechadevolucion") && (
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
            style={{ maxWidth: "1310px", overflowY: "auto", height: "auto" }}
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
                  <th style={{ border: "1px solid black" }}>Fecha Prestamo</th>
                  <th style={{ border: "1px solid black" }}>Nota</th>
                  {selectedOption &&
                    selectedOption.value !== "devolucionempty" && (
                      <th style={{ border: "1px solid black" }}>
                        Fecha Devolución
                      </th>
                    )}
                  {selectedOption &&
                    selectedOption.value !== "devolucionempty" && (
                      <th style={{ border: "1px solid black" }}>
                        Observaciones
                      </th>
                    )}
                  <th style={{ border: "1px solid black" }}>Objeto</th>
                  <th style={{ border: "1px solid black" }}>Disponibles</th>
                  <th style={{ border: "1px solid black" }}>
                    Cantidad Prestada
                  </th>
                  <th style={{ border: "1px solid black" }}>
                    Código Universitario
                  </th>
                  <th style={{ border: "1px solid black" }}>Nombre</th>
                  <th style={{ border: "1px solid black" }}>Apellido</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item) => {
                    const fechaPrestamo = new Date(
                      item.fechaPrestamo
                    ).toLocaleString();
                    let fechaDevolucion = new Date(
                      item.fechaDevolucion
                    ).toLocaleString();
                    if (fechaDevolucion === "31/12/1969, 19:00:00") {
                      fechaDevolucion = "Aún en préstamo";
                    }
                    return (
                      <tr key={item.idAudioVisual}>
                        <td style={{ border: "1px solid black" }}>
                          {item.idAudioVisual}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {fechaPrestamo}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.nota}
                        </td>
                        {selectedOption &&
                          selectedOption.value !== "devolucionempty" && (
                            <td style={{ border: "1px solid black" }}>
                              {fechaDevolucion}
                            </td>
                          )}
                        {selectedOption &&
                          selectedOption.value !== "devolucionempty" && (
                            <td style={{ border: "1px solid black" }}>
                              {item.observaciones}
                            </td>
                          )}
                        <td style={{ border: "1px solid black" }}>
                          {item.inventarioAudioVisualDTO.nombre}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.inventarioAudioVisualDTO.disponible}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.cantidad}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.idUdec}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.nombre}
                        </td>
                        <td style={{ border: "1px solid black" }}>
                          {item.apellido}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={"12"} className="text-center align-middle">
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

export default AdminSearch;
