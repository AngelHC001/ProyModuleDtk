<?php
require_once '../config.php';
//require_once dirname(__DIR__, 3) . '/ProyDatametrika_docpoint/config.php'; //iniciar globales

header("Access-Control-Allow-Origin: " . BASE_URL);
header("Access-Control-Allow-Methods:  GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//CONTROL DE CACHE
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// Las instrucciones más importantes para HTTP 1.1
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false); 
header("Pragma: no-cache"); // Para compatibilidad con HTTP 1.0


function WriteJson(int $mode, string $folderName, $fileData){
    $jsonPath = DIRS_PATH . $folderName. ".json";
    $jsonDoc = file_get_contents($jsonPath);
    $data = json_decode($jsonDoc, true);
    if(!$data){ return false; } //Existe el json?

    //MODE 1 => PUSH
    if($mode === 1 && count($fileData) === 2){
        $file = $fileData[0];  //fileName
        $num = $fileData[1];    //Num

        //CREAR NUEVOS DATOS
        $keyPath = $folderName ."/". $file;
        $jsonKey = ["id" => $num,"ruta" => "$keyPath"]; 
        //AGREGAR NUEVOS DATOS
        array_push($data,$jsonKey);        
        $newData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
       
        // Ruta del archivo donde se guardará el JSON
        if (file_put_contents($jsonPath, $newData) === false) {
            return false;
        }

        return true;
    }
    else //MODE 0 => POP
    {
        if(count($fileData) !== 1) { return false; }
        $pathItem = $fileData[0];

        if(is_array($data)){
            $newData = array_filter($data,function ($item) use($pathItem){
                return $item['ruta'] !== $pathItem;
            });
        }

        //GUARDAR CAMBIOS 
        $newData = array_values($newData);
        $process = file_put_contents($jsonPath, json_encode($newData,JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));  
        //file_put dio falso
        if ($process === false) { return false; }
        
        return true;
    }//if
}



class FilesController {
    public function UploadFile(){
        //DATOS DE FORMULARIO
        $sigla = $_POST['sigla'] ?? 'N/A';
        $year = $_POST['year'] ?? 'N/A';
        $num = $_POST['num'] ?? '00';

        //DIRECTORIO FIJO
        $folder = $year . "_" . $sigla;
        $endpoint = CERT_PATH . $folder;

        //OBTENER ARCHIVO
        if(isset($_FILES['docfile'])){
            $file = $_FILES['docfile'];
            $fileName = $file['name'];
            $fileTmpPath = $file['tmp_name'];
        }
        else{
            return ["success" => false, "message" => "NO HAY ARCHIVOS CARGADOS"];
        }
        
        //EXISTE CARPETA
        if(!is_dir($endpoint)){
            return ["success" => false, "message" => "LA CARPETA NO EXISTE"];
        }

        //Añadio archivo a la carpeta?
        $newpath = trim("$endpoint/$fileName");
        if (!move_uploaded_file($fileTmpPath, $newpath)) {
            return ["success" => false, "message" => "Error al mover el archivo"];
        }

        //ESCRIBIO JSON?
        if (!WriteJson(1,$folder,[$fileName,$num])) {
            return ["success" => false, "message" => "Error al escribir directorio"];
        }

        return ["success" => true, "message" => "ARCHIVO AGREGADO AL DIRECTORIO"];
    }

    
    //DELETE
    public function DeleteFile(){
        //Capturar el JSON del frontend
        $json = file_get_contents('php://input'); 
        $datos = json_decode($json, true);
        if (!$datos) {
            return ["success" => false, "message" => "NO SE RECIBIERON DATOS VALIDOS"];
        }

        //UBICAR CARPETA/ARCHIVO 
        $path = $datos['path'] ?? ''; 
        $target = CERT_PATH . $path; 

        //Carpeta y archivo Existen?
        if(!file_exists($target)){
            return ["success" => false, "message" => "FALLO EN EL BORRADO (FALSE File Exists)"];
        }

        //PROCESO BORRAR ARCHIVO
        if(!unlink($target)){
            return ["success" => false, "message" => "FALLO EN EL BORRADO (FALSE unlink)"];
        }

        //PROCESO REESCRIBIR JSON BORRAR ITEM
        $justFolder = explode("/",$path)[0]; //YEAR_CURSO
        if(!WriteJson(0,$justFolder,[$path])){
            return ["success" => false, "message" => "FALLO EN REESCRIBIR (fileput)"];
        }   

        return ["success" => true, "message" => "ARCHIVO ELIMINADO"];      
    }       
}


try 
{
    $controller = new FilesController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            echo json_encode($controller->UploadFile());
            break;
        
        case 'DELETE':
            echo json_encode($controller->DeleteFile());
            break;
    }

} catch (Exception $th) {
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}
?>