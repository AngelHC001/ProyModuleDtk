<?php
//HEADERS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

function WriteJson(int $mode, $userData){
    //ExtraerJSON
    $jsonPath = "../doc-point/users.json";
    $jsonDoc = file_get_contents($jsonPath);
    $data = json_decode($jsonDoc, true);
    
    if(!$data){ return false; }

    //MODE 1 => PUSH
    if($mode === 1 && count($userData) === 3){
        //CREAR NUEVO ITEM
        $jsonItem = ["id" => $userData[0],"name" => $userData[1], "pass" => $userData[2]]; 
        array_push($data,$jsonItem);        
        $newData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
       
        // GUARDAR CAMBIOS
        if (file_put_contents($jsonPath, $newData) === false) { return false; }
        return true;
    }
    else //MODE 0 => POP
    {
        //BORRAR POR ID Y NOMBRE
        if(count($userData) !== 1) { return false; }
        $userID = $userData[0];
      
        if(is_array($data)){
            $newData = array_filter($data,function ($item) use($userID){
                return $item['id'] !== $userID;
            });
        }

        //GUARDAR CAMBIOS 
        $newData = array_values($newData);
        $process = file_put_contents($jsonPath, json_encode($newData,JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));  
        //file_put dio falso
        if ($process === false) { return false; }
        return true;
    }//if
}


class UsuarioController {
    //Devolver json con los datos
    public function GetUsers(){
        $jsonPath = "../doc-point/users.json";
        if(!is_file($jsonPath)){
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }

        //EXTRAER ARCHIVO
        $jsonFile = file_get_contents($jsonPath);      
        return json_decode($jsonFile, true);
    }

    //INSERT
    public function InsertUser(){
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) { return ["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"]; }

        //Extraer credenciales
        $id = random_int(1000,10000);
        $user = $datos['username'] ?? '';
        $hashed = password_hash('dtmk_usuario',PASSWORD_DEFAULT);  //CREAR PASS DEFAULT
       
        //id,user,hashed
        if(!WriteJson(1,[$id,$user,$hashed])){
            return ["success" => false, "message" => "ERROR AL INSERTAR USUARIO"];
        }

        return ["success" => true, "message" => "USUARIO INSERTADO"];
    }

    //DELETE
    public function DeleteUser(){
        //require_once 'conn.php';
        //Capturar el JSON que envía React
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);
        
        if (!$datos) { return ["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"]; }

        //Extraer credenciales
        $id = $datos['id'] ?? '';

        if(!WriteJson(0,[$id])){
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }

        return ["success" => true, "message" => "USUARIO ELIMINADO"];


        //CREAR CONSULTA
        /*
        $delete = "DELETE FROM USUARIO WHERE IDUSUARIO = $id AND NOMBRE = '$user'";
        $req = mysqli_query($mysqli,$delete);
        if($req){
            return ["success" => true, "message" => "USUARIO ELIMINADO"];
        }
        else{
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }*/
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








