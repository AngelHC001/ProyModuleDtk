import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import logoHead from '../assets/img/LogoData32.png';

const SITE_ONE= 'https://datametrika.com';

export function NavLink({route,name_site}){
    return(
        <li className='nav-item'>
            <Link className='nav-link' to={route}>{name_site}</Link>
        </li> 
    )
}

function ChartDiv({activation}){
    return(
        <div className={`bar-chart-effect ${activation}`}>
            <div className="bar bar-1"></div>
            <div className="bar bar-2"></div>
            <div className="bar bar-3"></div>
            <div className="bar bar-4"></div>
            <div className="bar bar-5"></div>
        </div>
    )
}


function MainHeader() {
    const [active, setActive] = useState(false);
    return(
        <nav className="navbar navbar-expand-md fixed-top nav-theme" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)}>
            <div className="container-fluid mx-auto px-4">
                <Link className='navbar-brand' to={SITE_ONE}>                  
                    <img className='nav-logo rounded me-3' src={logoHead} width={75} height={70} alt="" />
                    <p className='logo-text d-inline-block align-top my-1'>Datametrika</p>
                </Link>
                   
                <ChartDiv activation={active ? "active" : ""}/>
                
                <div className="justify-content-end">
                    <ul className="navbar-nav justify-content-start">
                        <a className='nav-item nav-link' href={SITE_ONE}>Volver a Inicio</a>
                    </ul>
                </div> 
            </div>
        </nav>
    )
}

export default MainHeader;