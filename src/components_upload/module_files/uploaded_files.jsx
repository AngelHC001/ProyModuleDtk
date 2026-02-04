import React, {useState, useEffect} from "react";

//recibe un foldername
const LoadFolder = async(folder) =>{
    try{
        const req = await fetch('/api/get_files.php',{
            method:'POST',
            body: JSON.stringify(folder)
        });

        const data = req.text();
        console.log(data);
        
    }catch(err){
        console.log('ERROR AL LEER CARPETA ',err);
    }
}



function FilesUploaded({folderName}){
    const [load,setLoad] = useState(true);

    //const [files,setFiles] = useState([]);
    //const [selected, setSelected] = useState(null);
    useEffect(() =>{
        return () => {
            LoadFolder(folderName); 
            setLoad(false);
        }
    });


    if(folderName !== '2999-CCCC'){
        return(
            <div className="col-md-4 bg-light rounded shadow">
                <h3 className="slogan">Documentos de la carpeta {folderName}</h3>
                
                <div className="d-flex justify-content-center gap-2 mb-2">
                    <small className="mb-3">Documento elegido: [clicked]</small>

                    <button className="btn btn-outline-success">
                        <i className="bi bi-download me-1"></i>
                        Descargar
                    </button>
                    <button className="btn btn-outline-danger">
                        <i className="bi bi-trash-fill me-1"></i>
                        Remover
                    </button>
                </div>

            
                <div className="files-list mb-2">
                    <ul className="list-group">
                    <li className="list-group-item">Constancia1 (##)</li>
                        <li className="list-group-item">Constancia2 (##)</li>
                        <li className="list-group-item">Constancia1 (##)</li>
                        <li className="list-group-item">Constancia2 (##)</li>
                        <li className="list-group-item">Constancia1 (##)</li>
                        <li className="list-group-item">Constancia2 (##)</li>
                        <li className="list-group-item">Constancia1 (##)</li>
                    </ul>
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