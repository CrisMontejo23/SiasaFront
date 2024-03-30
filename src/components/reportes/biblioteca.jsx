import React, { useState } from "react";
import { gatewayURL } from "../../services/principal";

import HeaderPrincipal from "../../template/header";
import DatePicker from "react-datepicker";

const BibliotecaReport = () => {
  let token = localStorage.getItem("token");

  const [fechaInicial, setFechaInicial] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");

  const handleDownload = async () => {
    const fechaInicialFormat = fechaInicial
      ? fechaInicial.toISOString().split("T")[0]
      : "";
    const fechaFinalFormat = fechaFinal
      ? fechaFinal.toISOString().split("T")[0]
      : "";

    const url = `${gatewayURL}/report/biblioteca/download?fechaInicial=${fechaInicialFormat}&fechaFinal=${fechaFinalFormat}&tipo=pdf`;

    // Realizar la petición GET
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en los headers
      },
    });

    // Imprimir el estado de la respuesta
    switch (response.status) {
      case 200:
        // Obtener el archivo del cuerpo de la respuesta
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, "0");
        const mes = String(fechaActual.getMonth() + 1).padStart(2, "0"); // Los meses en JavaScript empiezan en 0
        const año = fechaActual.getFullYear();

        let hora = fechaActual.getHours();
        const minuto = String(fechaActual.getMinutes()).padStart(2, "0");
        const esPM = hora >= 12;
        const hora12 = hora > 12 ? hora - 12 : hora === 0 ? 12 : hora; // Convertir a formato de 12 horas
        const horaFormateada =
          String(hora12).padStart(2, "0") + "-" + minuto + (esPM ? "PM" : "AM");

        const fechaHora = `${dia}-${mes}-${año} ${horaFormateada}`;

        // Usar la cadena de texto para establecer el atributo 'download' del enlace
        link.setAttribute("download", `Reporte Biblioteca ${fechaHora}.pdf`);

        document.body.appendChild(link);
        link.click();
        console.log("Reporte generado exitosamente");
        break;
      case 204:
        console.log("El informe generado está vacío");
        break;
      case 400:
        console.log(
          "El formato de fecha no es el correcto (yyyy-MM-dd) o está vacía"
        );
        break;
      case 500:
        console.log("Error interno del servidor");
        break;
      default:
        console.log("Hubo un error al generar el reporte");
        break;
    }
  };

  return (
    <React.Fragment>
      <HeaderPrincipal />
      <br />
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
            fontSize: "35px",
            fontFamily: "sans-serif",
            fontWeight: "bold",
          }}
        >
          GENERAR REPORTE BIBLIOTECA
        </p>
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <DatePicker
          selected={fechaInicial}
          onChange={(date) => setFechaInicial(date)}
          placeholderText="Fecha Inicial"
          dateFormat="yyyy-MM-dd"
          className="datePicker"
        />
        <DatePicker
          selected={fechaFinal}
          onChange={(date) => setFechaFinal(date)}
          placeholderText="Fecha Final"
          dateFormat="yyyy-MM-dd"
          className="datePicker"
        />
      </div>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          className="btn btn-success"
          onClick={handleDownload}
          style={{
            fortweight: "bold",
            boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
            width: "150px",
            fontSize: "20px",
          }}
        >
          Descargar PDF
        </button>
      </div>
    </React.Fragment>
  );
};

export default BibliotecaReport;
