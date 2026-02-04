import React,{useState,useEffect} from "react";

import FileUploadForm from "./upload_files";
import FilesUploaded from "./uploaded_files";

function ModuleTwo(){
    const [folders, setFolders] = useState([]);
    const [selected, setSelected] = useState('');

    const loadData = async () => {
        try {
            const response = await fetch('/api/courses.php');
            const data = await response.json();
            setFolders(data);
        } 
        catch (error) {
            console.error("Error cargando cursos", error);
        }
    }


    //const loadFiles = async () =>{
      //  const req = await fetch('/api/file_process.php',)
        //const data = await req.json();
        //setFiles(data);
    //}

    //selectedfolder
    //conforme seleccione el folder
    //se despliegan el contenido
    //files uploaded recibe solo el nombre
    //Form envia un nombre 
    //list lo recibe
    
    const handleSelect = (foldername) => {
        setSelected(foldername);
    }

    useEffect(() =>{
        return () => { loadData(); }
    },[]);


    return(
        <div className="row d-flex justify-content-center gap-4 mb-4 text-center">
            <FileUploadForm onSelect={handleSelect} folderList={folders}/>

            {/*SELECTED FOLDER FOR SCAN? */}
            <FilesUploaded folderName={selected}/>
        </div>
    )
}

export default ModuleTwo;