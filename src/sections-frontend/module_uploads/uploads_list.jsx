import React, {useState, useEffect} from "react";

const url = import.meta.env.VITE_API_URL;

const eraseFile = async(pathString)=>{
    if(pathString === null ){ 
        alert('Sin archivo elegido');
        return; 
    }

    try {
        const response = await fetch(`${url}/m2_file_process.php`,{
            method:'DELETE',
            body: JSON.stringify({rutaArchivo: pathString})            
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Algo salio mal',error);
    }
}


function FilesUploaded({folderName, refreshSignal}){
    const [load,setLoad] = useState(true);
    const [files,setFiles] = useState([]);
    const [selected, setSelected] = useState(null);
   
    const handleDelete = async (event, fileItem) => {
        event.preventDefault();
        const response = await eraseFile(fileItem);
        if(response.success){
            setFiles((prevFiles) => prevFiles.filter(f => f.ruta !== fileItem));
            setSelected(null);
            alert(response.message);
        }
    }


    useEffect(() =>{
        const controller = new AbortController();
        const { signal } = controller;

        const fetchFiles = async () => {
            if(folderName === '2999_CCCC'){ 
                setFiles([]);
                setLoad(false); 
                return; 
            }
            setLoad(true);
            try{
                const response = await fetch(`${url}/m2_get_files.php`,{
                    method:'POST',
                    body: JSON.stringify({folder: folderName}),
                    signal: signal
                });
                const data = await response.json();
                setFiles(data);
            }catch(err){
                console.error('ERROR AL LEER CARPETA ',err);
            }
            finally{
                if (!signal.aborted) { setLoad(false); }
            }
        }
        fetchFiles();
        return () => controller.abort();
    },[folderName,refreshSignal]);
    
    if(folderName !== '2999_CCCC'){
        return(
            <div className="col-md-4 bg-light rounded shadow">
                <h3 className="slogan">Documentos de la carpeta {folderName}</h3>
                
                <div className="alert alert-secondary">
                    <small>{selected}</small>  
                </div>


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
                            <tr>
                                <td>99</td>
                                <td>AAAA</td>
                                <td>          
                                    <button className="btn btn-info btn-sm me-1" onClick={(e) => handleDelete(e,selected)}>
                                        <i className="bi bi-download"></i>
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(e,selected)}>
                                        <i className="bi bi-trash2"></i>
                                    </button>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>

                {/*
        

                <div className="files-list mb-2">
                    {
                        load ? <p>Cargando</p> :
                        <ul className="list-group">
                            {
                                files.length === 1 ? <p>La Carpeta esta vacia</p> :
                                    files.map((item) => (
                                        item.id === "0000" ? '' :
                                        <li className="file-item list-group-item" key={item.id}>
                                            <button className="btn" onClick={() => setSelected(item.ruta)}>
                                                No. {item.id} - {item.ruta}
                                            </button>
                                        </li>
                            ))}
                        </ul>
                    }
                </div>/*/}
            </div>
        )
    }
    else
    {
        return(
            <div className="col-md-4 bg-light rounded shadow">
                <h3 className="slogan">Documentos de la carpeta</h3>
            </div>
        )
    }
}

export default FilesUploaded;