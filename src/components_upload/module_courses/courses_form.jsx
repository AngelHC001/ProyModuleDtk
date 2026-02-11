import React, {useEffect, useState}from "react";

const url = import.meta.env.VITE_API_URL;

//  Función para Crear
const agregarCurso = async (nuevoCurso) => {
  try
  {
    const token = localStorage.getItem('token'); // Recuperamos la llave del bolsillo
    const response = await fetch(`${url}/courses.php`, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json', 
        'Authorization': token // <--- AQUÍ MOSTRAMOS LA LLAVE
      },
      body: JSON.stringify(nuevoCurso)
    });

    return await response.json();    
  }
  catch (error) {
    console.error("Error al enviar:", error);
    return false;
  }
}

// Función para Borrar
const eliminarCurso = async (cursoTarget) => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await fetch(`${url}/courses.php`, { 
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


//-----------------FORMULARIO--------------------

const CoursesForm = ({ actualCourse, onActionEnded }) => {
  const [formData, setFormData] = useState({id: '',sigla: '',name: '',year: ''});
  const [message, setMessage] = useState({text:'',alert_mode:'alert-secondary'}); //mode success - danger - none
  
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
      if (response) {
        onActionEnded();  
        Clear();
        setMessage({text:response.message, alert_mode:'alert-success'});
      }
      else{
        setMessage({text:response.message, alert_mode:'alert-danger'})
      }
    }
  }

  const Clear = () => {   
    setFormData({ id: '', sigla: '', name: '', year: '' });
  }

  return (
    <div className="col-md-5 shadow rounded bg-light">
        <h1 className="slogan-2">Crear Nueva Carpeta</h1>
        <div className={`alert ${message.alert_mode}`} role="alert">
            {message.text}
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2 p-2">
            <div className="input-group">
              <label className="col-form-label me-2">ID General (QR): </label>
              <input className="form-control" type="text" defaultValue={formData.id} 
                onChange={e => setFormData({...formData, id: e.target.value})} required/>      
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">Nombre Curso: </label>
              <input className="form-control" type="text" defaultValue={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} required/>        
            </div>

            <div className="input-group">
              <label className="col-form-label me-2">[Sigla Curso - Año]</label>
              
              <input className="form-control" type="text" placeholder="(Ej. MEAD, EACD...)" 
                defaultValue={formData.sigla} onChange={e => setFormData({...formData, sigla: e.target.value})} required/>
          
              <input className="form-control" type="number" min={2000} defaultValue={formData.year} 
                onChange={e => setFormData({...formData, year: e.target.value})} required/>
            </div>

            <span>Se verá este Folio en "Cargar Archivos": <b> {formData.sigla}-##-{formData.year} </b> </span>
            <div>
               <button className="btn btn-secondary me-2" onClick={Clear}>
                  <i className="bi bi-eraser-fill"></i>
               </button>
              <button className="btn btn-primary me-2" type="submit">Guardar</button>
              <button className="btn btn-danger" onClick={e => handleDelete(e)}>Borrar</button>
            </div>
        </form>

        <a href={`${url}/download_zip.php?folder=${formData.year}_${formData.sigla}`} className="btn btn-dark">
            <i className="bi bi-download"></i> 
        </a>
    </div>
   
  );
};

export default CoursesForm;