import React, { useState } from 'react';
import ContainerFluid from '../components/container_fluid';
import MainCanvas from '../components/main_canvas';


//const API = 'http://localhost/api/login.php';

const Login = ({ onLoginSuccess }) => {
  const [datos, setDatos] = useState({username: '', password: ''});
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setDatos({...datos, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    //fetch de login al escribir api/ reconoce la ruta para consumir php
    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });  
      
      const data = await response.json();
      //console.log("texto ",data);
      
      // Guardar el token en el almacenamiento local del navegador
      if (data.success) {
        onLoginSuccess(data.token,data.username);   // Redirigir al dashboard
      }else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    }
  };

  return (
    <MainCanvas>
        <ContainerFluid classAdditions='d-flex justify-content-center align-items-center py-5'>
            <div className="card shadow p-2 rounded" style={{ width: '400px' }}>
                <div className="card-body">
                    <h3 className="text-center text-primary mb-4 fw-bold">Iniciar Sesión</h3>
                    { /* Mensaje de Error (solo se muestra si existe) */}
                    {error && (
                        <div className="alert alert-danger text-center p-2" role="alert">
                            {error}
                        </div>)
                    }

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Usuario</label>
                            <input type="text" name="username" className="form-control" value={datos.username}
                            onChange={handleChange} required/>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Contraseña</label>
                            <input type="password" name="password" className="form-control" placeholder="••••••"
                            value={datos.password} onChange={handleChange} required/>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg">
                                Ingresar
                            </button>
                        </div>
                    </form>

                    <div className="card-footer text-center bg-white border-0 mt-3">
                        <small className="text-muted">Sistema de Gestión de Cursos</small>
                    </div>
                    {/*CARD BODY*/}
                </div>
            </div>
        </ContainerFluid>
    </MainCanvas>
  );
};

export default Login;