import React from "react";
import { BeatLoader } from "react-spinners";

export function LoadingScreen(){
    return(
        <div className="text-center">
            <h3 className="slogan">Cargando Datos</h3>
            <BeatLoader color="#a3e635" />
        </div>
    )
}

export function ErrorScreen(){
    return(
        <div className="text-center text-danger">
            <h2>Ocurrio un error</h2>
            <i className="fs-1 bi bi-file-x-fill"/>
        </div>

    )
}

export function EmptyScreen(){
    return(
        <div className="text-center slogan">
            <h2>Todavía no hay datos</h2>
            <i className="fs-1 bi bi-folder-x"/>
        </div>
    )
}

export function EmptyFolder(){
    return(
        <div className="card border-2 d-flex align-items-center slogan-2">
            <h2 className="card-title">Carpeta Lista</h2>
            <i className="fs-1 bi bi-folder2-open"/>
            <h2>Ingresa archivos</h2>
        </div>
    )
}
