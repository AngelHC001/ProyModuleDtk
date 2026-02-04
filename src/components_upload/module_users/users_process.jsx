import React, { useEffect, useState } from 'react';


/* COMPONENTES SEPARADOS */
function FormHeader(){
    return(
        <div className="card-header bg-theme user-profile text-light p-0">
            <i className='bi bi-person-lines-fill fs-4 me-3'></i>
            <h5 className="mb-0">Crear Usuario</h5>
        </div>
    )
}

/* LOGICA DEL BACKEND */
const AddUser = async (nuevoData) => {
    if(!nuevoData) return alert("Llena los campos");
    const token = localStorage.getItem('token'); // Recuperamos la llave del bolsillo

    try{
        const response = await fetch(`/api/users.php`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token //LLAVE
            },
            body: JSON.stringify({ username: nuevoData.username, password: nuevoData.password })
        });

        return await response.json();
    }catch(err){
        console.log('ALGO SALIO MAL',err);
    }
};


const DeleteUser = async (userData) => {
    if (!window.confirm("¿Seguro que quieres eliminar a este usuario? Esta acción es irreversible.")) {
        return;
    }
   
    try {
        const token = localStorage.getItem('token'); // Recuperamos la llave del bolsillo
        const response = await fetch('/api/users.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ id: userData.id, username: userData.username })
        });
        return await response.json();
    } catch (error) {
        console.error("Error de red:", error);
    }
};


//-----------------------FORMULARIO REGISTROS-----------------------
const ProcessUsers = ({onUser, onActionEnded}) => {
  const [formData, setFormData] = useState({id:'',username: ''});

  useEffect(() => {
    return () => {
        onUser ? setFormData(onUser) : 
            setFormData({ id: '', username:''});
    }
  },[onUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e, tipoAccion) => {
    e.preventDefault();
    
    //CONEXION DEL API
    if(tipoAccion === 'Alta'){
        const response = await AddUser(formData);
        if (response) { onActionEnded(); } //VUELVE A CARGAR USUARIOS y RESTABLECE EL VALOR DEL PADRE
    }
    else if(tipoAccion === 'Cancelar'){
        setFormData({id:'',username: '' }); //LIMPIA FORMULARIO
    }
    else{
        const deletion = await DeleteUser(formData);
        if (deletion) { onActionEnded(); }
    }
    
    setFormData({id:'', username: '' }); //LIMPIA FORMULARIO
  };
  return (
    <div className="row mb-3">
        <div className="card border-0">
            <FormHeader/>
            <div className="card-body">
                <form className='d-flex flex-column gap-2'>
                    {/* Campo Usuario */}
                    <div className="input-group">
                        <label htmlFor="username" className="col-form-label me-2">Nombre de Usuario: </label>
                        <input type="text" className="form-control" name="username" placeholder="Ej: jdoe2026" 
                            onChange={handleChange} value={formData.username} required/>
                    </div>

                    {/* Grupo de Botones */}
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                        <button type="button" className="btn btn-secondary" onClick={(e) => handleSubmit(e, 'Cancelar')}>
                            <i className="bi bi-eraser-fill"></i>
                        </button>
 
                        <button type="button" className="btn btn-success" onClick={(e) => handleSubmit(e, 'Alta')}>
                            <i className="bi bi-person-plus-fill me-2"></i>Agregar
                        </button>

                        <button type="button" className="btn btn-danger" onClick={(e) => handleSubmit(e, 'Baja')}>
                            <i className="bi bi-trash-fill me-2"></i>Eliminar
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