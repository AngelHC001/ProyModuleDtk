<?php
try {
    // 1. Encabezados obligatorios para que React reciba JSON
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json");
    // 2. Incluir tu conexión
    require_once 'conn.php';
    
    // 3. Capturar el JSON que envía React
    $json = file_get_contents('php://input'); //CHECAR
    $datos = json_decode($json, true);

    if (!$datos) {
        throw new Exception("No se recibieron datos válidos");
    }

    // 4. Extraer credenciales
    $user = $datos['username'] ?? '';
    $pass = $datos['password'] ?? '';
   
    //Los campos son required, llegaran llenos si o si
    $query = "SELECT NOMBRE, CLAVE FROM USUARIO WHERE NOMBRE = '$user'";
    $req = mysqli_query($mysqli,$query);
    $response = [];

    if ($req && $req->num_rows > 0) {
       
        while($row = mysqli_fetch_assoc($req)){
            if(password_verify($pass, $row['CLAVE'])){ //PASSWORD VERIFY
                $response = ["success" => true, "token" => "SECRET_KEY_WORD", "username" => $row['NOMBRE']];
            }
            else {
                $response = ["success" => false, "message" => "ERROR FETCH"];
            }
        }
        
    }//if
    echo json_encode($response); 
    
} catch (Exception $e) {
    echo json_encode(["message"=>$e]);
}

?>










