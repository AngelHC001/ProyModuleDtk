import React,{useState} from "react";

import { ViewContext } from "../components/viewContext";

import ContainerFluid from '../components/container_fluid';
import ModuleOne from "./module_courses/module_1";
import ModuleTwo from "./module_uploads/module_2";
import ModuleThree from "./module_users/module_3";
import Login from "./module_login";


// Configuración de las pestañas
const TABS_CONFIG = [
    { key: 'p1', id: 'folders', label: 'Carpetas', icon: <i className="bi bi-folder fs-5 me-1"/> },
    { key: 'p2', id: 'uploads', label: 'Cargar Archivos', icon: <i className="bi bi-upload fs-5 me-1"/> },
    { key: 'p3', id: 'users', label: 'Usuarios', icon: <i className="bi bi-person fs-5 me-1"/>},
];

function UploadsModule(){
    const [activeView,setActiveView] = useState({type:'folders'});
    //const [estaLogueado, setEstaLogueado] = useState(() => { return !!localStorage.getItem('token'); }); 
    /*
    //Guardar la Sesion
    const handleLoginSuccess = (token, username, id) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', username);
        localStorage.setItem('id',id);
        setEstaLogueado(true);
    };

     //logout
    const handleLogout = () => {
        localStorage.clear();
        setEstaLogueado(false);
    };

    // RENDERIZADO CONDICIONAL
    if (!estaLogueado) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
    */        
    return(
        <ContainerFluid>      
            <h1 className="text-center p-2 slogan-2">Gestión de Constancias y Certificados</h1>
            
            <div className="bg-white shadow-lg rounded overflow-hidden">
                <ViewContext.Provider value={{activeView, setActiveView}}>
                    <div className="nav-banner flex-wrap justify-content-center">
                        
                        {TABS_CONFIG.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveView({type : tab.id})}
                                className={`nav-btn ${activeView.type === tab.id ? 'active' : ''}`}>
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    
                        <button className="nav-btn">
                            <i className="bi bi-box-arrow-in-left fs-5 me-1"/>
                            Cerrar Sesión 
                        </button>

                        <div className="alert alert-info mb-0">
                            Sesion Iniciada: useAuth()
                        </div>
                    </div>
                </ViewContext.Provider>

                {/* Área de Contenido Dinámico */} 
                <div className="p-2">
                    {activeView.type === 'folders' && <ModuleOne/>}
                    {activeView.type === 'uploads' && <ModuleTwo/>}
                    {activeView.type === 'users' && <ModuleThree/>}
                </div>
            </div> 
        </ContainerFluid>
    )              
}

export default UploadsModule;