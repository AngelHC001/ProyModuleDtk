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
        $carpeta = trim("$year-$sigla");
        $endpoint = "../doc-point/certificados/$carpeta";
        
           //$archivo = "$sigla-$num.pdf";   //para archivo
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
        /*
       
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        //Extraer credenciales
        $id = $datos['id'] ?? '';
        $sig = $datos['sigla'] ?? '';
        $year = $datos['year'] ?? '';

        $folderTarget = "$year-$sig";
        if(EraseFolder($folderTarget)){
            //BORRAR REGISTRO
            $delete = "DELETE FROM CURSO WHERE IDQR = $id AND SIGLA = '$sig' AND ANIO = $year";
            $req = mysqli_query($mysqli,$delete);
            if($req){
                return ["success" => true, "message" => "CARPETA ELIMINADO"];
            }
            else{
                return ["success" => false, "message" => "ERROR AL ELIMINAR"];
            }
        }
        else
        {
            return ["success" => false, "message" => "LA CARPETA NO EXISTEN"];
        }
        */
    }
        
}


try {
    //INICIAR LOGICA
    $controller = new FilesController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            echo json_encode($controller->UploadFile());
            break;
        
        /*
        case 'DELETE':
            echo json_encode($controller->DeleteFile());
            break;*/
    }

} catch (Exception $th) {
    return json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>