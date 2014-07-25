<?php

require_once "classes/Lists.php";

// get the information passed from the app via the POST method
$_POST = json_decode(file_get_contents("php://input"), true);

// save the post information as local variables
$items = $_POST['items'];
$title = mysql_real_escape_string($_POST['title']);
$category = isset($_POST['category']) ? $_POST['category'] : null;
$google_id = $_POST['google_id'];

$List = new \classes\Lists();

$the_list = $List->create_list($google_id, $title, $category, $items);

print_r($the_list);