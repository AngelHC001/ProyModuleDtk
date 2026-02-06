<?php
try {
    // 1. Encabezados para que React reciba JSON
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
   
    //require_once 'conn.php';
    
    //Capturar el JSON que envía React
    $json = file_get_contents('php://input'); //CHECAR
    $datos = json_decode($json, true);

    if (!$datos) {
        $response = ["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"];
    }

    //Extraer credenciales
    $userInput = $datos['username'] ?? '';
    $passInput = $datos['password'] ?? '';

    //Capturar el JSON que envía React
    $jsonDir = file_get_contents('../doc-point/users.json'); //CHECAR
    $users = json_decode($jsonDir, true);
    $response = [];

    if (!$users) {
        $response = ["success" => false, "message" => "ALGO SALIO MAL"];
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
        $response = ["success" => false, "message" => "CREDENCIALES INCORRECTAS (Usuario)"];
    }

    if(password_verify($passInput, $userFound['pass'])){ //PASSWORD VERIFY
        $response = ["success" => true, 
                        "token" => "SECRET_KEY_WORD", 
                        "username" => $userFound['name'], 
                        "id" => $userFound['id']];
    }
    else {
        $response = ["success" => false, "message" => "CREDENCIALES INCORRECTAS"];
    }

    echo json_encode($response); 

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e]);
}

?>










