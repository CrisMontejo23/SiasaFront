import React from 'react';
import logo from "../assetss/img/logo2.png";
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import "../assetss/css/headerPrincipal.css";
import { gatewayURL } from "../services/principal";

class HeaderPrincipal extends React.Component {
  state = {
    role: null,
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = "/";
  }

  componentDidMount() {
    const token = localStorage.getItem('token');    
    fetch(`${gatewayURL}/auth/getroles?token=${token}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ role: data[0] }, () => {          
        });
      });
  }

  render() {
    const { role } = this.state;

    if (['COMPUTO', 'BIBLIOTECA', 'CAMPUS', 'LAB'].includes(role)) {
      return null;
    }
    
    let links = null;

    if (role === 'ROOT') {      
      links = null;
    }else if (role === 'ADMIN') {      
      links = (
        <>
          <Nav.Link href="/rfid" className="text-white">Rfid</Nav.Link>
          <Nav.Link href="/codigou" className="text-white">Codigo U</Nav.Link>
          <Nav.Link href="/campus/dashboard" className="text-white">Campus</Nav.Link>  
          <Nav.Link href="/biblioteca/dashboard" className="text-white">Biblioteca</Nav.Link>     
          <Nav.Link href="/sala/dashboard" className="text-white">Salas de Cómputo</Nav.Link>
          <Nav.Link href="/laboratorio/dashboard" className="text-white">Laboratorios</Nav.Link>                                              
          <NavDropdown title={<span className="text-white">Prestamos</span>} id="basic-nav-dropdown">
            <NavDropdown.Item href="/prestamos/materialDeportivo/adminSearch">Material Deportivo</NavDropdown.Item>
            <NavDropdown.Item href="/prestamos/audioVisual/adminSearch">Audio Visual</NavDropdown.Item>
          </NavDropdown>
        </>
      );
    } else if (role === 'BIENESTAR') {      
      links = (
        <>
          <Nav.Link href="/prestamos/materialDeportivo/dashboard" className="text-white">Material Deportivo</Nav.Link>
          <Nav.Link href="/prestamos/audioVisual/dashboard" className="text-white">Audio Visual</Nav.Link>          
        </>
      );
    }

    return(
      <React.Fragment>
        <Navbar className="bg-success text-white shadow" expand="lg" style={{
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",}}>
          <img src={logo} alt="Logo" className="navbar-brand logo small-logo ml-3" height={35}/>          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Button className="ml-auto" variant="outline-light" onClick={this.handleLogout} style={{marginRight: "40px"}}>Cerrar sesión <img
                src={require("../assetss/img/exit.png")}
                alt="Reload"
                width="20"
                height="20"
                style={{ cursor: "pointer", marginLeft: "5px" }}
              /></Button>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {links}
            </Nav>
            <Nav className="mr-auto">              
            </Nav>            
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default HeaderPrincipal;