<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Recibe el nombre del archivo
require_once '../config.php';

$archivo = $_GET['filename']; 
$rutaReal = CERT_PATH . $archivo;

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