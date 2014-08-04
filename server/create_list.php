<?php

require_once "classes/Lists.php";

$List = new \classes\Lists();

// get the information passed from the app via the POST method
$_POST = json_decode(file_get_contents("php://input"), true);

// save the post information as local variables
$items = $_POST['items'];
$title = $_POST['title'];
$category = isset($_POST['category']) ? $_POST['category'] : null;
$google_id = $_POST['google_id'];

$the_list = $List->create_list($google_id, $title, $category, $items);

print_r($the_list);