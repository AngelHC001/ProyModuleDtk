import React, { useState}from "react";
import { useFolderCallback } from "../../sections-callbacks/section_folders";

//-----------------FORMULARIO--------------------

const CoursesForm = () => {
  const [message, setMessage] = useState({text:'',alert_mode:'alert-secondary'}); //mode success - danger - none
  const [folderData, setFolderData] = useState({ sigla: '',name: '',year: ''});
  const { createFolder } = useFolderCallback();
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFolderData((prev) => ({...prev, [name]:value}));
  }
  
  const handleClear = () => {   
    setFolderData({ sigla: '', name: '', year: '' });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sigla', folderData.sigla);
    formData.append('name', folderData.name);
    formData.append('year', folderData.year);

    try {
      createFolder.mutateAsync(formData);
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
              <input className="form-control" type="number" onChange={handleChange} required/>      
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">Nombre Curso: </label>
              <input className="form-control" type="text" onChange={handleChange} required/>        
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">[Sigla Curso - Año]</label>
              <input className="form-control" type="text" placeholder="(Ej. MEAD, EACD...)" 
                onChange={handleChange} required/>
          
              <input className="form-control" type="number" min={2015} 
              onChange={handleChange} required/>
            </div>

            <small>Se verá este Folio en "Cargar Archivos": <b> {folderData.sigla}-##-{folderData.year} </b> </small>
            <div>
               <button className="btn-member me-2" onClick={handleClear}>
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