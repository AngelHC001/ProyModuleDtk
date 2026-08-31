<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_origins = ['https://datametrika.com', 'https://www.datametrika.com'];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

//header("Access-Control-Allow-Origin: https://datametrika.com");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//CONTROL DE CACHE
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
// Las instrucciones más importantes para HTTP 1.1
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false); 
header("Pragma: no-cache"); // Para compatibilidad con HTTP 1.0

require_once dirname(__DIR__, 3) . '/ProyDatametrika_docpoint/config.php';

class VisualDocsController {
    //SE DESPLIEGA EN FORMULARIO
  
    public function GetCoursesList(){
        $json = file_get_contents(DOC_PATH . 'directory.json');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No existe el directorio general"]; 
        }
        return $datos; 
    }

    //ENVIA DATOS A URL DOCUMENT VIEW HACE EL FETCH
    //DEVUELVE LA RUTA TOTAL
    public function GetDocumentPath(){
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No existe el directorio general"]; 
        }
        
        $sigla = $datos['fsigla'] ?? '';
        $num = $datos['fnum'] ?? '';
        $year = $datos['fyear'] ?? '';
        
        $iniciales = $year."_".$sigla;
        $jpoint = DIRS_PATH . $iniciales. ".json";

        //EXISTE EL JSON?
        if(!file_exists($jpoint)){
            return ["success" => false , "message" => "No existe el directorio $iniciales"]; 
        }
        //Buscar ruta en JSON
        $json_dir = file_get_contents($jpoint);
        $jdata = json_decode($json_dir, true);
        if (!$jdata) { 
            return ["success" => false , "message" => "No existe el directorio $iniciales"]; 
        }
        //Aquella ruta cuyo id es el buscado
        $foundDoc = null;
        foreach($jdata as $item){
            if($item['id'] === $num){
                $foundDoc = $item['ruta'];     
                break;
            }        
        }

        if(!$foundDoc){
            return ["success" => false , "message" => "Documento no encontrado"]; 
        }

        //PREPARAR RUTA
        $rutaArchivo = $foundDoc;
        return ["success" => true , "message" => "Documento encontrado", "path" => $rutaArchivo]; 

    }
}

try
{
    $controller = new VisualDocsController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            echo json_encode($controller -> GetCoursesList(),JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); 
            break;
        
        case 'POST':
            echo json_encode($controller -> GetDocumentPath(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            break;
    }
}
catch(Exception $ex){
    echo json_encode(["success" => false, "message"=> "ALGO SALIO MAL $th"]);
}

?>



