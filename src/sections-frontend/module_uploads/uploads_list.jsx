import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useView } from '../../components/viewContext';
import { useUploadCallbacks } from "../../sections-callbacks/section_files";

const API_URL = import.meta.env.VITE_API_URL;

function FileOptions({path}){
    const { eraseFile } = useUploadCallbacks();

    const handleDelete = async (e,fileData) => {
        e.preventDefault();
        if(!confirm('¿Borrar este archivo?')){return; }

        try {
            await eraseFile.mutateAsync(fileData);
            alert('Archivo eliminado de la carpeta');
        } catch (error) {
            console.error(error.message);
            alert('Ocurrio un Error');
        }
    }
    
    return(
        <div>
            <a href='#' 
                className="btn-member me-1">
                <i className="bi bi-download"></i>
            </a>
           
            <button className="btn btn-danger" type="button"
            onClick={(e) => handleDelete(e, path)}>
                <i className="bi bi-trash2"></i>
            </button>
        </div>
    )
}

function FilesUploaded(){
    const { activeView } = useView();
  
    //Funcion Fetch
    const { data, isPending, isError } = useQuery({
        queryKey: ['uploads', activeView.folder],
        queryFn: async({signal}) => {
            const selected = activeView.folder[0];
        
            const response = await fetch(`${API_URL}/s2_get_files.php`,{
                method:'POST',
                body: JSON.stringify({folder: `${selected?.year}_${selected?.sigla}`}),
                signal: signal
            });

            if(!response.ok){
                const data = await response.json();
                throw new Error('Error al cargar '+ data.message);
            }

            return response.json();
        },
        enabled: !!activeView.folder
    })
    

    if(!activeView.folder){
        return(
            <div className="col-md-4">
                 <h3 className="slogan">Selecciona una carpeta para visualizar</h3>
            </div>
        )
    }
    
    return(
        <div className="col-md-6 bg-light rounded shadow">
            <h3 className="slogan">Documentos de la Carpeta</h3>
            <h6 className="slogan">{activeView?.folder[0].name} - {activeView?.folder[0].year}</h6>
            {isPending && <p>CARGANDO DATOS</p>}
            {isError && <p>OCURRIO UN ERROR</p>}    
            {data?.length === 1 && <p>LA CARPETA ESTA VACIA</p>}
            <div className="files-list rounded border">
                {
                    data?.length > 1 &&
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Constancia <i className="bi bi-file-pdf"/></th>
                                    <th>Opciones</th>
                                </tr>
                            </thead>

                            <tbody>
                            {
                                data?.map((f) => (
                                    f?.id !== "0000" &&
                                    <tr key={f?.key} className="row-table">
                                        <td>{f?.id}</td>
                                        <td>{f?.ruta}</td>
                                        <td><FileOptions path={f?.ruta}/></td>
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



export default FilesUploaded;