<?php

require "classes/User.php";

// create the User object
$User = new \classes\User();

// get the information passed from the app via the POST method
$user_data = json_decode(file_get_contents("php://input"), true);

$db_result = $User->set_user($user_data['google_id'],$user_data['email'],$user_data['displayName']);

echo $db_result;