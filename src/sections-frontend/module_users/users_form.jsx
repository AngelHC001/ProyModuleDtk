import React, { useEffect, useState } from 'react';
import { useUserCallbacks } from '../../sections-callbacks/section_users';
const API_URL = import.meta.env.VITE_API_URL;

/* COMPONENTES SEPARADOS */
function FormHeader(){
    return(
        <div className="card-header bg-theme user-profile text-light p-0">
            <i className='bi bi-person-lines-fill fs-4 me-3'></i>
            <h5 className="mb-0">Crear Usuario</h5>
        </div>
    )
}


//-----------------------FORMULARIO REGISTROS-----------------------
const ProcessUsers = () => {
  const { addUser } = useUserCallbacks();
  const [formData, setFormData] = useState({ id: 0, username:'' });
  const [message, setMessage] = useState({text: '', color: 'alert-secondary'})

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev,[name]: value }));
  };


  /*
  
  
  const handleSubmit = async (e, tipoAccion) => {
    e.preventDefault();
    
    //CONEXION DEL API
    if(tipoAccion === 'Alta'){
        const response = await AddUser(formData);
        //VUELVE A CARGAR USUARIOS
        if (response.success) { 
            onActionEnded(); 
            setMessage({text:response.message, color: 'alert-success'});
            setFormData({id:0,username:''});
        }
        else{
            setMessage({text:response.message, color: 'alert-danger'});
        } 
    }
    else if(tipoAccion === 'Baja')
    {
        const deletion = await DeleteUser(formData);
        if (deletion.success) { 
            onActionEnded(); 
            setMessage({text:deletion.message, color: 'alert-success'});
            setFormData({id:0,username:''});
        }
        else{
            setMessage({text:deletion.message, color: 'alert-danger'});
        } 
    }
    else
    {
        setMessage({text: '', color: 'alert-secondary'})
        setFormData({ id:0, username:''})
    }
  };
    */
  return (
    <div className="row mb-3">
        <div className="card border-0">
            <FormHeader/>
            <div className="card-body">
                <form className='d-flex flex-column gap-2'>
                    {/* Campo Usuario */}
                    <div className="input-group">
                        <label htmlFor="username" className="col-form-label me-2">Nombre de Usuario: </label>
                        <input type="text" className="form-control" name="username"
                            onChange={handleChange} value={formData.username} required/>
                    </div>

                    {/* Grupo de Botones */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        <button type="button" className="btn btn-dark" onClick={(e) => handleSubmit(e,'Cancelar')}>
                            <i className="bi bi-arrow-counterclockwise"></i>
                        </button>
 
                        <button type="button" className="btn btn-success" onClick={(e) => handleSubmit(e, 'Alta')}>
                            <i className="bi bi-person-plus-fill me-2"></i>Agregar
                        </button>
                    </div>
                </form>
            </div>
        
            <div className="card-footer text-muted text-center">
                <small>Nuevos Usuarios tendran la contraseña 'dtmk_usuario' por defecto</small>
            </div>
        </div>
    </div>
  );
};

export default ProcessUsers;