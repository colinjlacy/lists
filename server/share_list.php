<?php

// get the information passed from the app via the POST method
$_POST = json_decode(file_get_contents("php://input"), true);

$recipients = $_POST['listShare'];
$message = $_POST['message'];
$list_id = $_POST['list_id'];
$creator_id = $_POST['creator_id'];
$creator_display = $_POST['creator_display'];

// get the Share class
require "classes/Share.php";
$Share = new \classes\Share();

$result = [];

foreach($recipients as $recipient) {

    $user_test = $Share->user_exists($recipient);

    if ($user_test) {

//        $storage = $shared_lists;

        $shared_lists = $user_test['edit_access'];

        $Share->add_to_share_list($recipient, $shared_lists, $list_id);

        array_push($result, "share access granted");

    } else {

        $holding = $Share->set_holding($recipient, $list_id, $creator_id, $creator_display);

        array_push($result, $holding);

    }

}

if ($result) { print_r($result); }

//echo "FART";