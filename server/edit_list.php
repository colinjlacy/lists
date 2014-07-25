<?php

require_once "classes/Lists.php";

$List = new \classes\Lists();

// get the information passed from the app via the POST method
$_POST = json_decode(file_get_contents("php://input"), true);

// save the post information as local variables
$items = $_POST['items'];
$list_id = $_POST['list_id'];
$google_id = $_POST['google_id'];

// create a boolean to determine whether or not the logged-in user owns the list
$owns_list = $List->check_id($google_id, $list_id);

// if they do...
if ($owns_list) {

    // run the edit method
    $returnedID = $List->edit_list($list_id, $items);

    // and return the list ID for Angular to route to
    echo $returnedID;

}