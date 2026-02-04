import React from "react"

function MainFooter(){
    return(
        <div className="container-fluid">
            <footer className="row bg-dark p-1 border-top">
                <div className="d-flex justify-content-between text-secondary">
                    <span className="col-md-6">
                    <i className="bi bi-c-circle me-2"></i>
                    2025 Datametrika. Todos los derechos reservados.
                    </span>

                    <span className="col-md-6 text-end">Villahermosa, Tabasco, México</span>
                </div>
            </footer>
        </div>
    )
}

export default MainFooter;