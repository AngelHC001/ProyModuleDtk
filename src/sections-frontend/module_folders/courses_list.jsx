import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useFolderCallback } from "../../sections-callbacks/section_folders";

const API_URL = import.meta.env.VITE_API_URL;

function CoursesList(){
    const { deleteFolder } = useFolderCallback();

    const handleDelete = async(e, folderData) => {
        e.preventDefault();
        if(!confirm('Borrar folder, elminará tambien sus archivos')){ return; } 
        
        try {
            await deleteFolder.mutateAsync(folderData)
            alert('Folder Borrado');
        } catch (error) {
            console.error(error.message);
            alert('Algo salio mal');
        }
    }

    //Funcion Fetch
    const {data, isPending, isError} = useQuery({
        queryKey: ['folders'],
        queryFn: async ({signal}) => {
            const response = await fetch(`${API_URL}/s1_folders.php`,{ 
                method:'GET', 
                headers: { 'Content-Type':'application/json' },
                signal: signal 
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();   
        }
    });

    return(
        <div className="col-md-7 bg-light shadow rounded">
            <h1 className="slogan">Cursos Registrados</h1>
            <div className="courses-table rounded">   
                {isError && 'OCURRIO UN ERROR'}
                {isPending && 'CARGANDO CURSOS'}
                {
                    data?.length !== 0 &&
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
                            data?.map((folder) => (
                                folder?.id !== 9999 &&
                                <tr className="row-table" key={folder?.key}> 
                                    <td>{folder?.year}-{folder?.sigla}</td>
                                    <td>{folder?.name}</td>
                                    <td>{folder?.id}</td>
                                    <td>
                                        <a href={`${API_URL}/s1_download_zip.php?folder=${folder?.year}_${folder?.sigla}`} 
                                        className="btn-member">
                                            <i className="bi bi-download"></i> 
                                        </a>
            
                                        <button className="btn btn-danger" type="button"
                                            onClick={(e) => handleDelete(e, folder)}>
                                            <i className="bi bi-trash2"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                     </tbody>
                    </table>
                }               
            </div>
        </div>

    )
} 

export default CoursesList;