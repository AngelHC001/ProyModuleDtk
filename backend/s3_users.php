<?php
require_once '../config.php';
//require_once dirname(__DIR__, 3) . '/ProyDatametrika_docpoint/config.php';
header("Access-Control-Allow-Origin: " . BASE_URL);
header("Access-Control-Allow-Methods:  GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

define('USERS_DOC', DOC_PATH . "users.json");

//AUXILIAR GENERAL
function getUsers(){
    if(!file_exists(USERS_DOC)){ return []; }

    $content = file_get_contents(USERS_DOC);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

//SOLO HASTA 10 USUARIOS
function checkUsersLimit(){
    $users = getUsers();
    return count($users); 
}

function WriteJson(int $mode, $userData){
    //ExtraerJSON
    $users = getUsers();

    //MODE 1 => PUSH
    if($mode === 1 && count($userData) === 3){
        $jsonItem = ["id" => $userData[0] ,"name" => $userData[1], "pass" => $userData[2]]; 
        array_push($users,$jsonItem);        
    }
    else if(count($userData) === 1)  //MODE 0 => POP, POR ID
    {
        $userID = $userData[0];
        $users = array_filter($users, function ($item) use($userID){ 
                                            return (string)$item['id'] !== (string)$userID;});
        $users = array_values($users);   
    }
    else{
        return false;
    }
        //GUARDAR CAMBIOS 
        $newData = json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $bytesWritten = file_put_contents(USERS_DOC, $newData);
        return $bytesWritten !== false;
}


class UsuarioController {
    //INSERT
    public function InsertUser(){
        $json = file_get_contents('php://input'); //CHECAR
        $datos = json_decode($json, true);

        if (!$datos) { return ["success" => false, "message" => "SE RECIBIERON DATOS INVALIDOS"]; }

        //DIO SEÑAL DE QUE LLEGO A 10
        if(checkUsersLimit() === 10){
            return ["success" => false, "message" => "LIMITE DE USUARIOS ALCANZADO (10)"];
        }

        //Extraer credenciales con PassDefault
        $id = random_int(1000,10000);
        $user = $datos['username'] ?? '';
        $hashed = password_hash(DTMK_PASS,PASSWORD_DEFAULT);

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

        if(checkUsersLimit() === 3 ){
            return ["success" => false, "message" => "LIMITE MINIMO DE USUARIOS (3)"];
        }

        //Extraer credenciales
        $id = $datos['id'] ?? '';
        if(!WriteJson(0,[$id])){ return ["success" => false, "message" => "ALGO SALIO MAL"];}
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
            echo json_encode(getUsers());
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