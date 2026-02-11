<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../config.php';

function WriteJson(int $mode, $userData){
    //ExtraerJSON
    $jsonPath = DOC_PATH . "users.json";
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
        $jsonPath = DOC_PATH . "users.json";
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
        $json = file_get_contents('php://input'); 
        $datos = json_decode($json, true);
        if (!$datos) { return ["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"]; }

        //Extraer credenciales
        $id = $datos['id'] ?? '';

        if(!WriteJson(0,[$id])){
            return ["success" => false, "message" => "ALGO SALIO MAL"];
        }

        return ["success" => true, "message" => "USUARIO ELIMINADO"];
    }


    //UPDATE
    public function UpdateUser(){
        $input = file_get_contents('php://input'); 
        $datos = json_decode($input, true);
        if (!$datos) { return ["success" => false, "message" => "ALGO SALIO MAL"]; }

        //Extraer credenciales
        $userId = $datos['id'] ?? '';
        $userName = $datos['username'] ?? '';
        $currentPass =  $datos['currentPassword'] ?? '';
        $newPass = $datos['newPassword'] ?? '';

        //EXTRAER JSON
        $jsonPath = DOC_PATH . 'users.json'; 
        $jsonContent = file_get_contents($jsonPath);
        $users = json_decode($jsonContent, true); 

        $success = false;
        $message = "Usuario no encontrado";
        
        //PROCESO MODIFICAR ARRAY
        foreach ($users as &$user) { 
            if ($user['id'] == $userId) {
                // Verificar contraseña actual antes de cambiar
                if (password_verify($currentPass, $user['pass'])) {
                    $user['pass'] = password_hash($newPass, PASSWORD_DEFAULT);
                    $success = true;
                    $message = "Contraseña actualizada correctamente";
                    break;
                } else {
                    $message = "La contraseña actual es incorrecta";
                    return ["success" => false, "message" => $message];
                }
            }
        }

        if ($success) {  
            file_put_contents($jsonPath, json_encode($users, JSON_PRETTY_PRINT));
        }

        return ["success" => $success, "message" => $message];
    }
}
 
    

try {
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