<?php

$token = $_GET['token'];

//http_request(HTTP_METH_GET, 'https://accounts.google.com/o/oauth2/revoke?token='.$token);

//echo true;

//$req = new HttpRequest();

//$meth = $req::METH_GET;
////
////$req->setUrl('https://accounts.google.com/o/oauth2/revoke');
//$req->setMethod($meth);
////$req->setQueryData(['token' => $token]);
//
//$req->send();
//
////if ($req->getResponseCode() == 200) {
    echo "It worked!";
////}

//http://localhost:8888/events/server/google_logout.php?token=ya29.TQAy0mcrd4xjWRoAAAChXlN_rnSyIQWFqDZ6B64kSSD1oMXIsatHYfRuCjBFog