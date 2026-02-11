<?php
// config.php (Ubicado en la raíz)

// Definimos la ruta absoluta de la raíz del proyecto
define('ROOT_PATH', __DIR__ . '/');

// Definimos rutas a carpetas específicas para no repetirlas
define('DOC_PATH', ROOT_PATH . 'doc-point' . '/');
define('CERT_PATH', ROOT_PATH . 'doc-point/certificados/');
define('DIRS_PATH', ROOT_PATH . 'doc-point/directorios/');

// (Opcional) Configuración de URLs para el frontend (React)
//define('BASE_URL', 'http://tu-dominio.com/');
?>