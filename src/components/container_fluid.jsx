import React from "react";

/* FUNCION EXCLUSIVA PARA SECCIONES DEL HOME PAGE, NO ES PARA HEADER NI FOOTER */
export default function ContainerFluid({children, classAdditions = ''}){
    return(
        <div className={`container-fluid p-3 ${classAdditions}`}>
            {children}
        </div>
    )
}