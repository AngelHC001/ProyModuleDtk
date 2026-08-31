import React, {useEffect, useState}from "react";

/*
//  Función para Crear
const agregarCurso = async (nuevoCurso) => {
  try
  {
    const token = localStorage.getItem('token');
    const response = await fetch(`${url}/m1_courses.php`, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'Authorization': token
      },
      body: JSON.stringify(nuevoCurso)
    });

    return await response.json();    
  }
  catch (error) {
    console.error("Error al enviar:", error);
  }
}


        <a href={`${url}/m1_download_zip.php?folder=${formData.year}_${formData.sigla}`} className="btn btn-dark">
            <i className="bi bi-download"></i> 
        </a>

// Función para Borrar
const eliminarCurso = async (cursoTarget) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${url}/m1_courses.php`, { 
      method: 'DELETE', headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({id:cursoTarget.id, sigla: cursoTarget.sigla, year:cursoTarget.year})
    });
    const data = await response.json();  
    return data;
  } 
  catch (error) {
    console.log('Error al borrar ', error.message);
  }
};
*/

//-----------------FORMULARIO--------------------

const CoursesForm = () => {
  const [message, setMessage] = useState({text:'',alert_mode:'alert-secondary'}); //mode success - danger - none
  const [formData, setFormData] = useState({id: '', sigla: '',name: '',year: ''});
  
  const handleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({...prev, name:[value]}))

  } 

  const handleSubmit = () => {

  }

  const Delete = () => {

  }

  const Clear = () => {   
    setFormData({ id: '', sigla: '', name: '', year: '' });
  }

  /*
  useEffect(()=> {
    return () => {
      actualCourse ? setFormData(actualCourse) : 
      setFormData({ id: '', sigla: '', name: '', year: '' })}
  },[actualCourse]);

  //PROCESAR DATOS
  const handleSubmit = async (e) => {
      e.preventDefault();    
      const response = await agregarCurso(formData);
      if (response.success) {
        onActionEnded();
        Clear();
        setMessage({text:response.message, alert_mode:'alert-success'});
      }
      else{
        setMessage({text:response.message, alert_mode:'alert-danger'});
      }
  };

  //BORRADO
  const handleDelete = async (e) => {
    e.preventDefault();    
    if (!actualCourse || !actualCourse.id) return; // Seguridad: no hacer nada si no hay curso seleccionado
    const confirmacion = window.confirm("¿Seguro que quieres borrar este curso?");
    
    if(confirmacion){
      const response = await eliminarCurso(actualCourse);
      if (response.success) {
        onActionEnded();  
        Clear();
        setMessage({text:response.message, alert_mode:'alert-success'});
      }
      else{
        setMessage({text:response.message, alert_mode:'alert-danger'})
      }
    }
  }

  */

  return (
    <div className="col-md-5 shadow rounded bg-light p-3">
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

            <small>Se verá este Folio en "Cargar Archivos": <b> {formData.sigla}-##-{formData.year} </b> </small>
            <div>
               <button className="btn btn-dark btn-lg me-2" onClick={Clear}>
                  <i className="bi bi-arrow-counterclockwise"/>
               </button>
              <button className="btn btn-primary btn-lg me-2" type="submit">
                  <i className="bi bi-folder-fill me-1"/>
                  Crear
              </button>
            </div>
        </form>
    </div>
   
  );
};

export default CoursesForm;