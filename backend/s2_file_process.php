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


//AUXILIAR DE CONSULTA
function getFilesList($foldername){
    $json_path = DIRS_PATH . $foldername. ".json";
    if(!file_exists($json_path)){
        return [];
    }

    $content = file_get_contents($json_path);
    $data = json_decode($content,true);
    return is_array($data) ? $data : [];
}


function WriteJson(int $mode, string $foldername, $fileData){
    $json_path = DIRS_PATH . $foldername. ".json";
    $data = getFilesList($foldername);

    //Existe el json?
    if($data === []){ return false; } 

    //MODE 1 => PUSH
    if($mode === 1 && count($fileData) === 2){
        $file = $fileData[0];  //fileName
        $num = $fileData[1];    //Num
        $key = bin2hex(random_bytes(8));

        //CREAR NUEVOS DATOS
        $keyPath = $foldername ."/". $file;
        $newItem = ["key" => $key, "id" => $num, "ruta" => $keyPath]; 
        array_push($data, $newItem);        
    }
    else if($mode === 0 && count($fileData) === 1) //MODE 0 POP
    {
        $pathItem = $fileData[0];
        $data = array_filter($data,function ($item) use($pathItem){
                return (string)$item['ruta'] !== (string)$pathItem; });
        $data = array_values($data);      
    }
    else{
        return false;
    }
    
    //GUARDAR CAMBIOS 
    $newData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $bytesWritten = file_put_contents($json_path, $newData);
    return $bytesWritten !== false;
}


class FilesController {
    public function UploadFile(){
        //DATOS DE FORMULARIO
        $sigla = $_POST['sigla'] ?? 'N/A';
        $num = $_POST['num'] ?? '00';
        $year = $_POST['year'] ?? 'N/A';

        //DIRECTORIO FIJO
        $folder = $year . "_" . $sigla;
        $endpoint = CERT_PATH . $folder;

        //FILTRAR NUMERO PARA EVITAR DUPLICADOS
        $data = getFilesList($folder);
        foreach($data as $item){
            if((string)$item['id'] === (string)$num){
                return ["success" => false, "message" => "NUMERO DE ARCHIVO YA EXISTE " . $num];
            }
        }

        //OBTENER ARCHIVO
        if(!isset($_FILES['docfile'])){
            return ["success" => false, "message" => "NO HAY ARCHIVOS CARGADOS"];
        }
        $file = $_FILES['docfile'];
        $fileName = $file['name'];
        $fileTmpPath = $file['tmp_name'];
        
        //EXISTE CARPETA?
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
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL " . $th -> getMessage()]);
}
?>