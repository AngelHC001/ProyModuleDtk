import React,{useState} from "react";

import ContainerFluid from '../components/container_fluid';
import ModuleOne from "./module_courses/module_1";
import ModuleTwo from "./module_uploads/module_2";
import ModuleThree from "./module_users/module_3";
import Login from "./module_login";

// Configuración de las pestañas
const TABS_CONFIG = [
    { id: 'crear', label: 'Nueva Carpeta', component: <ModuleOne/> },
    { id: 'carga', label: 'Cargar Archivos', component: <ModuleTwo/> },
    { id: 'usuarios', label: 'Usuarios', component: <ModuleThree/>},
];


function UploadsModule(){
    const [activeTab,setActiveTab] = useState('crear');
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
     // Renderizar el componente activo
    const activeTabConfig = TABS_CONFIG.find(t => t.id === activeTab);
    // Encuentra el componente activo
    const ActiveComponent = activeTabConfig ? activeTabConfig.component : null;
        
    return(
        <ContainerFluid>      
            <h1 className="text-center p-2 slogan-2">Gestión de Constancias y Certificados</h1>
            
            <div className="bg-white shadow-lg rounded overflow-hidden">
                {/* Cabecera / Navegación */}
                <div className="d-flex flex-wrap justify-content-center gap-2 p-3">
                    {TABS_CONFIG.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`btn btn-lg ${activeTab === tab.id ? 'btn-primary' : 'btn-outline-primary'}`}>
                            {tab.label}
                        </button>
                    ))}
                    <button className="btn btn-lg btn-outline-danger">
                    Cerrar Sesión </button>
                    
                    <div className="alert alert-info mb-0">
                        Sesion Iniciada: {localStorage.getItem('user')}
                    </div>
                    <hr/>
                    
                    {/* Área de Contenido Dinámico */} 
                    <div className="p-2">
                        {ActiveComponent}
                    </div>
                </div>          
            </div>
        </ContainerFluid>
    )              
}

export default UploadsModule;