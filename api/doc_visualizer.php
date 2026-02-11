<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


class VisualDocsController {
    //SE DESPLIEGA EN FORMULARIO
    public function GetCoursesList(){
        $json = file_get_contents('../doc-point/directory.json');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No existe el directorio general"]; 
        }
        return $datos; 
    }

    //ENVIA DATOS A URL DOCUMENT VIEW HACE EL FETCH
    //DEVUELVE LA RUTA TOTAL
    public function GetDocumentPath(){
        $directorio = '../doc-point/directorios';
        
        //Extraer INPUT
        $json = file_get_contents('php://input');
        $datos = json_decode($json, true);
        if (!$datos) { 
            return ["success" => false , "message" => "No existe el directorio general"]; 
        }
        
        $sigla = $datos['fsigla'] ?? '';
        $num = $datos['fnum'] ?? '';
        $year = $datos['fyear'] ?? '';
        
        $iniciales = $year."_".$sigla;
        $jpoint = $directorio."/".$iniciales.".json";

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



