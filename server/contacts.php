<?php

$token = $_GET['token'];
$email = $_GET['email'];

$email = urlencode($email);

echo file_get_contents(
    'https://www.google.com/m8/feeds/contacts/'.$email.'/full?alt=json&updated-min=2009-03-16T00:00:00&max-results=1000&orderby=lastmodified&sortorder=descending&access_token='.$token
	); ?>