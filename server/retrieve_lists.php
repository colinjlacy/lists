<?php

require_once "classes/Lists.php";

// get the information passed from the app via the POST method
//$list_data = $_GET['google_id'];
$list_data = '113869913251028463109';

$Lists = new \classes\Lists();

$owned = $Lists->get_lists($list_data);

$shared = $Lists->get_shared_lists($list_data);

$lists = [
    'owned' => $owned,
    'shared' => $shared
];

//echo json_encode($lists);
print_r(json_encode($lists));