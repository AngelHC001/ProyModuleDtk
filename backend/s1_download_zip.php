<?php
require_once '../config.php';
//dirname(__DIR_,3)

header("Access-Control-Allow-Origin: " . BASE_URL);
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$folderName = $_GET['folder'] ?? ''; // 1. Recibir nombre de la carpeta 
$sourcePath = CERT_PATH . $folderName;

// Validaciones de seguridad básicas
if (empty($folderName) || !is_dir($sourcePath)) {
    die("Error: El directorio no existe o no se especificó uno válido.");
}

//Configuración del ZIP
$zip = new ZipArchive();
$tempZipFile = tempnam(sys_get_temp_dir(), 'zip'); // Crea un archivo temporal

if ($zip->open($tempZipFile, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
    
    // Función para añadir archivos de forma recursiva
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($sourcePath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );

    foreach ($files as $name => $file) {
        if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            // El nombre dentro del zip será relativo a la carpeta del curso
            $relativePath = substr($filePath, strlen(realpath($sourcePath)) + 1);
            $zip->addFile($filePath, $relativePath);
        }
    }

    $zip->close();

    //Enviar el archivo al navegador
    header('Content-Type: application/zip');
    header('Content-Disposition: attachment; filename="' . $folderName . '.zip"');
    header('Content-Length: ' . filesize($tempZipFile));
    header('Pragma: no-cache');
    header('Expires: 0');
    
    readfile($tempZipFile);

    //Limpieza: Borrar el archivo temporal del servidor
    unlink($tempZipFile);
    exit;

} else {
    die("Error al crear el archivo comprimido.");
}
?>