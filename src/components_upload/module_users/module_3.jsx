import React, {useEffect,useState} from "react";
import Users from "./users";
import ProcessUsers from "./users_process";
import ChangePassword from "./user_change_pass";
import '../../assets/utils/c-estilos.css';

const url = import.meta.env.VITE_API_URL;
const INITIAL = { id: 0, username:''};
function ModuleThree(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userSelected, setUserSelected] = useState(INITIAL);
    const [refreshSignal, setRefreshSignal] = useState(0);

    const ReloadData = () => setRefreshSignal(prev => prev + 1);
    const handleSelect = (user) => { setUserSelected({...INITIAL,...user}); }

   
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        
        const loadUsers = async() => {
            try{
                const response = await fetch(`${url}/users.php?t=${Date.now()}`, {
                    method:'GET',
                    signal:signal
                });
                
                const data = await response.json();
                if(!signal.aborted){ setUsers(data); }
            }catch(err){
                console.error('ERROR AL CARGAR USUARIOS ',err.message);
            }finally{
                if(!signal.aborted){setLoading(false)}
            }
        };

        loadUsers();
        return () => controller.abort();
    },[refreshSignal]);

    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <div className="col-md-5">
                <ProcessUsers key={userSelected.id} onUser={userSelected} onActionEnded={() => {ReloadData(); setUserSelected(INITIAL);} }/>
                <ChangePassword onPasswordChanged={() => ReloadData()} />
            </div>
            {loading ? <h6>Cargando Usuarios</h6> : <Users listUsers={users} onSelect={handleSelect} /> }
        </div>
    ) 
}

export default ModuleThree;