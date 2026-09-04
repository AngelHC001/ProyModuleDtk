import React from "react";
import {useView} from '../../components/viewContext.jsx';
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export default function Users(){

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
            <h2 className="slogan-2">Usuarios Registrados</h2>
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
                                        {user.name} </li>))
                            }
                        </ul>       
                    }
                </div>
            </div>       
        </div>
    )
}
