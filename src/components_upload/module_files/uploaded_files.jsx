import React, {useState, useEffect} from "react";


const eraseFile = async(pathString)=>{
    if(pathString === null ){ 
        alert('Sin archivo elegido');
        return; 
    }

    try {
        const response = await fetch('/api/file_process.php',{
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
                const response = await fetch('/api/get_files.php',{
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
              
                <div className="d-flex justify-content-center gap-2 mb-2">
                    <button className="btn btn-outline-secondary" onClick={() => setSelected(null)}>
                        <i className="bi bi-eraser-fill"></i>
                    </button>

                    <button className="btn btn-outline-success">
                        <i className="bi bi-download"></i>
                    </button>

                    <button className="btn btn-outline-danger" onClick={(e) => handleDelete(e,selected)}>
                        <i className="bi bi-trash-fill"></i>
                    </button>
                </div>

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
                </div>
            </div>
        )
    }
    else
    {
        return(
            <div className="col-md-4 bg-light rounded shadow">
                <h3 className="slogan">Documentos de la carpeta</h3>
                <h6>Seleccion por defecto 2999-CCCC</h6>
            </div>
        )
    }
}

export default FilesUploaded;