<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

try {
    require_once '../config.php'; //INICIAR RUTAS GLOBALES
    
    //Capturar encapsulados JSON que envía React
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);
    if (!$datos) {
        echo json_encode(["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"]);
        exit;
    }

    //Extraer credenciales
    $userInput = $datos['username'] ?? '';
    $passInput = $datos['password'] ?? '';

    //Consultar en users JSON
    $jsonDir = DOC_PATH . 'users.json';
    $jsonDoc = file_get_contents($jsonDir); 
    if ($jsonDoc === false) {
        throw new Exception("No se pudo leer el archivo de usuarios $jsonDir");
    }

    //VALIDACIÓN DE ARCHIVO USUARIOS
    $users = json_decode($jsonDoc, true);
    if (!$users) {
        echo json_encode(["success" => false, "message" => "ERROR INTERNO: ALGO SALIO MAL CON LA DB "]);
        exit; 
    }

    //BUSCAR USUARIO
    $userFound = null;
    foreach ($users as $user) {
        if ($user['name'] === $userInput) {
            $userFound = $user;
            break;
        }
    }

    if (!$userFound) {
        echo json_encode(["success" => false, "message" => "CREDENCIALES INCORRECTAS (Usuario)"]);
        exit;
    }

    //PASSWORD VERIFY
    if(password_verify($passInput, $userFound['pass'])){ 
        $response = ["success" => true, 
                        "token" => "SECRET_KEY_WORD", 
                        "username" => $userFound['name'], 
                        "id" => $userFound['id']];
        echo json_encode($response);
    }
    else {
        echo json_encode(["success" => false, "message" => "CREDENCIALES INCORRECTAS"]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "ALGO SALIO MAL: " . $e -> getMessage()]);
}
?>