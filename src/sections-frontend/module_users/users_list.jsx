import React from "react";
const userOnline = localStorage.getItem('id');


function Users({listUsers = [], onSelect}){
    listUsers = listUsers.filter(u => u.id != Number(userOnline));
    return(
        <div className="col-md-5 bg-light rounded shadow p-2">
            <h2 className="slogan-2">Usuarios Registrados</h2>
            <div className="bg-theme rounded p-3">
                <ul className="list-group profiles">
                    {listUsers.map((user) => (
                        <li key={user.id} className="list-group-item user-item" 
                            onClick={() => onSelect({id: user.id, username: user.name})}> 
                         {user.name} </li>)
                    )}
                </ul>
            </div>       
        </div>
    )
}
export default Users;