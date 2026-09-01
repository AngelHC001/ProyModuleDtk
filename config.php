<?php

// config.php (Ubicado en la raíz)

// Definimos la ruta absoluta de la raíz del proyecto
// ProyDatametrika_docpoint
define('ROOT_PATH', __DIR__ . '/');

// Definimos rutas a carpetas específicas para no repetirlas
define('DOC_PATH', ROOT_PATH . 'doc-point' . '/');
define('CERT_PATH', ROOT_PATH . 'doc-point/certificados' . '/');
define('DIRS_PATH', ROOT_PATH . 'doc-point/directorios' . '/');

define('DTMK_PASS','dtmk_usuario');
define('BASE_URL','http://localhost:5173'); //https://datametrika.com/module_upload/ 

?>