import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import { gatewayURL } from "../../../services/principal";

import HeaderPrincipal from "../../../template/header";

import saveLogo from "../../../assetss/img/diskette.png";

import soundOk from "../../../assetss/sounds/ok.mp3";
import soundError from "../../../assetss/sounds/error.mp3";

const RootUpdate = () => {
  let token = localStorage.getItem("token");

  const location = useLocation();
  const audioOk = new Audio(soundOk);
  const audioError = new Audio(soundError);
  const objectData = location.state.objectData;
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    userId: objectData.id,
  });

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]:
        event.target.name === "password"
          ? event.target.value
          : event.target.value.toUpperCase(),
    });
  };

  const validatePassword = (password) => {
    // Al menos 8 caracteres, una mayúscula, un número y un carácter especial
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSavePassword = async () => {
    if (!validatePassword(data.password)) {
      audioError.play();
      setErrorMessage(
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(
        `${gatewayURL}/admin/changepassword/${data.userId}?newPassword=${data.password}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
      }

      setErrorMessage(`Contraseña actualizada exitosamente.`);
      audioOk.play();
      setTimeout(() => {
        setErrorMessage("");
        setData({ ...data, password: "" });
      }, 2500);
    } catch (error) {
      audioError.play();
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 2500);
    }
  };

  const handleSaveRole = async () => {
    if (!data.role) {
      audioError.play();
      setErrorMessage("Por favor, seleccione un rol.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return;
    }

    try {
      const response = await fetch(
        `${gatewayURL}/admin/updateroles/${data.userId}?newRoles=${data.role}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el rol");
      }

      setErrorMessage(`Rol actualizado exitosamente.`);
      audioOk.play();
      setTimeout(() => {
        setErrorMessage("");
        setData({ ...data, role: "" });
      }, 2500);
    } catch (error) {
      audioError.play();
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 2500);
    }
  };

  return (
    <div style={{ backgroundColor: "white" }}>
      <React.Fragment>
        <HeaderPrincipal />
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
          EDITAR USUARIO
        </p>
        <br />
        {errorMessage && (
          <div
            className={`alert text-center ${
              errorMessage.includes("exitosamente")
                ? "alert-success"
                : "alert-danger"
            }`}
            role="alert"
            style={{ width: "350px", margin: "0 auto" }}
          >
            {errorMessage}
          </div>
        )}
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
          }}
        >
          <form>
            <div className="row">
              <div
                className="col"
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                    width: "auto",
                    marginRight: "20px",
                  }}
                >
                  Nueva Contraseña
                </label>
                <input
                  type="text"
                  name="password"
                  value={data?.password || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="INGRESE LA NUEVA CONTRASEÑA"
                  style={{
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                    width: "400px",
                    height: "60px",
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={handleSavePassword}
                >
                  <img
                    src={saveLogo}
                    alt="SavePassword"
                    width="25"
                    height="25"
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  />
                </button>
              </div>
              <div
                className="col"
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label
                  className="col-md-2 control-label"
                  style={{
                    fontWeight: "bold",
                    width: "auto",
                    marginRight: "20px",
                  }}
                >
                  Nuevo Rol
                </label>
                <select
                  name="role"
                  value={data?.role || ""}
                  onChange={handleInputChange}
                  className="form-control"
                  style={{
                    textTransform: "uppercase",
                    boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                    width: "400px",
                    height: "60px",
                    marginRight: "10px",
                    textAlignLast: "center",
                  }}
                >
                  <option value="">Seleccione el rol</option>                  
                  <option value="ADMIN">ADMIN</option>
                  <option value="BIBLIOTECA">BIBLIOTECA</option>
                  <option value="BIENESTAR">BIENESTAR</option>
                  <option value="COMPUTO">COMPUTO</option>
                  <option value="LAB">LAB</option>
                  <option value="CAMPUS">CAMPUS</option>
                </select>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  style={{
                    border: "none",
                    fontWeight: "bold",
                  }}
                  onClick={handleSaveRole}
                >
                  <img
                    src={saveLogo}
                    alt="SaveRole"
                    width="25"
                    height="25"
                    style={{ cursor: "pointer" }}
                  />
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "33px",
                    marginRight: "53px",
                  }}
                >
                  <a
                    type="submit"
                    className="btn btn-dark"
                    href="/root/dashboard"
                    style={{
                      margin: "5px",
                      width: "120px",
                      boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                      fontWeight: "bold",
                      marginLeft: "60px",
                    }}
                  >
                    Regresar
                  </a>
                </div>
              </div>
            </div>
            <br />
          </form>
        </div>
      </React.Fragment>
    </div>
  );
};

export default RootUpdate;
