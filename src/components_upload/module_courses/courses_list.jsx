import React from "react";

//aqui van el fetch y operaciones


function CoursesList(){
    return(
        <div className="col-md-6 bg-light shadow rounded">
            <h1 className="slogan">Cursos Registrados</h1>
            <div className="courses-table rounded">   
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>CURSO</th>
                            <th>NOMBRE</th>
                            <th><i className="bi bi-qr-code"></i></th>
                            <th>Opciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            /*
                            listDir.map((course) => (
                                course.sigla === 'CCCC' ? '':
                                <tr className="row-table" key={course.key} onClick={() => onSelect(course)}> 
                                    <td>{course.year}-{course.sigla}</td>
                                    <td>{course.name}</td>
                                    <td>{course.id}</td>
                                    <td>
                                        <button className="btn btn-info me-1">
                                            <i className="bi bi-download"/>
                                        </button>
                                        <button className="btn btn-danger">
                                            <i className="bi bi-trash2"/>
                                        </button>
                                    </td>
                                </tr>
                            ))*/
                        }
                    </tbody>
                </table>
            </div>
        </div>

    )
} 

export default CoursesList;