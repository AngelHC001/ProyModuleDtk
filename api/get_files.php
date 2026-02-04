<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");



//VISUALIZATION
function GetFiles(){
    //Capturar el JSON que envía React
    $json = file_get_contents('php://input'); //CHECAR
    $datos = json_decode($json, true);

    if (!$datos) {
        throw new Exception("No se recibieron datos válidos");
    }

    return ["message"=> $datos];
    //inputphp
    /*
    //$endpoint = "../doc-point/certificados/";
    //$curso = $datos['carpeta'];
    //$directorio = "$endpoint/$curso";

    if (!is_dir($directorio)) {
        return ["success" => false, "message" => "ERROR, LA CARPETA NO EXISTE"];
    }

    if (!is_readable($directorio)) {
        return ["success" => false, "message" => "ERROR, NO SE PUEDE CREAR LA CARPETA"];
    }

    if ($gestor = opendir($directorio)) {
        echo "<h2>Archivos en la carpeta:</h2>";
        echo "<ul>";

        while (($archivo = readdir($gestor)) !== false) {
            // Omitir las carpetas especiales . y ..
            if ($archivo === "." || $archivo === "..") {
                continue;
            }

            $rutaCompleta = $directorio."/".$archivo;

            // Mostrar solo archivos (no carpetas)
            if (is_file($rutaCompleta)) {
                echo "<li>" . htmlspecialchars($archivo) . "</li>";
            }
        }
        echo "</ul>";
        closedir($gestor);
    } else {
        return ["success" => false, "message" => "ERROR, NO SE PUDO ABRIR LA CARPETA"];
    } */
}

//SUBIR ARCHIVO
//Formulario procesa Carpeta, Archivo y Folio de referencia 
//El directorio fijo ../doc-point/certificados/ [CARPETA] 



try 
{
    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        echo json_encode(GetFiles());
    }

} catch (Exception $th) {
    return json_encode(["success" => false, "message" => "ALGO SALIO MAL $th"]);
}

?>