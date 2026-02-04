<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


//CREA CARPETA PARA ARCHIVOS Y JSON PARA LECTURA DE QR
function CreateFolder(string $carpetaCurso){
    $endpoint = "../doc-point/certificados";
    $permisos = 0755;    

    try{
        //El directorio no existe? Interrumpir accion
        if (!is_dir($endpoint)) {
            return false; 
        }

        //EL DIRECTORIO EXISTE SIEMPRE
        $directorio = "$endpoint/$carpetaCurso";
        $json_empty = [["id" => 0000,  "archivo" => "curso-num.pdf"]]; //valor default
        $json_data = json_encode($json_empty,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        //CREAR CARPETA (MKDIR) Y JSON (FILEPUT)
        if (mkdir($directorio, $permisos, true) && $json_data) {
            $fileName = "../doc-point/$carpetaCurso.json";  // Nombre del archivo json a crear
            if (file_put_contents($fileName, $json_data) === false) {
                throw new Exception("No se pudo escribir el archivo $fileName");
            }
            return true;
        } else {
            return false;
        }
       
    }catch(Exception $ex){
        echo json_encode(["sucess" => false, "message" => "FALLO EN CREAR CARPETA $ex"]);
    }
}


function EraseFolder(string $carpetaCurso) {
    $endpoint = "../doc-point/certificados";
    $jsonTarget = "../doc-point/$carpetaCurso.json";
    
    if(!is_dir($endpoint)){
        return false;
    }

    //Borrar JSON
    if(file_exists($jsonTarget)){
        try {
            unlink($jsonTarget);
        } catch (Exception $e) {
            echo json_encode(["success" => false, "message" => "ERROR AL BORRAR $e"]);
        }
    }

    $dir = "$endpoint/$carpetaCurso";
    return rmdir($dir); //Borrar carpeta
      
    /*    
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
    //SELECT VISUALIZATION
    public function GetCourses(){
        require_once 'conn.php'; //Habilitar conexion
        $select = "SELECT CLAVE, SIGLA, ANIO, NOMBRE, IDQR FROM CURSO ORDER BY ANIO DESC";
        $req = mysqli_query($mysqli,$select);
        $response = [];
        if($req){
            $response = mysqli_fetch_all($req);
        }
        return $response;
    }

    //INSERT
    public function InsertCourse(){
        require_once 'conn.php';
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        //Extraer credenciales (STATE DE REACT)
        $id = $datos['id'] ?? '';
        $nombre = $datos['name'] ?? ''; 
        $sigla = $datos['sigla'] ?? '';
        $year = $datos['year'] ?? '';
        $key = random_int(100,1000);
        
        $nombreCarpeta = "$year-$sigla";
        //SI CREA LA CARPETA REGISTRA EL SQL
        if(CreateFolder($nombreCarpeta)){
            $insert = "INSERT INTO CURSO VALUES ($id,'$sigla','$nombre',$key,$year)";
            $req = mysqli_query($mysqli,$insert);
            if($req){
                return ["success" => true, "message" => "CARPETA CREADA"];
            }
            else{
                return ["success" => false, "message" => "ERROR AL REGISTRAR EL CURSO"];
            }
        }
        else
        {
            return ["success" => false, "message" => "EL DOC POINT NO EXISTE"];
        }
    }

    //DELETE
    public function DeleteCourse(){
        require_once 'conn.php';
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
    echo json_encode(["message"=> "ALGO SALIO MAL $th"]);
}

?>