<?php
header("Access-Control-Allow-Origin: https://datametrika.com/module_upload/");
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

require_once dirname(__DIR__, 3) . '/ProyDatametrika_docpoint/config.php'; //INICIAR VARIABLES GLOBALES

//ESCRIBIR DIRECTORIO GENERAL JSON PARA QUE LO LEA LA PAGINA PRINCIPAL
function WriteJson($mode, $folderData){
    $json_main = DOC_PATH . "directory.json"; //docpoint/directory
    if(!file_exists($json_main)){ return false; }
    
    //Extraer JSON
    $json = file_get_contents($json_main); 
    $data = json_decode($json, true);
    if(!$data){ return false; }

    //MODE = 1 PUSH
    if($mode === 1 && count($folderData) === 5){
        $newItem = [
            "key" => $folderData[0],
            "id" => intval($folderData[1]),
            "sigla" => $folderData[2],
            "name" => $folderData[3],
            "year" => $folderData[4],
        ];

        //AGREGAR NUEVOS DATOS
        array_push($data,$newItem);        
        $newData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
       
        // MODIFICAR Directory.json;
        if (file_put_contents($json_main, $newData)) {
            return true;
        }
        else{
            return false;
        }
    }
    else ////MODE = 0 POP
    {
        if(count($folderData) !== 1) { return false; }
        
        //BORRAR POR ID
        $attrTarget = $folderData[0];  
        
        if(is_array($data)){
            $newData = array_filter($data,function ($item) use($attrTarget){
                return $item['id'] !== $attrTarget;
            });
        }

        //GUARDAR CAMBIOS
        array_values($newData);
        $newData = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($json_main, $newData)) {
            return true;
        }
        else{
            return false;
        }
    }//if 0
}



//CREA CARPETA PARA ARCHIVOS Y JSON PARA LECTURA DE QR
function CreateFolder(string $carpetaCurso){
    $folderDir = CERT_PATH . $carpetaCurso;
    $jsonDir = DIRS_PATH . $carpetaCurso.".json";
    $permisos = 0755;    

    try{
        if (!is_dir(CERT_PATH)) { return false; }

        //PREPARAR VALORES
        $default = [["id" => "0000",  "ruta" => "curso/archivo.pdf"]];
        $json_data = json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        //PROCESAR CARPETA VACIA EN CERTIFICADOS/
        if (!mkdir($folderDir, $permisos, true) && $json_data) {
            return ["success" => false, "message" => "No se pudo crear la carpeta"];   
        }

        //PROCESAR JSON EN DIRECTORIOS/
        if (!file_put_contents($jsonDir, $json_data)) {
            return ["success" => false, "message" => "No se pudo escribir el archivo $jsonDir"];  
        }

        return true;
    }catch(Exception $ex){
        return ["sucess" => false, "message" => "FALLO EN CREAR CARPETA $ex"];
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
            return ["success" => false, "message" => "ERROR AL BORRAR $e"];
        }
    }

    //BORRAR FOLDER Y CONTENIDOS
    if(is_dir($folderTarget)){
        try {
            if (rmdir_recursive($folderTarget)) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "ERROR AL BORRAR CONTENIDO: " . $e->getMessage()];
        }
    }
}



class CoursesController {
    //VER DIRECTORIO JSON    
    public function GetCourses(){
        $json = file_get_contents(DOC_PATH . 'directory.json');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No existe el directorio general"]; 
        }
        return $datos;
    }

    //INSERT
    public function InsertCourse(){
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No se recibieron datos válidos"]; 
        }

        //Extraer credenciales (STATE DE REACT)
        $id = $datos['id'] ?? '';
        $nombre = $datos['name'] ?? ''; 
        $sigla = $datos['sigla'] ?? '';
        $year = $datos['year'] ?? '';
        $key = bin2hex(random_bytes(8));  // Genera una cadena de 16 caracteres alfanuméricos únicos
        
        if (empty($id) || empty($nombre) || empty($sigla) || empty($year)) {
            return ["success" => false, "message" => "Faltan campos obligatorios para procesar el curso"];
        }

        $nombreCarpeta = $year . "_" . $sigla;
        //PROCESO CREAR CARPETA
        if(!CreateFolder($nombreCarpeta)){
            return ["success" => false, "message" => "ERROR AL CREAR CARPETA"];
        }

        //PROCESO ESCRIBIR JSON
        if(!WriteJson(1,[$key,$id,$sigla,$nombre,$year])){
            return ["success" => false, "message" => "ERROR AL REGISTRAR EL CURSO"];
        }

        return ["success" => true, "message" => "CARPETA  $nombreCarpeta CREADA"];
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
        case 'GET':
            echo json_encode($controller->GetCourses());
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