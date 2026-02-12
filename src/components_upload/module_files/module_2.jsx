import React,{useState,useEffect} from "react";
import FileUploadForm from "./upload_files";
import FilesUploaded from "./uploaded_files";

const url = import.meta.env.VITE_API_URL;

function ModuleTwo(){
    const [folders, setFolders] = useState([]);
    const [selected, setSelected] = useState('2999_CCCC');
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [loading,setLoading] = useState(true);

    //Llamar  Componente 1 tras upload exitoso
    const triggerRefresh = () => setRefreshSignal(prev => prev + 1);
    const handleSelect = (foldername = '') => { setSelected(foldername); }

    useEffect(() =>{
        const controller = new AbortController();
        const { signal } = controller;

        const loadData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${url}/courses.php`,{method:'GET', signal:signal});
                const data = await response.json();

                if(!signal.aborted){ setFolders(data); }
            } 
            catch (error) {
                console.error("Error cargando cursos", error);
            }
             finally{
                if (!signal.aborted) { setLoading(false); }
            }
        }

        loadData();
        return () => controller.abort();
    },[refreshSignal]);

    return(
        <div className="row d-flex justify-content-center gap-4 mb-4 text-center">
            {loading ? <p>Cargando Cursos</p> : 
                <FileUploadForm onSelect={handleSelect} folderList={folders} onUploadSuccess={triggerRefresh}/> }

            {/* MANDA NOMBRE DE FOLDER PARA SCANEAR */}
            <FilesUploaded folderName={selected} refreshSignal={refreshSignal} />
        </div>
    )
}

export default ModuleTwo;