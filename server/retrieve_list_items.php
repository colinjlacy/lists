<?php

require_once "classes/Lists.php";

// get the information passed from the app via the POST method
$list_data = $_GET['list_id'];

$Lists = new \classes\Lists();

$items = $Lists->get_items($list_data);

echo $items;