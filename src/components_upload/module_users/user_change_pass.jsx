import React, { useState } from 'react';

const userOnline = localStorage.getItem('user'); //LLAVE DE SESION

const ChangeRequest = async (formData) => {
    try{
        const token = localStorage.getItem('token');
        const response = await fetch('/api/users.php',{
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token //LLAVE
            },
            body: JSON.stringify({ username: formData.username, password: formData.password })
        });

        return await response.json();
    }catch(err){
        console.error("Error de red:", err);
    }   
}


//-----------------------FORMULARIO CAMBIOS-----------------------
const ChangePassword = () => {
    const [newData, setNewData] = useState({username: userOnline, password:'', confirmPass:''});
    const [errors, setErrors] = useState({ password: '', confirmPass: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData((prev) => ({...prev, [name]:value }));
        validateField(name, value);
    };

    const validateField = (name,value) => {
        let errorMsg = "";

        if (name === "password") {
            errorMsg = value.length < 6 ? "La contraseña debe ser almenos 6 caracteres." : "";        
        }
        if (name === "confirmPass") {
            errorMsg = value !== newData.password ? "Las contraseñas no coinciden." : "";
        }   

        setErrors((prev) => ({...prev,[name]: errorMsg,}) );
    }
   
    const Clear = () => {
        setNewData({username:userOnline, password:'', confirmPass:''});
        setErrors({password:'',confirmPass:''})
    } 

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((!errors.password && !errors.confirmPass) || (errors.password == '' && errors.confirmPass == '')) {
            //BACKEND
            const res = ChangeRequest(newData);  
            res ? alert('SE CAMBIARON CREDENCIALES') : alert("CANCELADO ALGO SALIO MAL");
            Clear();
        }    
        else {
            alert("Los campos estan vacíos o contraseñas no coinciden");
        }
    }

    return(
        <div className='row'>
            <div className="card border-0">
                <div className="card-header bg-theme user-profile text-light p-0">
                    <i className='bi bi-pencil-fill fs-4 me-3'></i>
                    <h5 className="mb-0">Cambiar Contraseña</h5>
                </div>

                <div className="card-body">
                    <form className='d-flex flex-column gap-2'>
                        {errors.password && (<small className='text-danger'>{errors.password}</small>)}
                        <div className="input-group">
                            <label htmlFor="password" className="col-form-label me-1">Contraseña: </label>
                            <input type="password" className="form-control" name="password" placeholder="••••••••"
                                onChange={handleChange} value={newData.password} required/>
                        </div>
                      
                        {errors.confirmPass && (<small className='text-danger'>{errors.confirmPass}</small>)}
                        <div className="input-group">
                            <label htmlFor="confirmPass" className="col-form-label me-1">Confirmar Contraseña: </label>
                            <input type="password" className="form-control" name="confirmPass" placeholder="••••••••"
                                onChange={handleChange} value={newData.confirmPass} required/>
                        </div>


                        <div>
                            <button type="button" className="btn btn-secondary me-2" onClick={Clear}>
                                <i className="bi bi-eraser-fill"></i>
                            </button>

                            <button type="button" className="btn btn-warning text-white" onClick={(e) => handleSubmit(e)}>
                                <i className="bi bi-pencil-square"></i>Cambiar
                            </button>    
                        </div>
                        
                    </form>         
                  </div>

                <div className="card-footer text-muted text-center">
                    <small>Solo el propietario de su sesión puede cambiar su contraseña.</small>
                </div>
            </div>
        </div>
        
    )
}

export default ChangePassword;