import React,{useState,useEffect} from "react";

import FileUploadForm from "./upload_files";
import FilesUploaded from "./uploaded_files";

function ModuleTwo(){
    const [folders, setFolders] = useState([]);
    const [selected, setSelected] = useState('2999_CCCC');
    const [refreshSignal, setRefreshSignal] = useState(0);

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

    //Llamar  Componente 1 tras upload exitoso
    const triggerRefresh = () => setRefreshSignal(prev => prev + 1);
    const handleSelect = (foldername = '') => { setSelected(foldername); }

    useEffect(() =>{
        return () => { loadData(); }
    },[]);

    return(
        <div className="row d-flex justify-content-center gap-4 mb-4 text-center">
            <FileUploadForm onSelect={handleSelect} folderList={folders} onUploadSuccess={triggerRefresh}/>

            {/* MANDA NOMBRE DE FOLDER PARA SCANEAR */}
            <FilesUploaded folderName={selected} refreshSignal={refreshSignal} />
        </div>
    )
}

export default ModuleTwo;