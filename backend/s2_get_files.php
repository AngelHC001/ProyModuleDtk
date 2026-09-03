<?php
require_once '../config.php';
//require_once dirname(__DIR__, 3) . '/ProyDatametrika_docpoint/config.php';

header("Access-Control-Allow-Origin: " . BASE_URL);
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//CONTROL DE CACHE
header("Expires: Tue, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// Las instrucciones más importantes para HTTP 1.1
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false); 
header("Pragma: no-cache"); // Para compatibilidad con HTTP 1.0

//EXTRAE EL JSON INDICE DE LA CARPETA
function GetFiles(){
    $input = file_get_contents('php://input'); 
    $datos = json_decode($input, true); 
    if (!$datos) {
        return ["success" => false, "message" => "No se recibieron datos válidos"];
    }

    $nombreFolder = $datos['folder'] ?? '';   //YEAR_SIGLA
    $jsonFolder = DIRS_PATH . $nombreFolder . ".json";
    
    if(!file_exists($jsonFolder)){
        return ["success" => false, "message" => "ERROR, EL ARCHIVO DE ESCRITURA NO EXISTE"]; 
    }
    
    $registros = file_get_contents($jsonFolder);
    return json_decode($registros,true);   //RETORNA EL JSON ENCODED
}

try 
{
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        echo json_encode(GetFiles(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $th) {
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>