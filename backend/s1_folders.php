<?php
require_once '../config.php';

header("Access-Control-Allow-Origin: " . BASE_URL);
header("Access-Control-Allow-Methods:  GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json, charset=UTF-8");

//CONTROL DE CACHE
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// Las instrucciones más importantes para HTTP 1.1
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false); 
header("Pragma: no-cache"); // Para compatibilidad con HTTP 1.0

define('DIRECTORY_FILE', DOC_PATH . "directory.json");

//EXTRAER JSON DEL DIRECTORIO
function GetDirectoryJSON(){
    if(!file_exists(DIRECTORY_FILE)){ return [];}
    
    $content = file_get_contents(DIRECTORY_FILE); 
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

function CheckData($idToFind){
    $json_data = GetDirectoryJSON();

    foreach($json_data as $item){
        if((string)$item['id'] === (string)$idToFind){
            return true;
        }
    }

    return false;
}



//ESCRIBIR DIRECTORIO GENERAL JSON PARA QUE LO LEA LA PAGINA PRINCIPAL
function WriteJson($mode, $folderData){
    $json_data = GetDirectoryJSON();

    //MODE PUSH
    if($mode === 1 && count($folderData) === 4){
        $newItem = [
            "key" =>  bin2hex(random_bytes(8)),  // Genera una cadena de 16 caracteres alfanuméricos únicos
            "id" => intval($folderData[0]),
            "sigla" => strtoupper($folderData[1]),
            "name" => $folderData[2],
            "year" => $folderData[3],
        ];

        array_push($json_data,$newItem);        
    }
    else if($mode === 0 && count($folderData) === 1) //MODE = 0 POP BORRAR POR ID
    {
        $attrTarget = $folderData[0]; 
        //REASIGNAR VALORES
        $json_data = array_filter($json_data,function ($item) use($attrTarget){
                                    return (string)$item['id'] !== (string)$attrTarget;});

        $json_data = array_values($json_data);
    }
    else{
        return false;
    }

    //GUARDAR CAMBIOS
    $newData = json_encode($json_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $bytesWritten = file_put_contents(DIRECTORY_FILE, $newData); 
    return $bytesWritten !== false;
}



//CREA CARPETA PARA ARCHIVOS Y JSON PARA LECTURA DE QR
function CreateFolder(string $carpetaCurso){
    if (!is_dir(CERT_PATH)) { return false; }    

    $folderDir = CERT_PATH . $carpetaCurso;
    $jsonDir = DIRS_PATH . $carpetaCurso.".json";
    $permisos = 0755;    

    try{
        //PREPARAR VALORES DEFAULT
        $key = bin2hex(random_bytes(8));
        $default = [["key" => $key, "id" => "0000",  "ruta" => "curso/archivo.pdf"]];
        $json_data = json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        //CREAR CARPETA VACIA EN CERTIFICADOS/
        if (!mkdir($folderDir, $permisos, true) && $json_data) {
            return ["success" => false, "message" => "No se pudo crear la carpeta"];   
        }

        //CREAR JSON EN DIRECTORIOS/
        if (!file_put_contents($jsonDir, $json_data)) {
            return ["success" => false, "message" => "No se pudo escribir el archivo $jsonDir"];  
        }

        return true;
    }catch(Exception $ex){
        return ["sucess" => false, "message" => "FALLO EN CREAR CARPETA " . $ex -> getMessage()];
    }
}

function rmdir_recursive($dir) {
    if (!is_dir($dir)) return false;
    $files = array_diff(scandir($dir), array('.', '..'));  // Escanear contenido
    
    // Si es un directorio, llama a recursion
    // Si es un archivo, unlink
    foreach ($files as $file) {
        (is_dir("$dir/$file")) ? rmdir_recursive("$dir/$file") : unlink("$dir/$file");
    }
    return rmdir($dir); // Una vez vacío, borramos el directorio raíz
}


function EraseFolder(string $carpetaCurso) {
    if(!is_dir(CERT_PATH)){ return false; }

    //Preparar rutas
    $folderTarget = CERT_PATH . $carpetaCurso;
    $jsonTarget = DIRS_PATH . $carpetaCurso . ".json";

    //Proceso Borrar JSON
    if(file_exists($jsonTarget)){
        try {
            unlink($jsonTarget);
        } catch (Exception $e) {
            return ["success" => false, "message" => "ERROR AL BORRAR " . $e -> getMessage()];
        }
    }

    //BORRAR FOLDER Y CONTENIDOS
    if(is_dir($folderTarget)){
        try {
            return rmdir_recursive($folderTarget);
        } catch (Exception $e) {
            return ["success" => false, "message" => "ERROR AL BORRAR CONTENIDO: " . $e->getMessage()];
        }
    }
}


class CoursesController {
    //INSERT
    public function InsertCourse(){
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No se recibieron datos válidos"]; 
        }

        //Extraer credenciales (STATE DE REACT)
        $id =  $datos['id'] ?? '';
        $sigla = $datos['sigla'] ?? '';
        $nombre = $datos['name'] ?? ''; 
        $year = $datos['year'] ?? '';

        if (empty($id) || empty($nombre) || empty($sigla) || empty($year)) {
            return ["success" => false, "message" => "Faltan campos obligatorios para procesar el curso"];
        }

        //COMPROBAR EXISTENTE
        if(CheckData($id)){
            return ["success" => false, "message" => "YA EXISTE UNA CARPETA CON ESTE ID"];
        }

        //PROCESO CREAR CARPETA
        $nombreCarpeta = strtoupper($year . "_" . $sigla);
        if(!CreateFolder($nombreCarpeta)){
            return ["success" => false, "message" => "ERROR AL CREAR CARPETA (CREATE FOLDER)"];
        }

        //PROCESO ESCRIBIR JSON
        if(!WriteJson(1 , [$id,$sigla,$nombre,$year])){
            return ["success" => false, "message" => "ERROR AL CREAR CARPETA (WRITE JSON)"];
        }

        return ["success" => true, "message" => "CARPETA $nombreCarpeta CREADA"];
    }
    
    //DELETE
    public function DeleteCourse(){ 
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); 
        $datos = json_decode($json, true);
        if (!$datos) {
            return ["success" => false, "message" => "No se recibieron datos válidos"];
        }

        $id = $datos['id'] ?? '';
        $sig = $datos['sigla'] ?? '';
        $year = $datos['year'] ?? '';
        $folderTarget = $year . "_" . $sig;

        if (empty($id) || empty($sig) || empty($year)) {
            return ["success" => false, "message" => "No hay suficientes datos para procesar"];
        }

        //PROCESSO BORRAR FOLDER
        if(!EraseFolder($folderTarget)){
            return ["success" => false, "message" => "No se pudo eliminar la carpeta"];    
        }
         
        //PROCESO BORRAR ITEM DEL JSON
        if(!WriteJson(0,[$id])){
            return ["success" => false, "message" => "El archivo de escritura no existe"];
        }

        return ["success" => true, "message" => "DIRECTORIO ELIMINADO"];
    }
}


try 
{
    $controller = new CoursesController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'OPTIONS':
            http_response_code(200);
            exit();

        case 'GET':
            echo json_encode(GetDirectoryJSON());
            break;

        case 'POST':
            echo json_encode($controller->InsertCourse());
            break;
             
        case 'DELETE':
            echo json_encode($controller->DeleteCourse());
            break;
    }

} catch (Exception $th) {
    echo json_encode(["success" => false, "message"=> "ALGO SALIO MAL " . $th -> getMessage()]);
}
?>