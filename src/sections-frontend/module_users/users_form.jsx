import React, { useState } from 'react';
import { useUserCallbacks } from '../../sections-callbacks/section_users';

function FormHeader(){
    return(
        <div className="card-header bg-theme user-profile text-light">
            <i className='bi bi-person-lines-fill fs-4 me-1'/>
            <h5 className="mb-0">Configurar Usuario</h5>
        </div>   
    )
}

//REGISTRAR USUARIO
function NewUserSection(){
    const { addUser } = useUserCallbacks();
    const [username, setUserName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        addUser.mutate({username: username},{
            onSuccess: (data) => { 
                setUserName('');
                alert(data.message); 
            },
            onError: (error) => {
                console.error(error.message);
                alert('ERROR AL INSERTAR USUARIO ', error.message);
            }
        });
    };        
    
    return (
        <form onSubmit={handleSubmit} className='p-2'>
            <div className="input-group mb-1">
                <label htmlFor="username" className="col-form-label me-2">Nombre: </label>
                <input type="text" className="form-control" name="username" value={username}
                    onChange={(e) => setUserName(e.target.value)} required/>

                <button type="button" className="btn btn-member border" onClick={() => setUserName('')}>
                    <i className="bi bi-arrow-counterclockwise"></i>
                </button>

                <button type="submit" className="btn btn-member border">
                    <i className="bi bi-person-plus-fill me-1"></i>Agregar
                </button>
            </div>
            
            <small>Nuevos Usuarios tendran la contraseña 'dtmk_usuario' por defecto</small>
        </form>
  )
}


function PasswordSection () {
    const { changePassword } = useUserCallbacks();
    const [showPassword, setShowPassword] = useState(false);
    const [newPass, setNewPass] = useState({pass1: '', pass2: ''});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPass((prev) => ({ ...prev, [name]: value }));
    };

    const togglePassword = () =>{
        setShowPassword(!showPassword);
    }

    const handleClear = () => {
        setNewPass({ pass1: '', pass2: '' });
    }
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(newPass.pass1 !== newPass.pass2){
            alert('Las contraseñas no coinciden');
            return;
        }

        changePassword.mutate(newPass,{
            onSuccess: (data) => {
                handleClear();
                alert(data.message);
            },
            onError: (error) => {
                alert(error.message);
            }
        });
    }

    return(
        <form className='d-flex flex-column gap-2 px-3' onSubmit={handleSubmit}>
            <div className="input-group">
                <label className="col-form-label me-1">Contraseña Actual: </label>
                <input className="form-control" name="pass1" value={newPass.pass1} 
                    type={showPassword ? 'text' : 'password'} 
                    onChange={handleChange}  required />
            </div>

            <div className="input-group">
                <label className="col-form-label me-1">Contraseña Nueva: </label>
                <input className="form-control" name="pass2" value={newPass.pass2} 
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange} required />
            </div>

            <div className='d-flex justify-content-center gap-1'>
                <button type="button" className="btn-member" onClick={togglePassword}>
                    <i className="bi bi-eye"/>
                </button>

                <button type="button" className="btn-member" onClick={handleClear}>
                    <i className="bi bi-arrow-counterclockwise"/>
                </button>

                <button type="submit" className="btn-member">
                    <i className="bi bi-pencil-square"/>Cambiar
                </button>
            </div>

            <small>Solo el usuario en sesion puede cambiar su contraseña</small>
        </form>        
    ) 
}

export default function UsersForm(){
    return(
        <div className="col-md-5 p-0 border-0 card shadow d-flex flex-column gap-2">
           <FormHeader/>
           <div className='card-body'>
                <NewUserSection/>
                <hr/>
                <h4 className='slogan'>Cambiar contraseña</h4>
                <PasswordSection/>
           </div>
        </div>
    )
}

