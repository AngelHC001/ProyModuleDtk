import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserCallbacks } from "../../sections-callbacks/section_users.js";

const API_URL = import.meta.env.VITE_API_URL;

export default function Users(){
    const { deleteUser } = useUserCallbacks();

    const handleDelete = async(e,userData) => {
        e.preventDefault();
        if(!confirm('¿Borrar este usuario?')){ return; }

        try {
            await deleteUser.mutateAsync(userData);
            alert('Usuario Eliminado');
        } catch (error) {
            console.error(error.message);
            alert('Ocurrio un error al borrar usuario');
        }

    }


    const {data, isPending, isError} = useQuery({
        queryKey: ['users'],
        queryFn: async({signal}) => {
            const response = await fetch(`${API_URL}/s3_users.php`, {
                method:'GET',
                signal: signal
            });

            if(!response.ok){
                throw new Error('Error http '+ response.status);
            }
            return response.json();
        }
    });

    return(
        <div className="col-md-5 bg-light rounded shadow p-2">
            <h2 className="slogan">Usuarios Registrados</h2>
            <div className="rounded p-3">
                {isPending && <p>CARGANDO DATOS</p>}
                {isError && <p>OCURRIO UN ERROR</p>}
                <div className="table-courses">
                    {
                        data?.length !== 0 && 
                        <ul className="list-group profiles">
                            {
                                data?.map((user) => (
                                    <li key={user.id} className="list-group-item user-item"> 
                                        <span className="me-5">
                                            {user.name} 
                                        </span>

                                        <button className="btn btn-danger" type="button"
                                            onClick={(e) => handleDelete(e,user)}>
                                            <i className="bi bi-trash2"/>
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>       
                    }
                </div>
            </div>       
        </div>
    )
}
