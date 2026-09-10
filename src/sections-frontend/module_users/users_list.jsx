import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserCallbacks } from "../../sections-callbacks/section_users.js";
import { LoadingScreen, ErrorScreen } from "../../components/source_loading.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function ItemsPanel({children}){
    return(
        <div className="col-md-5 bg-light rounded shadow p-2">
            <h2 className="slogan">Usuarios Registrados</h2>
            <div className="items-table">
                 {children}
            </div>
        </div>  
    )
}

export default function Users(){
    const { deleteUser } = useUserCallbacks();

    const handleDelete = async(e,userData) => {
        e.preventDefault();
        if(!confirm('¿Borrar este usuario?')){ return; }

        deleteUser.mutate(userData,{
            onSuccess: (data) => { alert(data.message); },
            onError: (error) => {
                console.error(error.message);
                alert(error.message);
            }
        });
    }


    const { data, isPending, isError } = useQuery({
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
        <ItemsPanel>
            {
                isPending ? <LoadingScreen/> :
                    isError ? <ErrorScreen/> : 
                        data?.length !== 0 && 
                        <ul className="list-group">
                            {
                                data?.map((user) => (
                                    <li key={user.id} className="list-group-item"> 
                                        <span className="me-5">{user.name}</span>
                                        <button className="btn-member btn-alert" type="button"
                                            onClick={(e) => handleDelete(e,user)}>
                                            <i className="bi bi-trash2"/>
                                        </button>
                                    </li>
                                ))
                            }
                        </ul>           
            }
        </ItemsPanel>
    )
}
