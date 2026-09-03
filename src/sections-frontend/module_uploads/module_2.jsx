import React from "react";
import FileUploadForm from "./uploads_form";
import FilesUploaded from "./uploads_list";


function ModuleTwo(){
    return(
        <div className="row d-flex justify-content-center gap-4 mb-4 text-center">
            <FileUploadForm/>
            <FilesUploaded />
        </div>
    )
}

export default ModuleTwo;