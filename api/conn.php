<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Parámetros de conexión
$host = "localhost";   // Servidor
$user = "root";     // Usuario de MySQL
$pass = "";  // Contraseña
$db   = "archivos";   // Nombre de la base de datos

// Crear conexión
$mysqli = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($mysqli->connect_error) {
    die("Error de conexión: " . $mysqli->connect_error);
}




