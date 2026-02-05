<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");


//VISUALIZATION
function GetFiles(){
    //Capturar el JSON que envía React
    $input = file_get_contents('php://input'); 
    $datos = json_decode($input, true); //Nombre folder YEAR-SIGLA

    if (!$datos) {
        throw new Exception("No se recibieron datos válidos");
    }

    //EXTRAER JSON CON LOS REGISTROS
    $nombreFolder = $datos['folder'] ?? '';
    $endpoint = trim("../doc-point/$nombreFolder.json");
    $registros = file_get_contents($endpoint);

    if (!$registros) {
        return ["success" => false, "message" => "ERROR, EL ARCHIVO DE ESCRITURA NO EXISTE"];
    }

    //RETORNA EL JSON ENCODED
    return json_decode($registros,true);
}


try 
{
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        echo json_encode(GetFiles(),JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $th) {
    return json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>