import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useView } from '../../components/viewContext';
import { useUploadCallbacks } from "../../sections-callbacks/section_files";
import { LoadingScreen, ErrorScreen, EmptyFolder } from "../../components/source_loading";

const API_URL = import.meta.env.VITE_API_URL;


function ItemsPanel({children}){
    return(
        <div className="col-md-6 bg-light rounded shadow">
            <h3 className="slogan">Documentos de la Carpeta</h3>
            { children }
        </div>
    )
}


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
        <button className="btn-member btn-alert" type="button"
        onClick={(e) => handleDelete(e, path)}>
            <i className="bi bi-trash2"></i>
        </button>
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
            <div className="col-md-4 d-flex align-items-center">
                <div className="card border-2 p-2 slogan">
                    <h2 className="card-title">Selecciona una carpeta para visualizar</h2>
                    <div className="card-body">
                          <i className="display-2 bi bi-folder-symlink"/>
                    </div>
                </div>
            </div>
        )
    }
    
    return(
        <ItemsPanel>
            <h6 className="slogan">{activeView?.folder[0].name} - {activeView?.folder[0].year}</h6>
            {
                isPending ? <LoadingScreen/> :
                    isError ? <ErrorScreen/> :
                        data?.length === 1 ? <EmptyFolder/> :

                        <div className="items-table rounded">
                            <table className="table">
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
                        </div>
                }   
        </ItemsPanel>
    )
}



export default FilesUploaded;