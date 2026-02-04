<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

class UsuarioController {
    
    //SELECT VISUALIZATION --> Hacer un select, devolver json con los datos
    public function GetUsers(){
        require_once 'conn.php'; //Habilitar conexion
        $select = "SELECT IDUSUARIO, NOMBRE FROM USUARIO";
        $req = mysqli_query($mysqli,$select);
        $response = [];
        if($req){
            $response = mysqli_fetch_all($req);
        }
        return $response;
    }

    //INSERT
    public function InsertUser(){
        require_once 'conn.php';
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        // 4. Extraer credenciales
        $id = random_int(100,1000);
        $user = $datos['username'] ?? '';

        //CREAR PASS DEFAULT
        $hashed = password_hash('dtmk_usuario',PASSWORD_DEFAULT);
        $insert = "INSERT INTO USUARIO VALUES ($id,'$user','$hashed')";
        $req = mysqli_query($mysqli,$insert);
        if($req){
            return ["success" => true, "message" => "USUARIO INSERTADO","hashed" => $hashed];
        }
        else{
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }
    }

    //DELETE
    public function DeleteUser(){
        require_once 'conn.php';
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        //Extraer credenciales
        $id = $datos['id'] ?? '';
        $user = $datos['username'] ?? '';

        //CREAR CONSULTA
        $delete = "DELETE FROM USUARIO WHERE IDUSUARIO = $id AND NOMBRE = '$user'";
        $req = mysqli_query($mysqli,$delete);
        if($req){
            return ["success" => true, "message" => "USUARIO ELIMINADO"];
        }
        else{
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }
    }


    //UPDATE
    public function UpdateUser(){
        require_once 'conn.php';
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) {
            throw new Exception("No se recibieron datos válidos");
        }

        //Extraer credenciales
        $user = $datos['username'] ?? '';
        $newpass = $datos['password'] ?? '';

        //*HASHEAR
        $hashPass = password_hash($newpass,PASSWORD_DEFAULT);

        //CREAR CONSULTA
        $update = "UPDATE USUARIO SET CLAVE = '$hashPass' WHERE NOMBRE = '$user'";
        
        $req = mysqli_query($mysqli,$update);
        if($req){
            return ["success" => true, "message" => "CLAVE CAMBIADA"];
        }
        else{
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }
    }

}



try {
    //INICIAR LOGICA
    $controller = new UsuarioController();
    switch($_SERVER['REQUEST_METHOD']){
        case 'GET':
            echo json_encode($controller->GetUsers());
            break;

        case 'POST':
            echo json_encode($controller->InsertUser());
            break;
        
        case 'PUT':
            echo json_encode($controller->UpdateUser());
            break;

        case 'DELETE':
            echo json_encode($controller->DeleteUser());
            break; 
    }

} catch (Throwable $th) {
    echo json_encode(["message"=> $th]);
}

?>








