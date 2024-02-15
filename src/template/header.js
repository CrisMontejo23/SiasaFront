import React from 'react';
import logo from "../assetss/img/logo2.png";
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import "../assetss/css/headerPrincipal.css";

class HeaderPrincipal extends React.Component {
  render() {
    return(
      <React.Fragment>
        <Navbar className="bg-success text-white shadow" expand="lg" style={{
                  boxShadow: "3px 3px 10px rgba(0, 0, 0, 1)",
                  fontWeight: "bold",}}>
          <Navbar.Brand href="/login">
            <img src={logo} alt="Logo" className="navbar-brand logo small-logo ml-3" height={35}/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/rfid" className="text-white">Rfid</Nav.Link>
              <Nav.Link href="/codigou" className="text-white">Codigo U</Nav.Link>
              <NavDropdown title={<span className="text-white">Campus</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href="/campus/dashboard">Administrar</NavDropdown.Item>
                <NavDropdown.Item href="/campus/access">Acceso</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<span className="text-white">Biblioteca</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href="/biblioteca/dashboard">Administrar</NavDropdown.Item>
                <NavDropdown.Item href="/biblioteca/access">Acceso</NavDropdown.Item>
              </NavDropdown>              
              <NavDropdown title={<span className="text-white">Salas de Cómputo</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href="/sala/dashboard">Administrar</NavDropdown.Item>
                <NavDropdown.Item href="/sala/access">Acceso</NavDropdown.Item>
              </NavDropdown> 
              <NavDropdown title={<span className="text-white">Laboratorios</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href="/laboratorio/dashboard">Administrar</NavDropdown.Item>
                <NavDropdown.Item href="/laboratorio/access">Acceso</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title={<span className="text-white">Prestamos</span>} id="basic-nav-dropdown">
                <NavDropdown.Item href="/prestamos/materialDeportivo/dashboard">Material Deportivo</NavDropdown.Item>
                <NavDropdown.Item href="/prestamos/audioVisual/dashboard">Audio Visual</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default HeaderPrincipal;