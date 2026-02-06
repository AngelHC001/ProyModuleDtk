import React from "react";
const userOnline = localStorage.getItem('user');


function Users({listUsers = [], onSelect}){
    return(
        <div className="col-md-4 bg-light rounded shadow p-2">
            <h2 className="slogan-2">Usuarios Registrados</h2>
            <div className="bg-theme rounded p-3">
                <ul className="list-group profiles">
                    {listUsers.map((user) => (
                        user.name === userOnline ? '':
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