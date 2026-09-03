import React, {useEffect, useRef, useState } from "react"
import { useQuery } from "@tanstack/react-query";
import { useView } from "../../components/viewContext";
import { useUploadCallbacks } from "../../sections-callbacks/section_files";

const API_URL = import.meta.env.VITE_API_URL;


function FileUploadForm(){
    const { activeView, setActiveView } = useView();
    const { uploadFile } = useUploadCallbacks();
    const selectRef = useRef();

    const thisYear = new Date().getFullYear().toString();
    const [message, setMessage] = useState({text:'', alertColor:'alert-secondary'});
    const [folio, setFolio] = useState({sigla:'CCCC', num: 1, year:thisYear}); 
    const [file, setFile] = useState(null); 

    useEffect(() => {
        if(activeView.folder){
            const selected = activeView.folder[0]; 
            setFolio({sigla: selected.sigla, num: 1, year: selected.year});
        }
    },[activeView.folder]);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setFolio((prev) => ({...prev, [name]:value}))
    }

    const handleClear = () => {
        setFolio({ sigla:'CCCC', num: 1, year:thisYear });
        setFile(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append('sigla',folio.sigla);
            formData.append('num',folio.num);
            formData.append('year',folio.year);
            
            if(file){
                formData.append('docfile',file);
            }   
            
            await uploadFile.mutateAsync(formData);
            setFile(null);
            setMessage({text: 'Archivo Subido', alertColor: 'alert-success'});
        }catch(err){
            console.log('ERROR AL SUBIR ARCHIVO ' +err.message);
            setMessage({text: 'Algo salio mal', alertColor: 'alert-danger'});
        }        
    }
 
    //Funcion Fetch
    const {data, isPending, isError} = useQuery({
        queryKey: ['uploads'],
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
      
    const handleOpenFolder = () => {
        const selectedValue = selectRef.current.value; 
        const folderfound = data?.filter(f => `${f.year}_${f.sigla}` === selectedValue)
        setActiveView({type: 'uploads', folder: folderfound});
    }

    return(
        <div className="col-md-5 bg-light rounded shadow p-3">
            <h1 className="slogan-2">Cargar Constancias</h1>
            <small className="mb-2">Sube archivos para la carpeta seleccionada</small>
            
            <div className={`alert ${message.alertColor}`}>
                {message.text}
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="d-flex flex-column gap-3">
                <div className="input-group">
                    <label className="col-form-label me-2">Elegir Carpeta: </label>
                        {isPending && <p>CARGANDO DATOS</p>}
                        {isError && <p>OCURRIO UN ERROR</p>}
                        {
                            data?.length !== 0 &&   
                            <select className="form-select" size={3} ref={selectRef}>
                                {
                                    data?.map((folder) => (
                                        folder?.id !== 9999 &&
                                        <option key={folder?.key} value={`${folder?.year}_${folder?.sigla}`}> 
                                            {folder.year}-{folder.sigla}
                                        </option>
                                ))}
                            </select>
                        }
                    <button className="btn-member" type="button" onClick={handleOpenFolder}>
                        <i className="fs-4 bi bi-folder-fill me-1"/>Abrir
                    </button>
                </div>

                <input className="form-control" type="file" accept=".pdf,.png,.jpg" 
                    onChange={(e) => setFile(e.target.files[0])} required/>
               
                <div className="input-group">
                    <label className="col-form-label me-2">Folio de Accesso: </label>
                    <input name="sigla" className="form-control" type="text" value={folio.sigla}  
                       onChange={handleChange} readOnly/>
                    <input name="num" className="form-control" type="number" value={folio.num} min={1}
                       onChange={handleChange} required/>
                    <input name="year" className="form-control" type="text" value={folio.year} 
                       onChange={handleChange} readOnly/>
                </div>

                <div className="d-flex justify-content-center gap-1">
                    <button className="btn-member" type="button" onClick={handleClear}>
                        <i className="bi  bi-arrow-counterclockwise me-1"/>Cancelar
                    </button>     
                    <button className="btn-member" type="submit">
                        <i className="bi bi-upload me-1"/> Subir Archivo
                    </button>
                </div>

                {/* <ProgressBar progress={}/> */}
            </form>
        </div>
    )
}

export default FileUploadForm;