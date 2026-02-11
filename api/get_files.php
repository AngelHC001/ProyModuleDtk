<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


//EXTRAE EL JSON INDICE DE LA CARPETA
function GetFiles(){
    require_once '../config.php';
    
    $input = file_get_contents('php://input'); 
    $datos = json_decode($input, true); 
    if (!$datos) {
        return ["success" => false, "message" => "No se recibieron datos válidos"];
    }

    $nombreFolder = $datos['folder'] ?? '';   //YEAR_SIGLA
    $jsonFolder = DIRS_PATH . $nombreFolder.".json";
    if(!file_exists($jsonFolder)){
        return ["success" => false, "message" => "ERROR, EL ARCHIVO DE ESCRITURA NO EXISTE"]; 
    }
    
    $registros = file_get_contents($jsonFolder);
    return json_decode($registros,true);   //RETORNA EL JSON ENCODED
}


try 
{
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        echo json_encode(GetFiles(),JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
} catch (Exception $th) {
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>