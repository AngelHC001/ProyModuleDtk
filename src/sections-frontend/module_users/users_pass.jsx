import React, { useState } from 'react';

const userOnline = localStorage.getItem('user'); //LLAVE DE SESION
const userID = localStorage.getItem('id');
const url = import.meta.env.VITE_API_URL;

const ChangeRequest = async (formData) => {
    try{
        const token = localStorage.getItem('token');
        const response = await fetch(`${url}/m3_users.php`,{ 
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ 
                id: userID, 
                username: formData.username, 
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            })
        });

        return await response.json();
    }catch(err){
        return await err.json();
    }   
}


//-----------------------FORMULARIO CAMBIOS-----------------------
const ChangePassword = ({onPasswordChange}) => {
    const [newData, setNewData] = useState({ username: userOnline, currentPassword: '', newPassword: '' });
    const [message, setMessage] = useState({text:'',color:'alert-secondary'});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewData((prev) => ({ ...prev, [name]: value }));
    };

    const Clear = () => {
        setNewData({ username: userOnline, currentPassword: '', newPassword: '' });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await ChangeRequest(newData);
        if(res.success){
            setMessage({text: res.message, color: 'alert-success'});
            Clear();
            onPasswordChange();
        } else {
            setMessage({text: res.message, color: 'alert-danger'});
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
                    <form className='d-flex flex-column gap-2' onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="currentPassword" className="col-form-label me-1">Contraseña Actual: </label>
                            <input id="currentPassword" type="password" className="form-control" name="currentPassword" placeholder="••••••••"
                                onChange={handleChange} value={newData.currentPassword} required />
                        </div>

                        <div className="input-group">
                            <label htmlFor="newPassword" className="col-form-label me-1">Contraseña Nueva: </label>
                            <input id="newPassword" type="password" className="form-control" name="newPassword" placeholder="••••••••"
                                onChange={handleChange} value={newData.newPassword} required />
                        </div>

                        <div>
                            <button type="button" className="btn btn-dark me-2" onClick={Clear}>
                                <i className="bi bi-arrow-counterclockwise"></i>
                            </button>

                            <button type="submit" className="btn btn-success text-white">
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