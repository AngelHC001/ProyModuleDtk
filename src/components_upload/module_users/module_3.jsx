import React, {useEffect,useState} from "react";
import Users from "./users";
import ProcessUsers from "./users_process";
import ChangePassword from "./user_change_pass";
import '../../assets/utils/c-estilos.css';

const INITIAL = { id: 0, username:''};
function ModuleThree(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState(INITIAL);

    const loadUsers = async() => {
        try{
            const response = await fetch(`/api/users.php?t=${Date.now()}`);
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        }catch(err){
            console.error('ERROR AL CARGAR USUARIOS ',err.message);
        }
    };

    const handleSelect = (user) => { setUserSelected({...INITIAL,...user}); }

    useEffect(() => {
        return () => loadUsers();
    },[]);

    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <div className="col-md-5">
                <ProcessUsers key={userSelected.id} onUser={userSelected} onActionEnded={() => {loadUsers(); setUserSelected(INITIAL);} }/>
                <ChangePassword onPasswordChanged={() => loadUsers()} />
            </div>
            {loading ? <h6>Cargando Usuarios</h6> : <Users listUsers={users} onSelect={handleSelect} /> }
        </div>
    ) 
}

export default ModuleThree;