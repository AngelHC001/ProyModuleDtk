import React, {useEffect,useState} from "react";
import Users from "./users_list";
import ProcessUsers from "./users_form";
import ChangePassword from "./users_pass";
import '../../assets/utils/c-estilos.css';

function ModuleThree(){
    /*const [users, setUsers] = useState([]);
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
                const response = await fetch(`${url}/m3_users.php?t=${Date.now()}`, {
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
    },[refreshSignal]);*/

    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <div className="col-md-6">
                <ProcessUsers/>
                <ChangePassword/>
            </div>
            <Users/>
        </div>
    ) 
}

export default ModuleThree;