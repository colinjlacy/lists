<?php

require_once "classes/Lists.php";

// get the information passed from the app via the POST method
$list_data = $_GET['list_id'];

$Lists = new \classes\Lists();

$active_list = $Lists->simple_list_select($list_data);
$items = $Lists->get_items($list_data);

$data = [$active_list, $items];

print json_encode($data);