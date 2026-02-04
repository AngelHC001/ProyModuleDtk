import React from "react";


function CoursesList({listDir = [], onSelect}){
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
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listDir.map((course) => (
                                course[1] === 'CCCC' ? '':
                                <tr className="row-table" key={course[0]} onClick={() => onSelect(course)}> 
                                    <td>{course[2]}-{course[1]}</td>
                                    <td>{course[3]}</td>
                                    <td>{course[4]}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>

    )
} 

export default CoursesList;