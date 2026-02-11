<?php
// config.php (Ubicado en la raíz)

// Definimos la ruta absoluta de la raíz del proyecto
define('ROOT_PATH', __DIR__ . DIRECTORY_SEPARATOR);

// Definimos rutas a carpetas específicas para no repetirlas
define('DOC_PATH', ROOT_PATH . 'doc-point' . DIRECTORY_SEPARATOR);
define('API_PATH', ROOT_PATH . 'api' . DIRECTORY_SEPARATOR);

// (Opcional) Configuración de URLs para el frontend (React)
//define('BASE_URL', 'http://tu-dominio.com/');
?>