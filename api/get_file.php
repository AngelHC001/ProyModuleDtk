<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Recibe el nombre del archivo
$archivo = $_GET['name']; 
$rutaReal = "../doc-point/certificados/" . $archivo;

if (file_exists($rutaReal)) {
    $mime = mime_content_type($rutaReal);
    header("Content-Type: $mime");
    // 'inline' para ver en el navegador, 'attachment' para descarga directa
    header("Content-Disposition: inline; filename=\"$archivo\""); 
    readfile($rutaReal);
    exit;
} else {
    http_response_code(404);
}

?>