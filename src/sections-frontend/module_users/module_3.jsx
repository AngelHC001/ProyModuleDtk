import React from "react";
import UsersForm from "./users_form";
import Users from "./users_list";

function ModuleThree(){
    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <UsersForm/>
            <Users/>
        </div>
    ) 
}

export default ModuleThree;