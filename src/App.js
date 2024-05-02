import React from 'react';
import './assetss/css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/login/login';

import Rfid from './components/principal/rfidAPI/rfid';

import Codigou from './components/principal/codigouAPI/codigou';
import CreateCodigou from './components/principal/codigouAPI/create';
import UpdateCodigou from './components/principal/codigouAPI/update';

import CampusDashboard from './components/principal/campusAPI/dashboard';
import CampusAccess from './components/principal/campusAPI/access';
import CampusSearch from './components/principal/campusAPI/search';

import BibliotecaDashboard from './components/principal/bibliotecaAPI/dashboard';
import BibliotecaAccess from './components/principal/bibliotecaAPI/access';
import BibliotecaSearch from './components/principal/bibliotecaAPI/search';

import SalaDashboard from './components/principal/salaAPI/dashboard';
import SalaAccess from './components/principal/salaAPI/access';
import SalaSearch from './components/principal/salaAPI/search';

import LaboratorioDashboard from './components/principal/laboratorioAPI/dashboard';
import LaboratorioAccess from './components/principal/laboratorioAPI/access';
import LaboratorioSearch from './components/principal/laboratorioAPI/search';

import MaterialSearch from './components/prestamos/materialDeportivoAPI/search';
import MaterialAdminSerch from './components/prestamos/materialDeportivoAPI/adminSearch';
import MaterialRegister from './components/prestamos/materialDeportivoAPI/registerObject';
import MaterialUpdate from './components/prestamos/materialDeportivoAPI/updateObject';
import MaterialDashboard from './components/prestamos/materialDeportivoAPI/dashboard';

import AudioSearch from './components/prestamos/audioVisualAPI/search';
import AudioAdminSerch from './components/prestamos/audioVisualAPI/adminSearch';
import AudioRegister from './components/prestamos/audioVisualAPI/registerObject';
import AudioUpdate from './components/prestamos/audioVisualAPI/updateObject';
import AudioDashboard from './components/prestamos/audioVisualAPI/dashboard';

import CampusReport from './components/reportes/campus';
import BibliotecaReport from './components/reportes/biblioteca';
import SalaReport from './components/reportes/sala';
import LaboratorioReport from './components/reportes/laboratorio';

import RootDashboard from './components/roles/root/dashboard';
import RootUpdate from './components/roles/root/update';
import RootCreate from './components/roles/root/create';

function App() {
  return (
    <React.Fragment>
      <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rfid" element={<Rfid />} />                    

          <Route path="/codigou" element={<Codigou />} />            
          <Route path="/codigou/create" element={<CreateCodigou />} />          
          <Route path="/codigou/update/:codigou" element={<UpdateCodigou />} />

          <Route path="/campus/dashboard" element={<CampusDashboard />} />
          <Route path="/campus/access" element={<CampusAccess />} />
          <Route path="/campus/dashboard/search" element={<CampusSearch />} />
          <Route path="/campus/report" element={<CampusReport />} />

          <Route path="/biblioteca/dashboard" element={<BibliotecaDashboard />} />
          <Route path="/biblioteca/access" element={<BibliotecaAccess />} />
          <Route path="/biblioteca/dashboard/search" element={<BibliotecaSearch />} />
          <Route path="/biblioteca/report" element={<BibliotecaReport />} />

          <Route path="/sala/dashboard" element={<SalaDashboard />} />          
          <Route path="/sala/access" element={<SalaAccess />} />
          <Route path="/sala/dashboard/search" element={<SalaSearch />} />
          <Route path="/sala/report" element={<SalaReport />} />

          <Route path="/laboratorio/dashboard" element={<LaboratorioDashboard />} />
          <Route path="/laboratorio/access" element={<LaboratorioAccess />} />
          <Route path="/laboratorio/dashboard/search" element={<LaboratorioSearch />} />
          <Route path="/laboratorio/report" element={<LaboratorioReport />} />

          <Route path="/prestamos/materialDeportivo/dashboard" element={<MaterialDashboard />} />
          <Route path="/prestamos/materialDeportivo/search" element={<MaterialSearch />} />
          <Route path="/prestamos/materialDeportivo/adminSearch" element={<MaterialAdminSerch />} />
          <Route path="/prestamos/materialDeportivo/inventario/register" element={<MaterialRegister />} />  
          <Route path="/prestamos/materialDeportivo/inventario/update/:objectID" element={<MaterialUpdate />} /> 

          <Route path="/prestamos/audioVisual/dashboard" element={<AudioDashboard />} />
          <Route path="/prestamos/audioVisual/search" element={<AudioSearch />} />
          <Route path="/prestamos/audioVisual/adminSearch" element={<AudioAdminSerch />} />
          <Route path="/prestamos/audioVisual/inventario/register" element={<AudioRegister />} />  
          <Route path="/prestamos/audioVisual/inventario/update/:objectID" element={<AudioUpdate />} />   

          <Route path="/root/dashboard" element={<RootDashboard />} />        
          <Route path="/root/update/:id" element={<RootUpdate />} />
          <Route path="/root/create" element={<RootCreate />} />
        </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;