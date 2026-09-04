import React from "react";
import Users from "./users_list";
import ProcessUsers from "./users_form";
import ChangePassword from "./users_pass";

function ModuleThree(){
    return(
        <div className="row d-flex justify-content-center text-center gap-5 p-auto mb-4">
            <div className="col-md-4">
                <ProcessUsers/>
                <ChangePassword/>
            </div>
            <Users/>
        </div>
    ) 
}

export default ModuleThree;