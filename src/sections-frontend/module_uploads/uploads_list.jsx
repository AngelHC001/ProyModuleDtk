import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useView } from '../../components/viewContext';


const API_URL = import.meta.env.VITE_API_URL;


function FilesUploaded(){
    const { activeView } = useView();
    
    
    const handleDownload = () => {
        return;
    }

    const handleDelete = () => {
        return;
    }
    //llega tarde o se pierde de inmediato
    
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
        <div className="col-md-4 bg-light rounded shadow">
            <h3 className="slogan">Documentos de la Carpeta</h3>
            <h6 className="slogan">{111}</h6>
            {isPending && <p>CARGANDO DATOS</p>}
            {isError && <p>OCURRIO UN ERROR</p>}    
            {data?.length === 0 && <p>LA CARPETA ESTA VACIA</p>}

            {
                data?.length !== 0 &&
                    <table className="table table-hover files-list">
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
                            
                            <tr key={f.key}>
                                <td>{f?.id}</td>
                                <td>{f?.ruta}</td>
                                <td>          
                                    <button className="btn btn-info btn-sm me-1" onClick={(e) => handleDownload(e,f?.ruta)}>
                                        <i className="bi bi-download"></i>
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(e,f?.ruta)}>
                                        <i className="bi bi-trash2"></i>
                                    </button>
                                </td>
                            </tr>
                            ))
                        }
                        </tbody>
                    </table>
                }
        </div>
    )
}



export default FilesUploaded;