<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//ESCRIBIR DIRECTORIO GENERAL JSON PARA QUE LO LEA LA PAGINA PRINCIPAL
function WriteJson($mode, $folderData){
    $json_main = "../doc-point/directory.json";
    if(!file_exists($json_main)){ return false; }
    
    //Extraer JSON
    $json = file_get_contents($json_main); 
    $data = json_decode($json, true);
    if(!$data){ return false; }

    //MODE = 1 PUSH
    if($mode === 1 && count($folderData) === 5){
        $newItem = [
            "key" => $folderData[0],
            "id" => $folderData[1],
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
    $endpoint = "../doc-point/certificados";
    $jsonpoint = "../doc-point/directorios";

    //Crear carpeta y directorio archivos
    $folderDir = $endpoint."/".$carpetaCurso;
    $jsonDir = $jsonpoint."/".$carpetaCurso.".json";
    $permisos = 0755;    

    try{
        //El Directorio existe?
        if (!is_dir($endpoint)) { return false; }

        //PREPARAR VALORES
        $default = [["id" => "0000",  "ruta" => "curso/archivo.pdf"]];
        $json_data = json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        //PROCESAR CARPETA VACIA EN CERTIFICADOS/
        if (!mkdir($folderDir, $permisos, true) && $json_data) {
            return ["success" => false, "message" => "No se pudo escribir el archivo $jsonDir"];   
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


function EraseFolder(string $carpetaCurso) {
    $endpoint = "../doc-point/certificados";
    $jsonpoint = "../doc-point/directorios";
    if(!is_dir($endpoint)){ return false; }

    //Preparar rutas
    $folderTarget = $endpoint . "/" . $carpetaCurso;
    $jsonTarget = $jsonpoint . "/" . $carpetaCurso . ".json";

    //Processar Borrar JSON
    if(file_exists($jsonTarget)){
        try {
            unlink($jsonTarget);
        } catch (Exception $e) {
            return ["success" => false, "message" => "ERROR AL BORRAR $e"];
        }
    }

    //Procesar Borrar carpeta VACIA
    if(is_dir($folderTarget)){
        return rmdir($folderTarget); //bool termina proceso
    }

    /*    
        si no es vacia
        echo json_encode(["ms" => $dir]);
        $directory = new RecursiveDirectoryIterator($dir,RecursiveDirectoryIterator::CURRENT_AS_PATHNAME);
        $iterator = new RecursiveIteratorIterator($directory,RecursiveIteratorIterator::SELF_FIRST);
        //erase folfer files
        foreach($iterator as $file) {
            if ($file->is_dir()){
                rmdir($file->get_include_path());
            } else {
                unlink($file->get_include_path());
            }
        }
    */
}


class CoursesController {
    //VER DIRECTORIO JSON    
    public function GetCourses(){
        $json = file_get_contents('../doc-point/directory.json');
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
        $key = random_int(100,1000);
        
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

        //Extraer credenciales
        $id = $datos['id'] ?? '';
        $sig = $datos['sigla'] ?? '';
        $year = $datos['year'] ?? '';

        $folderTarget = $year . "_" . $sig;
        //PROCESSO BORRAR FOLDER
        if(!EraseFolder($folderTarget)){
            return ["success" => false, "message" => "LA CARPETA NO EXISTE"];
        }

        //PROCESO BORRAR ITEM DEL JSON
        if(!WriteJson(0,[$id])){
            return ["success" => false, "message" => "EL ARCHIVO DE ESCRITURA NO EXISTE"];
        }

        return ["success" => true, "message" => "DIRECTORIO ELIMINADO"];
    }
}


try {
    //INICIAR LOGICA
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
    echo json_encode(["success" => false, "message"=> "ALGO SALIO MAL $th"]);
}

?>