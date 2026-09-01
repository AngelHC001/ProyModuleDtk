import React, { useState}from "react";
import { useFolderCallback } from "../../sections-callbacks/section_folders";

//-----------------FORMULARIO--------------------

const CoursesForm = () => {
  const [message, setMessage] = useState({text:'',alert_mode:'alert-secondary'}); //mode success - danger - none
  const [folderData, setFolderData] = useState({ id: '', sigla: '',name: '',year: ''});
  const { createFolder } = useFolderCallback();
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFolderData((prev) => ({...prev, [name]:value}));
  }
  
  const handleClear = () => {   
    setFolderData({ id: '', sigla: '', name: '', year: '' });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await createFolder.mutateAsync(folderData);
      handleClear();     
      setMessage({text: 'Folder Creado', alert_mode:'alert-success'});
    } catch (error) {
        console.error(error.message);
        setMessage({text: 'Algo salio mal', alert_mode: 'alert-danger'});
    }
  }

  return (
    <div className="col-md-4 shadow rounded bg-light p-3">
        <h2 className="slogan-2">Crear Nueva Carpeta</h2>
        <div className={`alert ${message.alert_mode}`} role="alert">
            {message.text}
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2 p-2">
            <div className="input-group">
              <label className="col-form-label me-2">
                ID General <i className="ms-1 bi bi-qr-code"></i>
              </label>
              <input name="id" className="form-control" type="number" 
                value={folderData.id} onChange={handleChange} required/>      
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">Nombre Curso: </label>
              <input name="name" className="form-control" type="text" 
                value={folderData.name} onChange={handleChange} required/>        
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">[Sigla Curso - Año]</label>
              <input name="sigla" className="form-control" type="text" placeholder="(Ej. MEAD, EACD...)" 
                value={folderData.sigla} onChange={handleChange} required/>
          
              <input name="year" className="form-control" type="number" min={2015} 
                value={folderData.year} onChange={handleChange} required/>
            </div>

            <small>Se verá este Folio en "Cargar Archivos": <b> {folderData.sigla}-##-{folderData.year} </b> </small>
            <div>
               <button className="btn-member me-2" type="button" onClick={handleClear}>
                  <i className="bi bi-arrow-counterclockwise"/>
               </button>
              <button className="btn-member me-2" type="submit">
                  <i className="bi bi-folder-fill me-1"/>
                  Crear
              </button>
            </div>
        </form>
    </div>
   
  );
};

export default CoursesForm;