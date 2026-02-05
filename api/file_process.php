<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


class FilesController {
    //SUBIR ARCHIVO
    //Formulario procesa Carpeta, Archivo y Folio de referencia 
    //El directorio fijo ../doc-point/certificados/ [CARPETA] 
    
    public function UploadFile(){
        //Datos extraidos de FormData
        $sigla = $_POST['sigla'] ?? 'N/A';
        $year = $_POST['year'] ?? 'N/A';
        $num = $_POST['num'] ?? '00';

        //OBTENER ARCHIVO
        if(isset($_FILES['docfile'])){
            $file = $_FILES['docfile'];
            $fileName = $file['name'];
            $fileTmpPath = $file['tmp_name'];
        }
        else{
            return ["success" => false, "message" => "ARCHIVO NO SUBIDO"];
        }
        
        //DIRECTORIO FIJO
        $carpeta = $year . "_" . $sigla;
        $endpoint = "../doc-point/certificados/$carpeta";
        
        //SI NO EXISTE CANCELAR
        if(!is_dir($endpoint)){
            return ["success" => false, "message" => "LA CARPETA NO EXISTE"];
        }


        $newpath = trim("$endpoint/$fileName");
        //Añadio archivo a la carpeta?
        if (!move_uploaded_file($fileTmpPath, $newpath)) {
            return ["success" => false, "message" => "Error al mover el archivo"];
        }

        //Extraer JSON para modificarlo
        $jsonPath = trim("../doc-point/$carpeta.json");
        $jsonString = file_get_contents($jsonPath);
        $datos = json_decode($jsonString, true);

        //existe el JSON?
        if(!$datos){
            return ["success" => false, "message" => "NO EXISTE ARCHIVO DE ESCRITURA"];
        }

        //CREAR NUEVOS DATOS Y CONVERTIRLO A JSON
        $ruta = "$carpeta/$fileName";
        $jsonKey = ["id" => $num,"ruta" => "$ruta"];
        
        //AGREGAR NUEVOS DATOS
        array_push($datos,$jsonKey);        
        $newData = json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
       
        // Ruta del archivo donde se guardará el JSON
        if (file_put_contents($jsonPath, $newData)) {
            return ["success" => true, "message" => "ARCHIVO $fileName EN CARPETA $carpeta"];
        }
        else{
            return ["success" => false, "message" => "FALLO EN ESCRIBIR RUTA"];
        }
    }

    
    //DELETE
    public function DeleteFile(){
        //Capturar el JSON del frontend
        $json = file_get_contents('php://input'); 
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        $pathTarget = $datos['rutaArchivo'] ?? ''; //carpeta/archivo
        $endpoint = "../doc-point/certificados";
        $target = $endpoint . "/" . $pathTarget; 

        //Carpeta y archivo Existen?
        if(file_exists($target)){
            if(unlink($target)){
                //ReescribirJSON
                $justFolder = explode("/",$pathTarget)[0]; //solo YYYY_FOLDER
                $jsonPath = "../doc-point/" . $justFolder . ".json";
                $jsonString = file_get_contents($jsonPath);
                $datos = json_decode($jsonString, true);
                //existe el JSON?
                if(!$datos){
                    return ["success" => false, "message" => "NO EXISTE ARCHIVO DE ESCRITURA"];
                }

                //BORRAR ELEMENTO ESCRITO DEL JSON
                if(is_array($datos)){
                    $newData = array_filter($datos,function ($item) use($pathTarget){
                        return $item['ruta'] !== $pathTarget;
                    });
                }

                $newData = array_values($newData);
                //GUARDAR CAMBIOS
                if (file_put_contents($jsonPath, json_encode($newData,JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
                    return ["success" => true, "message" => "ARCHIVO ELIMINADO"];
                }
                else{
                    return ["success" => false, "message" => "FALLO EN REESCRIBIR (fileput)"];
                }
            }
            else{
                 return ["success" => false, "message" => "FALLO EN EL BORRADO (unlink)"];
            }
        }
        else
        {
            return ["success" => false, "message" => "FALLO EN EL BORRADO (File exists)"];
        }
    }
        
}


try {
    //INICIAR LOGICA
    $controller = new FilesController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            echo json_encode($controller->UploadFile());
            break;
        
        case 'DELETE':
            echo json_encode($controller->DeleteFile(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            break;
    }

} catch (Exception $th) {
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>