import React from "react";
import "../../assetss/css/login/login.css";
import logo from "../../assetss/img/logo.png";
import axios from "axios";
import { gatewayURL } from "../../services/principal";
import bgImage from "../../assetss/img/background4.jpg";

class Login extends React.Component {
  state = {
    form: {
      user: "",
      password: "",
    },
    error: false,
    errorMsg: "",
  };

  manejadorChange = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
    let url = gatewayURL + "login";
    axios
      .post(url, this.state.form)
      .then((response) => {
        console.log(response);
        if (response.data.status === "ok") {
          localStorage.setItem("token", response.data.result.token);
          localStorage.setItem("user", response.data.user);
          this.props.history.push("/principal");
        } else {
          this.setState({
            error: true,
            errorMsg: response.data.message,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          error: true,
          errorMsg: "Error al conectar con la API",
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            backgroundImage: `url(${bgImage}), linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.7))`,
            backgroundBlendMode: "overlay",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
          }}
        >
          <div className="wrapper fadeInDown">
            <div id="formContent">
              <div className="fadeIn first">
                <img src={logo} id="icon" alt="User Icon" />
              </div>

              <form onSubmit={this.manejadorSubmit}>
                <input
                  type="text"
                  className="fadeIn second"
                  name="user"
                  placeholder="Usuario"
                  onChange={this.manejadorChange}
                />
                <input
                  type="password"
                  className="fadeIn third"
                  name="password"
                  placeholder="Contraseña"
                  onChange={this.manejadorChange}
                />
                <input
                  type="submit"
                  className="fadeIn fourth"
                  value="Ingresar"
                  onClick={this.manejadorSubmit}
                  style={{ backgroundColor: "#28a745", color: "white" }}
                />
              </form>

              {this.state.error === true && (
                <div className="alert alert-danger" role="alert">
                  {this.state.errorMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
