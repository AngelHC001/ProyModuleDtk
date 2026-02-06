import React, {useState, useEffect } from "react"


const DataProcess = async(formData) => {
    try {
        const response = await fetch('/api/file_process.php',{
            method:'POST',
            body: formData
        });
        
        return await response.json();
    } catch (error) {
        console.log('Error al subir',error);
    }
}


function FileUploadForm({onSelect, folderList = [], onUploadSuccess}){
    const thisYear = new Date().getFullYear().toString();
    const [loading,setLoading] = useState(true);
    const [message, setMessage] = useState({text:'',alertColor:'alert-secondary'});
    //Form States
    const [folio, setFolio] = useState({sigla:'CCCC', year:thisYear});
    const [file, setFile] = useState(null);
    const [num, setNum] = useState(0); //input de enmedio

    useEffect(() => {
        return () => {
            folderList ? setLoading(false) : setLoading(true); 
        }
    })

    const handleChange = (e) =>{
        const value = e.target.value;
        if (value) {
        const [sigla,year] = value.split('-');
            setFolio({
                ...folio,
                sigla: sigla,
                year: year,   
            });
        }
    }

    const handleNumber = (e) =>{
        const value = e.target.value;
        setNum(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Contenedor
        const formData = new FormData();
        formData.append('sigla',folio.sigla);
        formData.append('year',folio.year);
        formData.append('num',num);
       
        if(file){
            formData.append('docfile',file);
        }
        
        const response = await DataProcess(formData);
        if (response.success) {
            Clear(e);
            onUploadSuccess();
            setMessage({text: response.message, alertColor:'alert-success'});
        }
        else{
            setMessage({text: response.message, alertColor:'alert-danger'});
        }
    }

    //LIMPIAR FORMULARIO
    const Clear = async (e) =>{
        e.preventDefault();
        setNum(0);
        setFile(null);
    } 

    return(
        <div className="col-md-5 bg-light rounded shadow p-3">
            <h1 className="slogan-2">Cargar Constancias</h1>
            <small className="mb-2">Sube archivos para la carpeta seleccionada</small>
            
            <div className={`alert ${message.alertColor}`}>
                {message.text}
            </div>

            <form className="d-flex flex-column gap-3">
                <div className="input-group">
                    <label className="col-form-label me-2">Elegir Carpeta: </label>   
                    
                    {loading ? <p>Cargando Carpetas</p> : 
                        <select className="form-select" onChange={handleChange}>
                            {
                                folderList.map((folder) => (
                                    <option key={folder.key} value={`${folder.sigla}-${folder.year}`}> 
                                        {folder.year}-{folder.sigla}
                                    </option>
                            ))}
                        </select>
                    }
                    <button className="btn btn-outline-info" onClick={() => {onSelect(`${folio.year}_${folio.sigla}`)}}>
                        <i className="bi bi-search me-1"></i>
                        Revisar
                    </button>
                </div>

                <input className="form-control" type="file" accept=".pdf,.png,.jpg" 
                    onChange={(e) => setFile(e.target.files[0])} required/>
               

                <div className="input-group">
                    <label className="col-form-label me-2">Folio de Accesso: </label>
                    <input name="sigla" className="form-control" type="text" value={folio.sigla} readOnly/>
                    <input name="num" className="form-control" type="number" value={num} min={0} max={50} 
                       onChange={handleNumber} required/>
                    <input name="year" className="form-control" type="text" value={folio.year} readOnly/>
                </div>

                <div className="d-flex gap-1">
                    <button className="btn btn-primary" type="submit" onClick={e => handleSubmit(e)}>Subir Archivo</button>
                    <button className="btn btn-danger" onClick={e => Clear(e)}>Cancelar</button>     
                </div>

                {/* <ProgressBar progress={}/> */}
            </form>
        </div>
    )
}

export default FileUploadForm;