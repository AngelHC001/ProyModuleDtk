import React, {useEffect,useState} from "react";
import Users from "./users";
import ProcessUsers from "./users_process";
import ChangePassword from "./user_change_pass";
import '../../assets/utils/c-estilos.css';

const INITIAL = {id:'',username:''};

function ModuleThree(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState(INITIAL);

    const loadUsers = async() => {
        try{
            const response = await fetch(`/api/users.php`);
            const data = await response.json();
            setUsers(data); //ARRAY [[id,user],...]
           
        }catch(err){
            console.log('ERROR AL CARGAR USUARIOS ',err.message);
        }
    };

    const handleSelect = (user = []) =>{
        if(user){
            INITIAL.id = user[0];
            INITIAL.username = user[1];
        }
        setUserSelected({...INITIAL});
    }

    //Cargar lista
    useEffect(() => {
        return () => {setLoading(false); loadUsers();}
    },[]);

    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <div className="col-md-5">
                <ProcessUsers onUser={userSelected} onActionEnded={() => {loadUsers(); setUserSelected(INITIAL);} }/>
                <ChangePassword/>
            </div>
            {loading ? <h6>Cargando Usuarios</h6> : <Users listUsers={users} onSelect={handleSelect}/> }
        </div>
    ) 
}

export default ModuleThree;